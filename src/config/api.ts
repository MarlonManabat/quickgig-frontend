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
  alertsList: '/alerts/list.php',
  alertsCreate: '/alerts/create.php',
  alertsUpdate: (id: string | number) => `/alerts/update.php?id=${id}`,
  alertsDelete: (id: string | number) => `/alerts/delete.php?id=${id}`,
  alertsToggle: (id: string | number) => `/alerts/toggle.php?id=${id}`,
  alertsRunDigest: '/alerts/runDigest.php',

  // Reports (public)
  reportCreate: '/reports/create.php', // POST { type:'job'|'user', targetId, reason, details? }

  // Admin moderation
  adminSummary: '/admin/summary.php', // GET { counts: { pendingJobs, reports, users } }
  adminJobsPending: '/admin/jobs/pending.php', // GET list of pending jobs
  adminJobApprove: (id: string | number) => `/admin/jobs/approve.php?id=${id}`, // POST {}
  adminJobReject: (id: string | number) => `/admin/jobs/reject.php?id=${id}`, // POST { reason? }

  adminReportsList: '/admin/reports/list.php', // GET
  adminReportResolve: (id: string | number) => `/admin/reports/resolve.php?id=${id}`, // POST { action:'dismiss'|'remove'|'ban' }
  adminUsersList: '/admin/users/list.php', // GET (supports ?q=&status=active|banned)
  adminUserBan: (id: string | number) => `/admin/users/ban.php?id=${id}`, // POST { reason? }
  adminUserUnban: (id: string | number) => `/admin/users/unban.php?id=${id}`, // POST {}

  // Audit
  adminAuditList: '/admin/audit/list.php', // GET { items:[{at,actor,action,target,meta}] }

  // Metrics
  metricsTrack: '/metrics/track.php', // POST { event, props, userId?, sessionId?, ua, ip, ref }
  metricsSummary: '/metrics/summary.php', // GET { range=7|30|90 }
  metricsTimeseries: '/metrics/timeseries.php', // GET { metric, range }
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
