import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../utils/csrfUtils";
import {
  Plus,
  Search,
  MoreHorizontal,
  Paperclip,
  Trash2,
  Edit,
  FileText,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";

import { Attachment, JobApplication } from "@/types/application";

// ───── CUSTOM LOADER ─────────────────────────────
// This component creates a solid circle spinner using Tailwind CSS.
const SolidCircleLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div
    className={`border-4 border-solid border-zinc-300 dark:border-zinc-800 border-t-transparent dark:border-t-transparent rounded-full animate-spin ${className}`}
  />
);

// ───── UI COMPONENTS (DO NOT CHANGE STYLE) ─────────────────────────────

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const statusColors: Record<string, string> = {
  saved: "bg-slate-500 text-white",
  applied: "bg-blue-500 text-white",
  interview: "bg-amber-500 text-white",
  offer: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "icon";
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    icon: "h-9 w-9",
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
    {children}
  </label>
);

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-background rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto p-6">
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => onOpenChange(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 text-left mb-4">{children}</div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>
);

const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">{children}</div>
);

const Select = ({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </select>
  </div>
);

const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <option value={value}>{children}</option>
);

const Tabs = ({
  children,
  defaultValue,
  onValueChange,
}: {
  children: React.ReactNode;
  defaultValue: string;
  onValueChange: (value: string) => void;
}) => <div className="w-full">{children}</div>;

const TabsList = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
    {children}
  </div>
);

const TabsTrigger = ({
  children,
  value,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  value: string;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: () => setOpen(!open) });
        }
        if (React.isValidElement(child) && child.type === DropdownMenuContent) {
          return open ? child : null;
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div onClick={onClick}>{children}</div>
);

