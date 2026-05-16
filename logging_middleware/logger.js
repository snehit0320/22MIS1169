const axios = require("axios");

/**
 * Log function to send logs to the evaluation service
 * @param {"backend"|"frontend"} stack
 * @param {"debug"|"info"|"warn"|"error"|"fatal"} level
 * @param {string} pkg
 * @param {string} message
 * @param {string} accessToken
 */
const Log = async (stack, level, pkg, message, accessToken) => {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Log sent:", response.data);
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};

module.exports = Log;
