/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export const z = {
  string: () => ({
    parse: (i: any) => {
      if (typeof i !== 'string') throw new Error('invalid string');
      return i as string;
    },
    url() {
      return {
        parse: (i: any) => {
          if (typeof i !== 'string') throw new Error('invalid string');
          try {
            new URL(i);
            return i;
          } catch {
            throw new Error('invalid url');
          }
        },
      };
    },
    min(n: number) {
      return {
        parse: (i: any) => {
          if (typeof i !== 'string' || i.length < n) throw new Error('invalid string');
          return i;
        },
      };
    },
  }),
  coerce: {
    number: () => ({
      parse: (i: any) => {
        const n = Number(i);
        if (Number.isNaN(n)) throw new Error('invalid number');
        return n;
      },
      default(def: number) {
        return {
          parse: (i: any) => {
            if (i === undefined || i === null || i === '') return def;
            const n = Number(i);
            if (Number.isNaN(n)) throw new Error('invalid number');
            return n;
          },
        };
      },
    }),
  },
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
  object: (shape: Record<string, any>) => {
    const base = {
      parse: (i: any) => {
        if (typeof i !== 'object' || i === null) throw new Error('invalid object');
        const r: any = {};
        for (const k of Object.keys(shape)) {
          r[k] = shape[k].parse(i[k]);
        }
        return r;
      },
    };
    return {
      ...base,
      safeParse: (i: any) => {
        try {
          return { success: true, data: base.parse(i) };
        } catch (error) {
          return { success: false, error };
        }
      },
    };
  },
  boolean: () => ({
    parse: (i: any) => {
      if (typeof i !== 'boolean') throw new Error('invalid boolean');
      return i as boolean;
    },
  }),
};
export type infer<T> = any;
