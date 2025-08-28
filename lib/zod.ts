export const z = {
  string() {
    const validator = {
      _min: 0,
      _max: Infinity,
      min(n: number) {
        this._min = n;
        return this;
      },
      max(n: number) {
        this._max = n;
        return this;
      },
    };
    return validator;
  },
  object<T extends Record<string, any>>(shape: T) {
    return {
      safeParse(data: any): any {
        const issues: any[] = [];
        const result: any = {};
        for (const key in shape) {
          const rule: any = (shape as any)[key];
          const val = (data as any)[key];
          if (typeof val !== 'string') {
            issues.push({ path: [key], message: 'Invalid type' });
          } else {
            if (val.length < (rule._min ?? 0)) issues.push({ path: [key], message: 'Too short' });
            if (val.length > (rule._max ?? Infinity)) issues.push({ path: [key], message: 'Too long' });
            result[key] = val;
          }
        }
        if (issues.length) return { success: false, error: { issues } };
        return { success: true, data: result };
      },
    };
  },
};
export default z;
