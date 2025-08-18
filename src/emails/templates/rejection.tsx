import { t } from '@/lib/i18n';

export function RejectionEmail({ applicantName, jobTitle }: { applicantName: string; jobTitle: string }) {
  return (
    <div>
      <p>
        {t('email.bulkRejectionGreeting')} {applicantName},
      </p>
      <p>
        {t('email.bulkRejectionBody')} {jobTitle}.
      </p>
    </div>
  );
}

export default RejectionEmail;
