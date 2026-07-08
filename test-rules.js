const platformRules = require('./services/platformRules');

console.log('=== FACEBOOK RULES ===');
console.log(platformRules.getRules('facebook'));

console.log('=== LINKEDIN RULES ===');
console.log(platformRules.getRules('linkedin'));