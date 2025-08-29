declare module 'next-auth' {
  export function getServerSession(...args: any[]): Promise<any>;
}
