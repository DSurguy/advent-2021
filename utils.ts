export function isInspecting() {
  return /--inspect/.test(process.execArgv.join(' '));
}