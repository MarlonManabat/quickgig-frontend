export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Job Seeker' | 'Employer' | 'Admin';
  isEmployer?: boolean;
  ticketBalance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  message: string;
  user?: User;
  data?: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'Job Seeker' | 'Employer';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'Job Seeker' | 'Employer';
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary?: string;
  contactEmail?: string;
  contactPhone?: string;
  deadline: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  job: Job;
  freelancer: User;
  employer: User;
  proposalText: string;
  expectedDeliveryTime: number;
  price: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatRoom: string;
  sender: User;
  message: string;
  createdAt: string;
}

export interface ChatRoom {
  _id: string;
  job: Job;
  participants: User[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type: 'new_bid' | 'bid_accepted' | 'bid_rejected' | 'new_message' | 'system' | 'ticket_purchase' | 'ticket_usage' | 'ticket_refund' | 'ticket_warning' | 'ticket_credit';
  title?: string;
  message: string;
  job?: Job;
  bid?: Bid;
  chatRoom?: string;
  isRead: boolean;
  read?: boolean;
  data?: unknown;
  createdAt: string;
}

export interface BidFormData {
  proposalText: string;
  expectedDeliveryTime: number;
  price: number;
}

export interface WalletInfo {
  ticketBalance: number;
}

export interface TicketTransaction {
  _id: string;
  userId: string;
  type: 'purchase' | 'consume' | 'refund' | 'initial_credit';
  ticketsChanged: number;
  balanceAfter: number;
  relatedJobId?: string;
  description: string;
  paymentGateway?: string;
  transactionId?: string;
  createdAt: string;
}

export interface PaymentInitiation {
  transactionId: string;
  paymentId: string;
  ticketCount: number;
  totalAmount: number;
  currency: string;
  paymentGateway: string;
  redirectUrl?: string;
  checkoutUrl?: string;
  approvalUrl?: string;
  qrCode?: string;
  expiresAt: string;
}

export interface PaymentConfirmation {
  paymentId: string;
  status: 'success' | 'failed' | 'cancelled';
}

export interface TicketPurchaseData {
  ticketCount: 1 | 5 | 10 | 20;
  paymentGateway: 'GCash' | 'Maya' | 'PayPal';
}

// Admin-specific types
export interface AdminUser extends User {
  stats?: {
    totalPurchased: number;
    totalSpent: number;
    totalConsumed: number;
  };
}

export interface AdminTicketTransaction extends TicketTransaction {
  userId: string;
  user?: AdminUser;
  relatedJob?: Job;
  adminId?: User;
}

export interface SalesAnalytics {
  period: 'daily' | 'weekly' | 'monthly';
  salesData: Array<{
    _id: unknown;
    totalTickets: number;
    totalRevenue: number;
    transactionCount: number;
    avgTicketsPerTransaction: number;
  }>;
  gatewayBreakdown: Array<{
    _id: string;
    totalTickets: number;
    totalRevenue: number;
    transactionCount: number;
  }>;
  overallStats: {
    totalTickets: number;
    totalRevenue: number;
    totalTransactions: number;
  };
}

export interface SystemStats {
  userStats: {
    breakdown: Array<{
      _id: string;
      count: number;
      totalTickets: number;
    }>;
    total: number;
  };
  jobStats: {
    breakdown: Array<{
      _id: string;
      count: number;
    }>;
    total: number;
  };
  bidStats: {
    breakdown: Array<{
      _id: string;
      count: number;
    }>;
    total: number;
  };
  ticketStats: Array<{
    _id: string;
    count: number;
    totalTickets: number;
  }>;
  revenueStats: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalTransactions: number;
  };
  recentTransactions: AdminTicketTransaction[];
}

export interface TicketAdjustment {
  ticketsChanged: number;
  reason: string;
}

