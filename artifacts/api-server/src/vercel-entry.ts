/**
 * Vercel Serverless Function entry point.
 * Vercel requires a default export of a Node.js request handler.
 * Express apps are compatible with Node's IncomingMessage/ServerResponse.
 */
import app from "./app";

export default app;
