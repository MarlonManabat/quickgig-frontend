export const API = {
  login: '/auth/login.php',
  register: '/auth/register.php',
  me: '/auth/me.php',
  jobs: '/jobs/list.php', // GET list
  jobById: (id: string | number) => `/jobs/show.php?id=${id}`, // GET details
  apply: '/applications/create.php', // POST application
  myJobs: '/employer/jobs/list.php', // GET my jobs
  createJob: '/employer/jobs/create.php', // POST
  updateJob: (id: number | string) => `/employer/jobs/update.php?id=${id}`, // PATCH
  toggleJob: (id: number | string) => `/employer/jobs/toggle.php?id=${id}`, // POST { published: boolean }
};
