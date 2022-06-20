const { log, info, done, warn, error } = require('utils')

module.exports = () => {
  log('111')
  info('222')
  done('333')
  warn('444')
  error('555')
}