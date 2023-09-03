const { createHash } = await import('node:crypto');
const hashString = (string) => createHash('md5').update(string).digest('hex');
export default hashString;
