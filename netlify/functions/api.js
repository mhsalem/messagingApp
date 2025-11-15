// netlify/functions/api.js
const serverless = require("serverless-http");

// Import the compiled Express app
const app = require("../../backend/dist/app").default;

// Create the serverless handler
const handler = serverless(app, {
  // You can add options here if needed
});

module.exports.handler = async (event, context) => {
  // Add any pre-processing here if needed
  const result = await handler(event, context);
  return result;
};