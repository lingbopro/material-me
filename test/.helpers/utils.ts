export function randint(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function waitDelay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
export function waitBrowserEventLoop() {
  return waitDelay(0);
}
