// The immer library fails on ts compilation because it can't find `__DEV__`.
// This just "patches" it in.
declare const __DEV__: boolean
