exports.enrich = function(username, userId) {
  var webhookUrl = sails.config.fullcontact.webhookUrl + '/' + userId;

  var https = require('https'), options = {
    host : "api.fullcontact.com",
    path : "/v2/person.json?apiKey=" +
      sails.config.fullcontact.apiKey +
      "&email=" + encodeURIComponent(username) +
      "&webhookBody=json" +
      "&webhookUrl=" +  encodeURIComponent(webhookUrl)
  };

  https.get(options, function(res) {});
};