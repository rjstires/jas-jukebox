export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): CustomMatcherResult;
    }
  }
}
