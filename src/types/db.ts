import type { Database } from "@/types/supabase";
export type { Database }; // type-only export (works with isolatedModules)

type Tables = Database["public"]["Tables"];
type Enums  = Database["public"]["Enums"];

export type Row<T extends keyof Tables>    = Tables[T]["Row"];
export type Insert<T extends keyof Tables> = Tables[T]["Insert"];
export type Update<T extends keyof Tables> = Tables[T]["Update"];
export type Enum<T extends keyof Enums>    = Enums[T];
