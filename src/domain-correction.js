const leven = require('leven');

const DEFAULT_MAX_DISTANCE = 3;
const defaultHosts = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'googlemail.com',
  'yahoo.com',
  'aol.com',
  'yandex.com',
  'hotmail.fr',
  'hotmail.co.uk'
];

module.exports = domainCorrection;

function domainCorrection(customHosts = [], includeDefault = true, maxDistance = DEFAULT_MAX_DISTANCE) {
  const hosts = customHosts.concat(includeDefault ? defaultHosts : []);

  return (input) => {
    const lower = input.toLowerCase();
    if (hosts.indexOf(lower) > -1) {
      return lower;
    }
    return (hosts
      .map((goodHost) => [goodHost, leven(goodHost, lower)])
      .filter(([, score]) => score <= maxDistance)
      .sort(([, a], [, b]) => a < b ? -1 : 1)
      .shift() || [lower])[0];
  };
}
