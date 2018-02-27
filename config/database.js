if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://nicole:Coolio123.@ds231725.mlab.com:31725/vidjot-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}