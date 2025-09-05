// Ambient shims for legacy or untyped modules.

declare module "@/types/db" {
  export type Database = unknown;
  export type Tables<T extends string = string> = unknown;
  export type TablesInsert<T extends string = string> = unknown;
  export type TablesUpdate<T extends string = string> = unknown;
  export type Enums<T extends string = string> = unknown;
}

declare module "nodemailer" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyExport: any;
  export = anyExport;
}

