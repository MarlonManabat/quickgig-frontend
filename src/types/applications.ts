export interface ApplicationRequest {
  gig_id: string;
}

export interface Application {
  id: string;
  status: 'submitted';
}

export type ApplicationResponse = Application;
