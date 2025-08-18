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
    report_thanks: 'Thanks! We\'ll check it.',
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
  },
};

export const emailCopy = {
  en: {
    apply: {
      subject: 'We received your application for {{title}}',
      body: [
        'Hi {{applicantName}}',
        'Thanks for applying to {{title}} at {{company}}.',
        'View your application: {{applyUrl}}',
      ],
      employer: {
        subject: 'New application for {{title}}',
        body: [
          'Hello, {{applicantName}} applied for {{title}}.',
          'Review applications: {{manageUrl}}',
        ],
      },
    },
    interview: {
      proposed: {
        subject: 'Interview proposed for {{title}}',
        body: [
          'Hello, interview proposed for {{title}}.',
          'Slots: {{slots}}',
          'Method: {{method}} {{location}}',
          'View details: {{detailUrl}}',
        ],
      },
      accepted: {
        subject: 'Interview accepted for {{title}}',
        body: [
          'Confirmed interview at {{when}} ({{tz}}).',
          'See details: {{detailUrl}}',
        ],
      },
      declined: {
        subject: 'Interview declined for {{title}}',
        body: [
          'Interview for {{title}} was declined.',
          'View details: {{detailUrl}}',
        ],
      },
    },
    admin: {
      digest: {
        subject: 'Daily digest',
        body: [
          'New jobs: {{jobs}}',
          'New applications: {{applications}}',
          'New reports: {{reports}}',
        ],
      },
    },
  },
  tl: {
    apply: {
      subject: 'Natanggap namin ang application mo',
      body: [
        'Hello, salamat sa pag-apply sa {{title}}.',
        'Tingnan dito: {{applyUrl}}',
      ],
      employer: {
        subject: 'May bagong application sa trabaho mo',
        body: [
          'Hello, may bagong applicant para sa {{title}}.',
          'I-manage dito: {{manageUrl}}',
        ],
      },
    },
    interview: {
      proposed: {
        subject: 'May proposal sa interview para sa {{title}}',
        body: [
          'Hello, may proposed na interview para sa {{title}}.',
          'Mga slot: {{slots}}',
          'Method: {{method}} {{location}}',
          'Tingnan ang detalye: {{detailUrl}}',
        ],
      },
      accepted: {
        subject: 'Kumpirmadong interview sa {{when}}',
        body: [
          'Kumpirmadong interview sa {{when}} ({{tz}}).',
          'Detalye: {{detailUrl}}',
        ],
      },
      declined: {
        subject: 'Tinanggihan ang interview para sa {{title}}',
        body: [
          'Tinanggihan ng applicant ang interview para sa {{title}}.',
          'Tingnan ang detalye: {{detailUrl}}',
        ],
      },
    },
    admin: {
      digest: {
        subject: 'Daily digest',
        body: [
          'Jobs: {{jobs}}',
          'Applications: {{applications}}',
          'Reports: {{reports}}',
        ],
      },
    },
  },
} as const;

export function t(key: keyof typeof strings['en']): string {
  const lang = (process.env.NEXT_PUBLIC_LANG || 'en') as 'en' | 'tl';
  return strings[lang][key] || strings.en[key] || key;
}
