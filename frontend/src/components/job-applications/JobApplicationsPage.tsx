import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { JobApplication } from "@/types/JobApplicationTypes";
import { getCookie } from "@/utils/csrfUtils";
import {
  fetchJobApplications,
  createJobApplication,
  updateJobApplicationAPI,
  deleteJobApplicationAPI,
  deleteAttachmentAPI,
} from "@/api/jobApplications";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Plus, Search } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/context/SideBarContext";
import { SolidCircleLoader } from "../loader/SolidCircleLoader";

import JobCard from "./JobCard";
import AddJobDialog from "./AddJobDialog";
import EditJobDialog from "./EditJobDialog";

// Import shadcn Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Custom hook for debouncing a value
//interface debouncedValue<T> {
//  value: T;
//  setValue: (value: T) => void;
//}
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Helper function: returns a pagination range as an array of numbers and ellipsis strings ("...")
function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  const DOTS = "...";
  const totalPageNumbersToShow = 7; // Maximum buttons to show (including first and last)

  if (totalPages <= totalPageNumbersToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - 1, 1);
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  const firstPage = 1;
  const lastPage = totalPages;

  if (!showLeftDots && showRightDots) {
    const end = 4;
    return [...Array.from({ length: end }, (_, i) => i + 1), DOTS, lastPage];
  } else if (showLeftDots && !showRightDots) {
    const start = totalPages - 3;
    return [firstPage, DOTS, ...Array.from({ length: 4 }, (_, i) => start + i)];
  } else if (showLeftDots && showRightDots) {
    return [firstPage, DOTS, leftSiblingIndex, currentPage, rightSiblingIndex, DOTS, lastPage];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

const JobApplicationsPage: React.FC = () => {
  // States for job list and filters
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog & job state
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
  const { isMobile, collapsed } = useSidebar();
  const leftPaddingClass = collapsed ? "lg:pl-32" : "lg:pl-[17rem]";

  // Reset pagination state
  const resetPagination = () => setCurrentPage(1);

  // Fetch job applications based on filters and page number
  const fetchJobs = useCallback(
    async (page: number = 1) => {
      setJobsLoading(true);
      try {
        const params: Record<string, any> = { page, sortOrder };
        if (activeTab !== "all") params.status = activeTab;
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;

        const response = await fetchJobApplications(params);
        const data = response.data;
        setJobs(data.results || []);
        const count = data.count || (data.results && data.results.length) || 0;
        setTotalPages(Math.ceil(count / 18)); // was 15
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching job applications:", error);
        alert("Error fetching job applications");
      } finally {
        setJobsLoading(false);
      }
    },
    [activeTab, debouncedSearchTerm, sortOrder]
  );



  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage])

  // When filters change, reset pagination and fetch new jobs.
  useEffect(() => {
    resetPagination();
    // Do not clear jobs to avoid flickering; they remain visible until new data arrives
    fetchJobs(1);
  }, [debouncedSearchTerm, activeTab, sortOrder, fetchJobs]);

  // Handlers for form changes and file uploads
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) =>
    setFormData((prev) => ({ ...prev, status: value }));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, date_applied: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

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

  // CRUD Actions
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
      resetPagination();
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
      await updateJobApplicationAPI(currentJob.id, form, csrfToken);
      resetPagination();
      fetchJobs(1);
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
    if (confirm("Are you sure you want to delete this job application?")) {
      setActionLoading(true);
      try {
        const csrfToken = getCookie("csrftoken");
        await deleteJobApplicationAPI(id, csrfToken);
        const newPage = currentPage > 1 ? currentPage - 1 : 1;
        resetPagination();
        fetchJobs(newPage);
      } catch (error: any) {
        alert("Error deleting job application");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const deleteAttachment = async (jobId: string, attachmentId: string) => {
    if (confirm("Are you sure you want to delete this attachment?")) {
      setActionLoading(true);
      try {
        const csrfToken = getCookie("csrftoken");
        await deleteAttachmentAPI(jobId, attachmentId, csrfToken);
        fetchJobs(currentPage);
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

  // Pagination navigation handler
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchJobs(page);
  };

  // Memoize the pagination range so it isn’t recalculated on every render
  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <div className="min-h-screen">
      <div
        className={`container ${!isMobile && leftPaddingClass}  ${isMobile ? "px-4" : ""} "pr-4 pt-8 mx-auto max-w-[96rem] w-full transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-3xl mt-4 font-bold bg-clip-text">
              Job Application Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your job applications in one place
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} type="button">
            <Plus className="mr-2 h-5 w-5" />
            Add Application
          </Button>
        </div>

        {/* Search and Controls */}
        <div className="rounded-xl shadow-none p-2 mb-2">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <Label
                htmlFor="search"
                className="text-sm font-medium mb-1.5 block"
              >
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
              <Label
                htmlFor="sort-order"
                className="text-sm font-medium mb-1.5 block"
              >
                Sort by Date
              </Label>
              <Select
                value={sortOrder}
                onValueChange={(value) => {
                  setSortOrder(value as "desc" | "asc");
                  resetPagination();
                }}
              >
                <SelectTrigger
                  id="sort-order"
                  className="w-full bg-background"
                >
                  <SelectValue placeholder="Sort by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 md:self-end"
              onClick={() => {
                setSearchTerm("");
                setSortOrder("desc");
                resetPagination();
                fetchJobs(1);
              }}
            >
              <Filter className="h-4 w-4 mr-2" /> Reset Filters
            </Button>
          </div>
        </div>

        {/* Tabs for Status Filter */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            resetPagination();
          }}
          className="mb-4"
        >
          <TabsList className="dark:bg-zinc-850">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="interview">Interviews</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Cards Section */}
        <div className="relative">
          <div
            className={`job-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${jobsLoading ? "opacity-50" : "opacity-100"
              }`}
          >
            {jobs.length === 0 && !jobsLoading ? (
              <Card className="w-full p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <CardTitle className="text-emerald-500">No Jobs</CardTitle>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No job applications found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm || activeTab !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Start by adding your first job application to track your job search journey."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Application
                </Button>
              </Card>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={() => editJobApplication(job)}
                  onDelete={() => deleteJobApplication(job.id)}
                  onDeleteAttachment={deleteAttachment}
                />
              ))
            )}
          </div>
          {jobsLoading && (
            <div className="absolute mt-12 inset-0 flex justify-center items-center pointer-events-none">
              <SolidCircleLoader className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Optimized Pagination UI */}
        {!jobsLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination className="mb-7">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) goToPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {paginationRange.map((page, index) =>
                  page === "..." ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(Number(page));
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) goToPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

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
};

export default JobApplicationsPage;

