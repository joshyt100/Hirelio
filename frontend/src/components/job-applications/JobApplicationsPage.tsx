import React, { useState, useEffect, useCallback } from "react";
import type { JobApplication } from "@/types/application";
import { getCookie } from "@/utils/csrfUtils";
import {
  fetchJobApplications,
  createJobApplication,
  updateJobApplicationAPI,
  deleteJobApplicationAPI,
  deleteAttachmentAPI,
} from "@/api/jobApplications";

// Import shadcn/ui components and icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Plus, Search } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

// Import child components
import JobCard from "./JobCard";
import AddJobDialog from "./AddJobDialog";
import EditJobDialog from "./EditJobDialog";

// ───── CUSTOM LOADER ─────────────────────────────
const SolidCircleLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div
    className={`border-4 border-solid border-zinc-200 dark:border-zinc-800 border-t-primary dark:border-t-primary rounded-full animate-spin ${className}`}
  />
);

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function JobApplicationsPage() {
  // States for jobs and filters
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Dialog and edit states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobApplication | null>(null);
  const [files, setFiles] = useState<File[]>([]);
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

  // Fetch jobs function supporting pagination
  const fetchJobs = useCallback(
    async (cursor: string | null = null, append = false) => {
      setJobsLoading(true);
      try {
        const params: Record<string, any> = {};
        if (activeTab && activeTab !== "all") {
          params.status = activeTab;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (cursor) {
          params.cursor = cursor;
        }
        const response = await fetchJobApplications(params);
        const newJobs = response.data.results || [];
        if (append) {
          setJobs((prevJobs) => [...prevJobs, ...newJobs]);
        } else {
          setJobs(newJobs);
        }
        setNextCursor(response.data.next ? new URL(response.data.next).searchParams.get("cursor") : null);
      } catch (error) {
        alert("Error fetching job applications");
      } finally {
        setJobsLoading(false);
      }
    },
    [activeTab, searchTerm],
  );

  useEffect(() => {
    fetchJobs(null);
  }, [searchTerm, statusFilter, activeTab, fetchJobs]);

  // Infinite scroll to fetch more jobs
  useEffect(() => {
    const handleScroll = () => {
      if (jobsLoading || !nextCursor) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 200) {
        fetchJobs(nextCursor, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [jobsLoading, nextCursor, fetchJobs]);

  // Handlers for form and file uploads
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

  // Add job application handler
  const addJobApplication = async () => {
    setActionLoading(true);
    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key as keyof typeof formData]);
      }
      files.forEach((file) => form.append("attachments", file));
      const csrfToken = getCookie("csrftoken");
      await createJobApplication(form, csrfToken);
      fetchJobs(null);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      alert("Error adding job application");
    } finally {
      setActionLoading(false);
    }
  };

  // Update job application handler
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
      await updateJobApplicationAPI(currentJob.id, form, csrfToken);
      fetchJobs(null);
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

  // Delete job application handler
  const deleteJobApplication = async (id: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      setActionLoading(true);
      try {
        const csrfToken = getCookie("csrftoken");
        await deleteJobApplicationAPI(id, csrfToken);
        fetchJobs(null);
      } catch (error: any) {
        alert("Error deleting job application");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Delete attachment handler
  const deleteAttachment = async (jobId: string, attachmentId: string) => {
    if (confirm("Are you sure you want to delete this attachment?")) {
      setActionLoading(true);
      try {
        const csrfToken = getCookie("csrftoken");
        await deleteAttachmentAPI(jobId, attachmentId, csrfToken);
        fetchJobs(null);
      } catch (error: any) {
        alert("Error deleting attachment");
      } finally {
        setActionLoading(false);
      }
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

  return (
    <div className="min-h-screen">
      <div className="container pl-24 pr-4 pt-8 mx-auto max-w-[96rem] w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl font-bold bg-clip-text">Job Application Tracker</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Track and manage your job applications in one place
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-md transition-all" size="lg">
            <Plus className="mr-2 h-5 w-5" /> Add Application
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl shadow-none p-2 mb-2">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-1.5 block">
                Search Applications
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by company, position, or location..."
                  className="pl-9 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="status-filter" className="text-sm font-medium mb-1.5 block">
                Filter by Status
              </Label>
              <Select
                value={statusFilter ?? "all"}
                onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
              >
                <SelectTrigger id="status-filter" className="w-full bg-background">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 md:self-end"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter(null);
              }}
            >
              <Filter className="h-4 w-4 mr-2" /> Reset Filters
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setStatusFilter(null);
            setNextCursor(null);
            setJobs([]);
          }}
          className="mb-8"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="interview">Interviews</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Cards List */}
        <div className="mt-6">
          {jobsLoading && jobs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <SolidCircleLoader className="w-10 h-10" />
            </div>
          ) : jobs.length === 0 ? (
            <Card className="w-full p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <CardTitle className="text-emerald-500">No Jobs</CardTitle>
              </div>
              <h3 className="text-xl font-semibold mb-2">No job applications found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start by adding your first job application to track your job search journey."}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Application
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={() => editJobApplication(job)}
                  onDelete={() => deleteJobApplication(job.id)}
                  onDeleteAttachment={deleteAttachment}
                />
              ))}
            </div>
          )}
          {jobsLoading && jobs.length > 0 && (
            <div className="flex justify-center items-center py-8">
              <SolidCircleLoader className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Add Job Dialog */}
        <AddJobDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          formData={formData}
          onInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          handleDateChange={handleDateChange}
          files={files}
          handleFileUpload={handleFileUpload}
          removeFile={removeFile}
          onSubmit={addJobApplication}
          actionLoading={actionLoading}
        />

        {/* Edit Job Dialog */}
        <EditJobDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formData={formData}
          onInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          handleDateChange={handleDateChange}
          files={files}
          handleFileUpload={handleFileUpload}
          removeFile={removeFile}
          onSubmit={updateJobApplication}
          actionLoading={actionLoading}
          currentJob={currentJob}
          onDeleteAttachment={deleteAttachment}
        />
      </div>
    </div>
  );
}

