// const cityName = require('./math-util').city;
// const country = require('./math-util').country;

// console.log(cityName);
// console.log(country);

const { city: cityName, country, details, state ='karnataka' } = require('./math-util');

console.log(cityName, country, state);

details();