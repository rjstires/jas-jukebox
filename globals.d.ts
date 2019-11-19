export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeInTheDocument(): CustomMatcherResult;
    }
  }
}
