import path from 'path';

export function log(message, ...optionalParams) {
  console.log('\x1b[0;1;96m🛠 ' + message + '\x1b[0m', ...optionalParams);
}
export function logSuccess(message, ...optionalParams) {
  console.log('\x1b[0;1;92m✔ ' + message + '\x1b[0m', ...optionalParams);
}
export function logError(message, ...optionalParams) {
  console.log('\x1b[0;1;91m✖ ' + message + '\x1b[0m', ...optionalParams);
}
export function debug(message, ...optionalParams) {
  if (process.argv.includes('--debug')) {
    console.debug(message, ...optionalParams);
  }
}
export function isSubDir(parent, dir) {
  const relative = path.relative(parent, dir);
  const isSubdir =
    relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  return !!isSubdir;
}

let executedCleanupFns = [];
export function useCleanup(cleanupFn) {
  const callback = async () => {
    if (executedCleanupFns.includes(cleanupFn)) {
      return;
    }
    await cleanupFn();
    executedCleanupFns.push(cleanupFn);
  };
  process.on('beforeExit', callback);
  process.on('exit', callback);
  process.on('SIGINT', callback);
}
