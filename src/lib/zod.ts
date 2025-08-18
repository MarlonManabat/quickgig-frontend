/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export const z = {
  literal: <T extends string>(v: T) => ({
    parse: (i: any) => {
      if (i !== v) throw new Error('invalid literal');
      return i as T;
    },
  }),
  union: (schemas: any[]) => ({
    parse: (i: any) => {
      for (const s of schemas) {
        try {
          return s.parse(i);
        } catch {
          // continue
        }
      }
      throw new Error('invalid union');
    },
  }),
  object: (shape: Record<string, any>) => ({
    parse: (i: any) => {
      if (typeof i !== 'object' || i === null) throw new Error('invalid object');
      const r: any = {};
      for (const k of Object.keys(shape)) {
        r[k] = shape[k].parse(i[k]);
      }
      return r;
    },
  }),
  boolean: () => ({
    parse: (i: any) => {
      if (typeof i !== 'boolean') throw new Error('invalid boolean');
      return i as boolean;
    },
  }),
};
export type infer<T> = any;
