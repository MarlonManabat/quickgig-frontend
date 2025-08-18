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
  },
};

export function t(key: keyof typeof strings['en']): string {
  const lang = (process.env.NEXT_PUBLIC_LANG || 'en') as 'en' | 'tl';
  return strings[lang][key] || strings.en[key] || key;
}
