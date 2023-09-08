import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../db/connectDB.js';

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(async (user, cb) => {
  const userId = user.user_id;
  const query = {
    text: `SELECT user_id
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
      const { id: emailId } = profile;

      const query = {
        text: `SELECT user_id
                FROM user_oauth_accounts
                WHERE provider_user_id = $1`,
        values: [emailId],
      };
      const { rows, rowCount } = await pool.query(query);

      if (rowCount === 1) {
        cb(null, rows[0]);
      } else {
        const client = await pool.connect();

        try {
          await client.query('BEGIN');

          const {
            displayName,
            emails,
            photos,
            provider,
            _json: { email_verified: emailVerified },
          } = profile;
          const email = emails[0].value;
          const photo = photos[0].value;

          const queryRole = {
            text: 'SELECT role_id FROM user_roles WHERE role_name = $1',
            values: ['user'],
          };
          const { rows: rowsRole } = await client.query(queryRole);
          const { role_id: roleId } = rowsRole[0];

          const queryInsertUser = {
            text: `INSERT INTO users
                    (username, email, photo, role_id, is_verified, verified_at)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                    RETURNING user_id`,
            values: [displayName, email, photo, roleId, emailVerified],
          };
          const { rows: rowsUser } = await client.query(queryInsertUser);
          const { user_id: userId } = rowsUser[0];

          const queryProvider = {
            text: `SELECT provider_id FROM oauth_providers
                    WHERE provider_name = $1`,
            values: [provider],
          };
          const { rows: rowsProvider } = await client.query(queryProvider);
          const { provider_id: providerId } = rowsProvider[0];

          const queryInsertAccount = {
            text: `INSERT INTO user_oauth_accounts
                    (user_id, provider_id, provider_user_id)
                    VALUES ($1, $2, $3)`,
            values: [userId, providerId, emailId],
          };
          await client.query(queryInsertAccount);
          await client.query('COMMIT');

          cb(null, rowsUser[0]);
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
