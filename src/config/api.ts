export const API = {
  login: '/auth/login.php',
  register: '/auth/register.php',
  me: '/auth/me.php',
  jobs: '/jobs/list.php',            // supports ?status=active&page&limit
  apply: '/applications/create.php', // POST application payload
};
