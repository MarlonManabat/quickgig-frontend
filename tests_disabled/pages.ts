export const PAGES = {
  public: ["/", "/jobs"],
  worker: ["/jobs", "/profile"],
  employer: ["/post", "/dashboard"],
  admin: ["/admin", "/admin/jobs", "/admin/users"],
};
export type Role = keyof typeof PAGES;
