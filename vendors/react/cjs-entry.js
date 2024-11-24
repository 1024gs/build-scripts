if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod/react.js');
} else {
  module.exports = require('./react.js');
}
