const chalk = require('chalk');
const debug = require('debug')('meta-exec');
const execSync = require('child_process').execSync;
const path = require('path');

module.exports = function (options, cb) {

  if (options.suppressLogging === undefined) options.suppressLogging = false;

  options.dir = options.dir || process.cwd();
  options.displayDir = options.displayDir || options.dir;
  options.cmd = options.cmd || options.command;

  debug(`executing command ${options.cmd} in dir ${options.dir}`);

  var code = null;

  try {

    if ( ! options.suppressLogging) console.log(`\n${chalk.cyan(path.basename(options.displayDir))}:`)

    code = execSync(options.cmd, { cwd: options.dir, env: process.env, stdio: 'inherit' });

  } catch (err) {
    
    // a cmd error isnt a loop error,
    // we just want to output the cmd's output
    let errorMessage = `${chalk.red(path.basename(options.displayDir))} exited with error: ${err.toString()}`;
    
    if ( ! options.suppressLogging) console.error(errorMessage);
    
    if (cb) return cb(null, { error: errorMessage });

    return;

  }

  if (code) {
    
    let errorMessage = `${chalk.red(path.basename(options.displayDir))} exited with code: ${code}`;
    
    if ( ! options.suppressLogging) console.error(errorMessage);
    
    if (cb) return cb(null, { err: errorMessage });

    return;

  } 

  let success = chalk.green(`${path.basename(options.displayDir)} ✓`);

  if ( ! options.suppressLogging) console.log(success);
  
  if (cb) return cb(null, { output: success });

};