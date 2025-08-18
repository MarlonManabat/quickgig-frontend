import { getPrefs } from './prefs';

const strings = {
  en: {
    dashboard: 'Dashboard',
    active_jobs: 'Active jobs',
    applicants: 'Applicants',
    unread_messages: 'Unread messages',
    views: 'Views',
    report_job: 'Report this job',
    reason_spam: 'Spam/Scam',
    reason_duplicate: 'Duplicate',
    reason_offensive: 'Offensive',
    reason_other: 'Other',
    notes_optional: 'Notes (optional)',
    submit: 'Submit',
    cancel: 'Cancel',
    report_thanks: "Thanks! We'll check it.",
    admin_reports: 'Reports',
    resolve: 'Resolve',
    pause_job: 'Pause job',
    view_job: 'View job',
    view_messages: 'View messages',
    withdraw_application: 'Withdraw application',
    confirm_withdraw: 'Are you sure?',
    withdraw_success: 'Application withdrawn',
    withdraw_error: 'Something went wrong',
    set_status: 'Set status',
    add_note: 'Add note',
    saved: 'Saved',
    status_new: 'New',
    status_reviewing: 'Reviewing',
    status_shortlisted: 'Shortlisted',
    status_rejected: 'Rejected',
    status_hired: 'Hired',
    status_withdrawn: 'Withdrawn',
    timeline_today: 'Today',
    timeline_week: 'This week',
    timeline_earlier: 'Earlier',
    interview: 'Interview',
    propose_interview: 'Propose interview',
    method: 'Method',
    location_link: 'Location/Link',
    select_time: 'Select a time',
    accept: 'Accept',
    decline: 'Decline',
    interview_confirmed: 'Interview confirmed',
    invite_declined: 'Invite declined',
    add_to_calendar: 'Add to calendar',
    navbar: {
      settings: 'Settings',
      home: 'Home',
      jobs: 'Browse Jobs',
      login: 'Log in',
      signup: 'Sign up',
    },
    footer: {
      about: 'About',
      privacy: 'Privacy',
    },
    notifications: {
      title: 'Notifications',
      viewAll: 'View all',
      tabs: {
        all: 'All',
        message: 'Messages',
        application: 'Applications',
        interview: 'Interviews',
        alert: 'Alerts',
        admin: 'Admin',
      },
      empty: {
        all: 'No notifications',
        message: 'No messages',
        application: 'No applications',
        interview: 'No interviews',
        alert: 'No alerts',
        admin: 'No admin notices',
      },
      markRead: 'Mark read',
      markAllRead: 'Mark all as read',
      toast: { marked: 'Marked as read', markedAll: 'Marked all as read' },
    },
    notify: {
      heading: 'Notifications',
      openAll: 'Open all notifications',
      markRead: 'Mark read',
      markAll: 'Mark all read',
      tabs: { all: 'All', message: 'Messages', interview: 'Interviews', alert: 'Alerts', admin: 'Admin' },
      empty: {
        all: 'No notifications',
        message: 'No messages',
        interview: 'No interviews',
        alert: 'No alerts',
        admin: 'No admin notices',
      },
    },
    settings: {
      title: 'Account Settings',
      language: {
        label: 'Language',
        en: 'English',
        tl: 'Taglish',
      },
      emails: {
        label: 'Email preferences',
        applications: 'Applications',
        interviews: 'Interviews',
        alerts: 'Alerts',
        admin: 'Admin digests',
      },
      emailPref: { all: 'All', ops: 'Ops-only', ops_only: 'Ops-only', none: 'None' },
      alerts: { label: 'Digest frequency', daily: 'Daily', weekly: 'Weekly' },
      notify: {
        label: 'Enable notifications',
        message: 'Messages',
        application: 'Applications',
        interview: 'Interviews',
        alert: 'Alerts',
        admin: 'Admin',
      },
      session: { label: 'Session', logoutAll: 'Log out of all devices' },
      danger: { label: 'Danger zone', delete: 'Delete my account' },
      confirm: { delete: 'Delete account?' },
      save: 'Save changes',
      unsaved: 'Unsaved changes',
      banner: { prompt: 'Complete your settings', dismiss: 'Dismiss' },
      toast: {
        saved: 'Settings saved',
        error: 'Failed to save',
        loggedOut: 'Logged out everywhere',
        deleted: 'Account deleted',
      },
    },
    interviews: {
      title: 'Interviews',
      invite: 'Invite to interview',
      method: {
        video: 'Video',
        phone: 'Phone',
        in_person: 'In person',
      },
      accept: 'Accept',
      decline: 'Decline',
      reschedule: 'Reschedule',
      cancel: 'Cancel',
      when: 'When',
      where: 'Where',
      notes: 'Notes',
      addToCalendar: 'Add to calendar',
      sent: 'Interview invite sent',
      updated: 'Interview updated',
      accepted: 'Interview accepted',
      declined: 'Interview declined',
      cancelled: 'Interview cancelled',
      status: {
        proposed: 'Proposed',
        accepted: 'Accepted',
        declined: 'Declined',
        cancelled: 'Cancelled',
        completed: 'Completed',
        rescheduled: 'Rescheduled',
      },
      section_title: 'Interview',
      propose_cta: 'Propose interview',
      accept_cta: 'Accept',
      decline_cta: 'Decline',
      reschedule_cta: 'Reschedule',
      method_video: 'Video',
      method_phone: 'Phone',
      method_in_person: 'In person',
      toast_sent: 'Interview request sent',
      toast_updated: 'Interview updated',
    },
    email: {
      apply_subject: 'New application received',
      interview_subject: 'Interview update',
      digest_subject: 'Daily QuickGig digest',
    },
  },
  tl: {
    dashboard: 'Dashboard',
    active_jobs: 'Aktibong trabaho',
    applicants: 'Mga aplikante',
    unread_messages: 'Di nabasang mensahe',
    views: 'Tingin',
    report_job: 'I-report ang trabahong ito',
    reason_spam: 'Spam/Scam',
    reason_duplicate: 'Duplicate',
    reason_offensive: 'Offensive',
    reason_other: 'Iba pa',
    notes_optional: 'Notes (opsyonal)',
    submit: 'Submit',
    cancel: 'Cancel',
    report_thanks: 'Salamat! Iche-check namin.',
    admin_reports: 'Reports',
    resolve: 'Resolve',
    pause_job: 'Pause job',
    view_job: 'View job',
    view_messages: 'View messages',
    withdraw_application: 'I-withdraw ang application',
    confirm_withdraw: 'Sigurado ka ba?',
    withdraw_success: 'Na-withdraw na.',
    withdraw_error: 'May mali.',
    set_status: 'I-set ang status',
    add_note: 'Magdagdag ng note',
    saved: 'Nasave',
    status_new: 'Bago',
    status_reviewing: 'Nirereview',
    status_shortlisted: 'Shortlist',
    status_rejected: 'Tanggihan',
    status_hired: 'Tinanggap',
    status_withdrawn: 'Winidraw',
    timeline_today: 'Today',
    timeline_week: 'This week',
    timeline_earlier: 'Noon',
    interview: 'Interview',
    propose_interview: 'Propose interview',
    method: 'Method',
    location_link: 'Location/Link',
    select_time: 'Pumili ng oras',
    accept: 'Kumpirmahin',
    decline: 'Decline',
    interview_confirmed: 'Kumpirmado ang interview',
    invite_declined: 'Tinanggihan ang imbitasyon',
    add_to_calendar: 'Add to calendar',
    navbar: {
      settings: 'Settings',
      home: 'Home',
      jobs: 'Hanap Trabaho',
      login: 'Mag-Login',
      signup: 'Sign Up',
    },
    footer: {
      about: 'Tungkol',
      privacy: 'Privacy',
    },
    notifications: {
      title: 'Notifications',
      viewAll: 'View all',
      tabs: {
        all: 'Lahat',
        message: 'Messages',
        application: 'Applications',
        interview: 'Interviews',
        alert: 'Alerts',
        admin: 'Admin',
      },
      empty: {
        all: 'Walang notifications',
        message: 'Walang messages',
        application: 'Walang applications',
        interview: 'Walang interviews',
        alert: 'Walang alerts',
        admin: 'Walang admin notices',
      },
      markRead: 'Mark read',
      markAllRead: 'Mark all as read',
      toast: { marked: 'Marked as read', markedAll: 'Marked all as read' },
    },
    notify: {
      heading: 'Notifications',
      openAll: 'Buksan lahat ng notifications',
      markRead: 'Mark read',
      markAll: 'Mark all read',
      tabs: { all: 'Lahat', message: 'Messages', interview: 'Interviews', alert: 'Alerts', admin: 'Admin' },
      empty: {
        all: 'Wala ka pang notifications',
        message: 'Walang messages',
        interview: 'Walang interviews',
        alert: 'Walang alerts',
        admin: 'Walang admin notices',
      },
    },
    settings: {
      title: 'Settings',
      language: {
        label: 'Language',
        en: 'English',
        tl: 'Taglish',
      },
      emails: {
        label: 'Email preferences',
        applications: 'Applications',
        interviews: 'Interviews',
        alerts: 'Alerts',
        admin: 'Admin digests',
      },
      emailPref: { all: 'Lahat', ops: 'Ops lang', ops_only: 'Ops lang', none: 'Wala' },
      alerts: { label: 'Digest frequency', daily: 'Araw-araw', weekly: 'Lingguhan' },
      notify: {
        label: 'I-enable ang notifications',
        message: 'Messages',
        application: 'Applications',
        interview: 'Interviews',
        alert: 'Alerts',
        admin: 'Admin',
      },
      session: { label: 'Session', logoutAll: 'Log out of all devices' },
      danger: { label: 'Danger zone', delete: 'Delete my account' },
      confirm: { delete: 'Delete account?' },
      save: 'Save changes',
      unsaved: 'May di naka-save',
      banner: { prompt: 'Kumpletuhin ang settings mo', dismiss: 'Itago' },
      toast: {
        saved: 'Nasave',
        error: 'Failed to save',
        loggedOut: 'Logged out everywhere',
        deleted: 'Account deleted',
      },
    },
    interviews: {
      title: 'Interviews',
      invite: 'Mag-imbita',
      method: {
        video: 'Video',
        phone: 'Phone',
        in_person: 'In person',
      },
      accept: 'Tanggapin',
      decline: 'Tanggihan',
      reschedule: 'Bagong oras',
      cancel: 'Kanselahin',
      when: 'Kailan',
      where: 'Saan',
      notes: 'Notes',
      addToCalendar: 'Add to calendar',
      sent: 'Na-send ang imbitasyon',
      updated: 'Na-update ang interview',
      accepted: 'Tinanggap ang interview',
      declined: 'Tinanggihan ang interview',
      cancelled: 'Kinansela ang interview',
      status: {
        proposed: 'Proposed',
        accepted: 'Accepted',
        declined: 'Declined',
        cancelled: 'Cancelled',
        completed: 'Completed',
        rescheduled: 'Rescheduled',
      },
      section_title: 'Interview',
      propose_cta: 'Mag-propose ng interview',
      accept_cta: 'Tanggapin',
      decline_cta: 'I-decline',
      reschedule_cta: 'I-reschedule',
      method_video: 'Video',
      method_phone: 'Tawag',
      method_in_person: 'In person',
      toast_sent: 'Na-send ang request',
      toast_updated: 'Na-update ang interview',
    },
    email: {
      apply_subject: 'May bagong application',
      interview_subject: 'Update sa interview',
      digest_subject: 'Daily QuickGig digest',
    },
  },
};

function copyVariant(): 'english' | 'taglish' {
  let variant = getPrefs().copy;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('lang');
    if (q === 'english' || q === 'taglish') {
      variant = q;
      try {
        localStorage.setItem('copyV', q);
      } catch {
        // ignore
      }
    } else {
      const legacy = localStorage.getItem('copyV');
      if (legacy === 'english' || legacy === 'taglish') variant = legacy;
    }
  }
  return variant;
}

function currentLang(): 'en' | 'tl' {
  return copyVariant() === 'taglish' ? 'tl' : 'en';
}

export function t(key: string): string {
  const lang = currentLang();
  const parts = key.split('.');
  let node: unknown = strings[lang] as unknown;
  for (const p of parts) {
    node = (node as Record<string, unknown>)[p];
    if (node === undefined) break;
  }
  if (typeof node === 'string') return node;
  node = strings.en as unknown;
  for (const p of parts) {
    node = (node as Record<string, unknown>)[p];
    if (node === undefined) break;
  }
  return typeof node === 'string' ? node : key;
}
