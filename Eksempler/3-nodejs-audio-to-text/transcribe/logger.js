export function debug(...params) {
  if (process.env.verbose === "true") {
    console.debug(...params);
  }
}
