// Vercel Serverless entrypoint for the Express backend.
// Vercel looks for files in the `api/` directory and wraps them as serverless functions.
// We simply import and re-export the fully configured Express app from server.js.
import app from '../server.js';

export default app;
