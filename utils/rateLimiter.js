// rateLimiter.js
const queue = [];
let isProcessing = false;

function processQueue() {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const { fn, resolve, reject } = queue.shift();
  fn()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      setTimeout(processQueue, 200); // 5 requests per second = 1 request every 200ms
    });
}

function rateLimiter(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    if (!isProcessing) {
      processQueue();
    }
  });
}

module.exports = rateLimiter;
