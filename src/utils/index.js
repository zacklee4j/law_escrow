const contractUtils = require('./contract');
const dataUtils = require('./datatype');
const arrayUtils = require('./array');

module.exports = {
  ...contractUtils,
  ...dataUtils,
  ...arrayUtils
};