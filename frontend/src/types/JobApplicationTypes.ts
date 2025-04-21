
export interface Attachment {
  id: string
  name: string
  type: "resume" | "coverLetter" | "other"
  url: string
  dateAdded: Date
}

export interface JobApplication {
  id: string
  company: string
  position: string
  location: string
  status: "saved" | "applied" | "interview" | "offer" | "rejected"
  dateApplied: Date
  notes: string
  attachments: Attachment[]
  salary?: string
  contactPerson?: string
  contactEmail?: string
  url?: string
}


export interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    company: string;
    position: string;
    location: string;
    status: string;
    date_applied: string;
    notes: string;
    salary: string;
    contact_person: string;
    contact_email: string;
    url: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  onSubmit: () => void;
  actionLoading: boolean;
}

export interface JobCardProps {
  job: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteAttachment: (jobId: string, attachmentId: string) => void;
}

export interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    company: string;
    position: string;
    location: string;
    status: string;
    date_applied: string;
    notes: string;
    salary: string;
    contact_person: string;
    contact_email: string;
    url: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  onSubmit: () => void;
  actionLoading: boolean;
  currentJob: any;
  onDeleteAttachment: (jobId: string, attachmentId: string) => void;
}




type StatusDatum = { name: string; value: number };
type TimelineDatum = { month: string; applications: number; interviews: number; offers: number };
type RateDatum = { name: string; value: number };
type KeyValue = { name: string; value: number };
type RecentApp = { id: number; company: string; position: string; location: string; status: string; date_applied: string };

export type DashboardResponse = {
  total_applications: number;
  active_applications: number;
  interview_count: number;
  offer_count: number;
  rejection_count: number;
  response_rate: number;
  success_rate: number;
  status_data: StatusDatum[];
  timeline_data: TimelineDatum[];
  response_rate_data: RateDatum[];
  location_data: KeyValue[];
  company_data: KeyValue[];
  time_to_response_data: KeyValue[];
  recent_applications: RecentApp[];
};
