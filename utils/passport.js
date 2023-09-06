import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../db/connectDB.js';

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(async (user, cb) => {
  const userId = user.user_id;
  const query = {
    text: `SELECT user_id, username
            FROM users
            WHERE user_id = $1`,
    values: [userId],
  };
  const { rows } = await pool.query(query);
  cb(null, rows[0]);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const { id } = profile;

      const query = {
        text: `SELECT u.user_id, username
                FROM users u
                JOIN user_oauth_accounts uoa
                  ON uoa.user_id = u.user_id
                WHERE provider_user_id = $1`,
        values: [id],
      };
      const { rows, rowCount } = await pool.query(query);

      if (rowCount === 1) {
        cb(null, rows[0]);
      } else {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          const { displayName, emails } = profile;
          const { expires_in: expiresIn } = profile;

          const queryInsertUser = {
            text: `INSERT INTO users (username, email, role_id, is_verified, verified)
                    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                    RETURNING user_id, username`,
            values: [displayName, emails[0].value, 2, true],
          };
          const { rows: rowsUser } = await client.query(queryInsertUser);
          const { user_id: userId } = rowsUser[0];
          const expiresAt = new Date(Date.now() + expiresIn * 1000);

          const queryInsertAccount = {
            text: `INSERT INTO user_oauth_accounts (
                      user_id, provider_id, provider_user_id,
                      access_token, expires_at
                    )
                    VALUES ($1, $2, $3, $4, $5)`,
            values: [userId, 1, id, accessToken, expiresAt],
          };
          await client.query(queryInsertAccount);
          await client.query('COMMIT');

          cb(null, ...rowsUser[0]);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      }
    }
  )
);
