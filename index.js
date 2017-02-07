
module.exports = require('./lib/exec');

module.exports.register = (program) => {
  program
    .command('exec', 'run commands against your meta and child repositories')
}