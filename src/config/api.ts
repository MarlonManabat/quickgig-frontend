export const API = {
  login: '/auth/login.php',
  register: '/auth/register.php',
  me: '/auth/me.php',
  jobs: '/jobs/list.php',
  jobById: (id: string | number) => `/jobs/show.php?id=${id}`,
  // optional saved endpoints (used only if enabled)
  savedList: '/user/saved/list.php',
  savedToggle: (id: string | number) => `/user/saved/toggle.php?id=${id}`,
  apply: '/applications/create.php',
  myJobs: '/employer/jobs/list.php',
  createJob: '/employer/jobs/create.php',
  updateJob: (id: number | string) => `/employer/jobs/update.php?id=${id}`,
  toggleJob: (id: number | string) => `/employer/jobs/toggle.php?id=${id}`,
  updateProfile: '/user/profile/update.php',
  uploadResume: '/user/profile/uploadResume.php',
  deleteResume: '/user/profile/deleteResume.php',
  changePassword: '/auth/changePassword.php',
  requestPasswordReset: '/auth/requestPasswordReset.php',
  companyGet: '/employer/company/get.php',
  companyUpdate: '/employer/company/update.php',
  uploadLogo: '/employer/company/uploadLogo.php',
  publicUser: (id: string | number) => `/public/user.php?id=${id}`,
  publicCompany: (slug: string) => `/public/company.php?slug=${encodeURIComponent(slug)}`,
  conversationsMine: '/messages/list.php',
  conversationById: (id: string) => `/messages/show.php?id=${id}`,
  sendMessage: (id: string) => `/messages/send.php?id=${id}`,
  markConversationRead: (id: string) => `/messages/read.php?id=${id}`,
  startConversation: '/messages/start.php',
};

export type JobFilters = {
  q?: string;
  location?: string;
  category?: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'intern' | 'gig' | string;
  remote?: boolean;
  minSalary?: number;
  maxSalary?: number;
  sort?: 'recent' | 'salary' | 'relevance';
  page?: number;
  limit?: number;
  savedOnly?: boolean;
};

// Map UI filters -> backend query params (adjust here if backend differs)
export function mapToJobQuery(f: JobFilters) {
  return {
    q: f.q || '',
    location: f.location || '',
    category: f.category || '',
    type: f.type || '',
    remote: f.remote ? '1' : '',
    minSalary: f.minSalary != null ? String(f.minSalary) : '',
    maxSalary: f.maxSalary != null ? String(f.maxSalary) : '',
    sort: f.sort || 'recent',
    page: String(f.page ?? 1),
    limit: String(f.limit ?? 20),
    saved: f.savedOnly ? '1' : '', // backend may ignore
  };
}
