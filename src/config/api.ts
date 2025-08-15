export const API = {
  login: '/auth/login.php',
  register: '/auth/register.php',
  me: '/auth/me.php',
  jobs: '/jobs/list.php', // GET list
  jobById: (id: string | number) => `/jobs/show.php?id=${id}`, // GET details
  apply: '/applications/create.php', // POST application
};