const DropdownMenuContent = ({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}) => {
  const alignClasses = { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" };
  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in mt-1 ${alignClasses[align]}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <button
    className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-left transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// ───── TRACKING PAGE LAYOUT (API Integration with Backend Querying & Pagination) ─────────────────────────

export default function TrackingPageLayout() {
  // Pagination and filtering state
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobApplication | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  // Use snake_case field names to match your backend and store date_applied as a formatted string
  const [formData, setFormData] = useState<Omit<JobApplication, "id" | "attachments">>({
    company: "",
    position: "",
    location: "",
    status: "saved",
    date_applied: new Date().toISOString().split("T")[0],
    notes: "",
    salary: "",
    contact_person: "",
    contact_email: "",
    url: "",
  });

  // Loading states
  const [jobsLoading, setJobsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // IMPORTANT: API_URL now points to "api/job-applications/".
  const API_URL = "http://127.0.0.1:8000/api/job-applications";

  // Fetch job applications from the backend API using query parameters for filtering & pagination
  const fetchJobs = async (page = 1) => {
    setJobsLoading(true);
    try {
      const params: any = { page };
      // Prioritize activeTab filter unless it's "all"
      if (activeTab && activeTab !== "all") {
        params.status = activeTab;
      } else if (statusFilter) {
        params.status = statusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      // Make the API call
      const response = await axios.get(API_URL, {
        params,
        withCredentials: true,
      });
      // Update state with the fetched data
      setJobs(response.data.results || []);
      setCount(response.data.count || 0);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
      setCurrentPage(page);
    } catch (error) {
      alert("Error fetching job applications");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [statusFilter, searchTerm, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date_applied: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addJobApplication = async () => {
    setActionLoading(true);
    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key as keyof typeof formData]);
      }
      files.forEach((file) => form.append("attachments", file));
      const csrfToken = getCookie("csrftoken");
      await axios.post(API_URL + "/", form, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
      // Refetch page 1 after creation
      fetchJobs(1);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      alert("Error adding job application");
    } finally {
      setActionLoading(false);
    }
  };

  const updateJobApplication = async () => {
    if (!currentJob) return;
    setActionLoading(true);
    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key as keyof typeof formData]);
      }
      files.forEach((file) => form.append("attachments", file));
      const csrfToken = getCookie("csrftoken");
      await axios.put(`${API_URL}/${currentJob.id}/`, form, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
      fetchJobs(currentPage);
      resetForm();
      setIsEditDialogOpen(false);
      setCurrentJob(null);
      alert("Job application updated.");
    } catch (error: any) {
      alert("Error updating job application");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteJobApplication = async (id: string) => {
    setActionLoading(true);
    try {
      const csrfToken = getCookie("csrftoken");
      await axios.delete(`${API_URL}/${id}/`, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
      fetchJobs(currentPage);
      alert("Job application deleted.");
    } catch (error: any) {
      alert("Error deleting job application");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAttachment = async (jobId: string, attachmentId: string) => {
    setActionLoading(true);
    try {
      const csrfToken = getCookie("csrftoken");
      await axios.delete(`${API_URL}/${jobId}/attachments/${attachmentId}/`, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
      fetchJobs(currentPage);
      alert("Attachment deleted.");
    } catch (error: any) {
      alert("Error deleting attachment");
    } finally {
      setActionLoading(false);
    }
  };

  const editJobApplication = (job: JobApplication) => {
    setCurrentJob(job);
    setFormData({
      company: job.company,
      position: job.position,
      location: job.location,
      status: job.status,
      date_applied: new Date(job.date_applied).toISOString().split("T")[0],
      notes: job.notes,
      salary: job.salary || "",
      contact_person: job.contact_person || "",
      contact_email: job.contact_email || "",
      url: job.url || "",
    });
    setFiles([]);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      location: "",
      status: "saved",
      date_applied: new Date().toISOString().split("T")[0],
      notes: "",
      salary: "",
      contact_person: "",
      contact_email: "",
      url: "",
    });
    setFiles([]);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formatDateForInput = (date: string) => date;

  const getStatusBadge = (status: string) => {
    const color = statusColors[status] || "bg-slate-500 text-white";
    const label = statusOptions.find((opt) => opt.value === status)?.label || "Unknown";
    return <Badge className={color}>{label}</Badge>;
  };

  const totalPages = Math.ceil(count / 12);

  return (
    <div className="ml-20 md:ml-20 lg:ml-32 p-4">
      <div className="container mx-auto py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold">Job Application Tracker</h1>
            <p className="text-muted-foreground mt-4">Track and manage your job applications in one place</p>
          </div>
          <Button className="text-black" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Application
          </Button>
        </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, position, or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectItem value="">All Statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger
              value="all"
              onClick={() => {
                setActiveTab("all");
                setStatusFilter(null);
              }}
              className={activeTab === "all" ? "bg-white dark:bg-black dark:text-white" : ""}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              onClick={() => setActiveTab("saved")}
              className={activeTab === "saved" ? "bg-white dark:bg-black dark:text-white" : ""}
            >
              Saved
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              onClick={() => setActiveTab("applied")}
              className={activeTab === "applied" ? "bg-white dark:bg-black dark:text-white" : ""}
            >
              Applied
            </TabsTrigger>
            <TabsTrigger
              value="interview"
              onClick={() => setActiveTab("interview")}
              className={activeTab === "interview" ? "bg-white dark:bg-black dark:text-white" : ""}
            >
              Interviews
            </TabsTrigger>
            <TabsTrigger
              value="offer"
              onClick={() => setActiveTab("offer")}
              className={activeTab === "offer" ? "bg-white dark:bg-black dark:text-white" : ""}
            >
              Offers
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              onClick={() => setActiveTab("rejected")}
              className={activeTab === "rejected" ? "bg-white dark:bg-black dark:text-white" : ""}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Cards */}
        <div className="mt-6">
          {jobsLoading ? (
            <div className="flex justify-center items-center h-64">
              <SolidCircleLoader className="w-8 h-8" />
            </div>
          ) : jobs.length === 0 ? (
            <Card className="w-full p-12 flex flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No job applications found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start by adding your first job application to track."}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Application
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.position}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                          {job.location && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editJobApplication(job)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteJobApplication(job.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Applied: {formatDate(job.date_applied)}</span>
                      {job.salary && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Salary: {job.salary}</span>
                        </>
                      )}
                    </div>
                    {job.notes && (
                      <div className="mb-3">
                        <p className="text-sm">{job.notes}</p>
                      </div>
                    )}
                    {job.attachments && job.attachments.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {(job.attachments || []).map((attachment) => (
                            <div key={attachment.id} className="flex items-center bg-secondary rounded-md px-3 py-1.5 text-sm">
                              <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                              <span className="mr-2">{attachment.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1 hover:bg-destructive/20"
                                onClick={() => deleteAttachment(job.id, attachment.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Delete attachment</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editJobApplication(job)}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                      </Button>
                      {job.url && (
                        <Button variant="outline" size="sm" onClick={() => window.open(job.url, "_blank")}>
                          View Job
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        {/* Pagination Controls */}
        {jobs.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <Button disabled={jobsLoading || !prevPageUrl} onClick={() => fetchJobs(currentPage - 1)} variant="outline">
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button disabled={jobsLoading || !nextPageUrl} onClick={() => fetchJobs(currentPage + 1)} variant="outline">
              Next
            </Button>
          </div>
        )}
        {/* Add Job Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Job Application</DialogTitle>
              <DialogDescription>
                Enter the details of the job you're applying for to keep track of your application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Form fields for job application */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" placeholder="Company name" value={formData.company} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" name="position" placeholder="Job title" value={formData.position} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="City, State or Remote" value={formData.location} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range (Optional)</Label>
                  <Input id="salary" name="salary" placeholder="e.g. $80,000 - $100,000" value={formData.salary} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_applied">Date Applied</Label>
                  <Input id="date_applied" name="date_applied" type="date" value={formatDateForInput(formData.date_applied)} onChange={handleDateChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person (Optional)</Label>
                  <Input id="contact_person" name="contact_person" placeholder="Recruiter or hiring manager" value={formData.contact_person} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email (Optional)</Label>
                  <Input id="contact_email" name="contact_email" type="email" placeholder="contact@company.com" value={formData.contact_email} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Job URL (Optional)</Label>
                <Input id="url" name="url" placeholder="https://company.com/jobs/position" value={formData.url} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Add any notes about this application" value={formData.notes} onChange={handleInputChange} className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="grid gap-2">
                  <Input id="attachments" type="file" multiple onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                  {files.length > 0 && (
                    <div className="border rounded-md p-3 mt-2">
                      <h4 className="text-sm font-medium mb-2">Files to upload:</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span>{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/20" onClick={() => removeFile(index)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={addJobApplication} disabled={actionLoading}>
                {actionLoading ? <SolidCircleLoader className="w-4 h-4 mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit Job Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Job Application</DialogTitle>
              <DialogDescription>Update the details of your job application.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Similar form fields for editing... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input id="edit-company" name="company" placeholder="Company name" value={formData.company} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Input id="edit-position" name="position" placeholder="Job title" value={formData.position} onChange={handleInputChange} required />
                </div>
              </div>
              {/* More fields for edit... */}
              {currentJob && currentJob.attachments && currentJob.attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Attachments</Label>
                  <div className="border rounded-md p-3">
                    <div className="space-y-2">
                      {currentJob.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 mr-2" />
                            <span>{attachment.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/20" onClick={() => deleteAttachment(currentJob.id, attachment.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove attachment</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* File upload for new attachments */}
              <div className="space-y-2">
                <Label>Add New Attachments</Label>
                <div className="grid gap-2">
                  <Input id="edit-attachments" type="file" multiple onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                  {files.length > 0 && (
                    <div className="border rounded-md p-3 mt-2">
                      <h4 className="text-sm font-medium mb-2">Files to upload:</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span>{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/20" onClick={() => removeFile(index)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={updateJobApplication} disabled={actionLoading}>
                {actionLoading ? <SolidCircleLoader className="w-4 h-4 mr-2" /> : "Update Application"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

