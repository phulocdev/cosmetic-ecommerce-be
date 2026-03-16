// Use runtime require so Vercel typecheck does not expect dist at compile time.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handler = require('../dist/main')

export default handler
