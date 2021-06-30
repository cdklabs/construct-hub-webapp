type TestIds<T extends Readonly<string[]>> = {
  [key in T[number]]: string;
};

/**
 * A helper to create scoped test ids across components which can be re-used
 * in e2e and unit tests.
 */
export const createTestIds = <T extends Readonly<string[]>>(
  scope: string,
  ids: T
): TestIds<T> =>
  ids.reduce<Record<string, string>>((acc, curr) => {
    acc[curr] = `${scope}-${curr}`;
    return acc;
  }, {}) as TestIds<T>;
