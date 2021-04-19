const chalk = require('chalk');
const debug = require('debug')('meta-exec');
const cp = require('child_process');
const { getFileLocation } = require('get-meta-file');

const fileLocation = getFileLocation() || '';
const metaDir = fileLocation.replace('.meta', '');

module.exports = function (options, cb, errorCb) {
  if (options.stdio === undefined) options.stdio = [0, 1, 2];
  if (options.suppressLogging === undefined) options.suppressLogging = false;
  if (options.suppressLogging) options.stdio[1] = 'ignore';

  options.cmd = options.cmd || options.command;
  options.dir = options.dir || process.cwd();
  options.displayDir = options.displayDir || options.dir.replace(metaDir, '');
  options.parallel = options.parallel || false;

  debug(`executing command ${options.cmd} in dir ${options.dir}`);

  var code = null;

  const execPromise = options.parallel
    ? new Promise((resolve, reject) => {
        cp.exec(
          options.cmd,
          {
            cwd: options.dir,
            env: process.env,
            stdio: options.stdio,
          },
          (err, stdout, stderr) => {
            if (err) return reject(err);
            if (err) {
              let errorMessage = `${chalk.red(options.displayDir)} '${options.cmd}' exited with code: ${err}`;

              if (errorCb) errorCb(new Error(errorMessage));

              if (!options.suppressLogging) console.error(errorMessage);

              if (cb) return cb(null, { err: errorMessage });

              return;
            }

            if (!options.suppressLogging) console.log(`\n${chalk.cyan(options.displayDir)}:`);

            stdout.length && console.log(stdout.trim());
            stderr.length && console.log(stderr.trim());

            let success = chalk.green(`${options.displayDir} ✓`);

            if (!options.suppressLogging) console.log(success);
            return resolve(err ? 1 : 0);
          }
        );
      })
    : new Promise((resolve, reject) => {
        if (!options.suppressLogging) console.log(`\n${chalk.cyan(options.displayDir)}:`);
        try {
          const code = cp.execSync(options.cmd, {
            cwd: options.dir,
            env: process.env,
            stdio: options.stdio,
          });
          if (code) {
            let errorMessage = `${chalk.red(options.displayDir)} '${options.cmd}' exited with code: ${code}`;

            if (errorCb) errorCb(new Error(errorMessage));

            if (!options.suppressLogging) console.error(errorMessage);

            if (cb) return cb(null, { err: errorMessage });

            return;
          }

          let success = chalk.green(`${options.displayDir} ✓`);

          if (!options.suppressLogging) console.log(success);

          return resolve(success);
        } catch (err) {
          if (errorCb) errorCb(err);

          // if there is no error callback, we're just going to forward the output
          let errorMessage = `${chalk.red(options.displayDir)}: command '${
            options.cmd
          }' exited with error: ${err.toString()}`;

          if (!options.suppressLogging) console.error(errorMessage);

          if (cb) return cb(null, { error: errorMessage });

          return reject(1);
        }
      });

  execPromise
    .then((success) => {
      if (cb) return cb(null, { output: success });
    })
    .catch((errorMessage) => {
      if (cb) return cb(null, { error: errorMessage });
    });
};
