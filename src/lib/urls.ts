export const getAppOrigin = (): string | undefined =>
  process.env.NEXT_PUBLIC_APP_ORIGIN || undefined;
export const toAppPath = (path: string) => {
  const origin = getAppOrigin();
  return origin ? `${origin}${path}` : path;
};
