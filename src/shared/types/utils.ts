export type ObjectPaths<T> = T extends object
  ? {
      [K in Extract<keyof T, string>]: T[K] extends object
        ? K | `${K}.${ObjectPaths<T[K]>}`
        : K;
    }[Extract<keyof T, string>]
  : never;

export type PathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
