export type NotificationRecord = {
  type:
    | 'message:new'
    | 'application:new'
    | 'application:status'
    | 'payment:approved'
    | 'payment:rejected';
  payload: any;
};

export function formatNotification(n: NotificationRecord): string {
  switch (n.type) {
    case 'message:new':
      return `${n.payload.counterparty} sent a new message`;
    case 'application:new':
      return `${n.payload.worker} applied to ${n.payload.job_title}`;
    case 'application:status':
      return `Your application to ${n.payload.job_title} was ${n.payload.status}`;
    case 'payment:approved':
      return `Top-up approved: +${n.payload.amount} credits`;
    case 'payment:rejected':
      return 'Top-up rejected';
    default:
      return 'Notification';
  }
}
