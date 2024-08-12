const axios = require("axios");

let requestCount = 0;
let resetTime = Date.now() + 60 * 1000; // 1 minute from now

exports.webflowAxios = async (config) => {
  const currentTime = Date.now();

  if (currentTime > resetTime) {
    // Reset the request count and reset time
    requestCount = 0;
    resetTime = currentTime + 60 * 1000;
  }

  if (requestCount >= 60) {
    const delay = resetTime - currentTime;
    console.log(`Rate limit reached. Waiting for ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    requestCount = 0;
    resetTime = Date.now() + 60 * 1000;
  }

  requestCount++;

  return axios(config);
};
