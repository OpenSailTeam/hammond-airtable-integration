const webhookService = require('./services/webhookService');

(async () => {
  await webhookService.createWebhook();
})();
