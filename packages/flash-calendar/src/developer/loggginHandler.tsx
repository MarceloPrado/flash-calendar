export const loggingHandler =
  (msg: string, printArgs = true) =>
  (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.log(...[msg, ...(printArgs ? args : [])].filter(Boolean));
  };
