/* eslint-disable no-console */
export const myCustomReduxLogger =
  (store: any) => (next: any) => (action: any) => {
    console.log(store);
    next(action);
  };
