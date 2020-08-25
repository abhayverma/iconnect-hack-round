'use strict'

const options = require('../options.json');

module.exports = {
  findValidCountry: (request) => {
    let foundCountry;
    options.countries.forEach(country => {
      if (request.indexOf(country) !== -1) {
        foundCountry = country;
      }
    });
    return foundCountry;
  },
  findValidPassportCountry: (request) => {
    for (const [country, regex] of Object.entries(options.passportValidator)) {
      if (request.some(item => RegExp(regex).test(item))) {
        return country;
      }
    }
    return null;
  },
  isValidProducts: (request) => {
    if (!options.products.some(product => request.indexOf(product) !== -1)) {
      return false;
    }
    return true;
  },
  findValidProductUnits: (request) => {
    let requestItems = [];
    request.forEach((item, i) => {
      if (options.products.indexOf(item) > -1) {
        if (isNaN(request[i + 1]) || request[i + 1] < 0) {
          requestItems = request[i + 1];
        } else {
          requestItems.push({
            name: item, quantity: Number(request[i + 1])
          });
        }
      }
    });
    return requestItems;
  }
};
