export type EmailPref = 'all' | 'ops_only' | 'none';
export type Settings = {
  lang: 'en' | 'tl';
  email: {
    applications: EmailPref;
    interviews: EmailPref;
    alerts: EmailPref;
    admin: EmailPref;
  };
  notify: {
    message: boolean;
    application: boolean;
    interview: boolean;
    alert: boolean;
    admin: boolean;
  };
};
