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
import { useSidebar } from "@/context/SideBarContext";
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
import JobCard from "./JobCard";
import AddJobDialog from "./AddJobDialog";
import EditJobDialog from "./EditJobDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";

// Helper: pagination range
function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  const DOTS = "...";
  const maxButtons = 7;
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - 1, 1);
  const right = Math.min(currentPage + 1, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;
  const first = 1;
  const last = totalPages;

  if (!showLeftDots && showRightDots) {
    return [...Array.from({ length: 4 }, (_, i) => i + 1), DOTS, last];
  }
  if (showLeftDots && !showRightDots) {
    return [first, DOTS, ...Array.from({ length: 4 }, (_, i) => totalPages - 3 + i)];
  }
  return [first, DOTS, left, currentPage, right, DOTS, last];
}

const JobApplicationsPage: React.FC = () => {
  // Sidebar padding logic (same as ContactLayout)
  const { isMobile, collapsed } = useSidebar();
  const leftPaddingClass = isMobile
    ? "px-4"
    : collapsed
      ? "lg:pl-24 pr-2"
      : "lg:pl-[17rem]";

  // State & hooks
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialogs & forms
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
  const [hasFetched, setHasFetched] = useState(false);

  const resetPage = () => setCurrentPage(1);

  const fetchJobs = useCallback(async (page: number = 1) => {
    try {
      const params: Record<string, any> = { page, sortOrder };
      if (activeTab !== "all") params.status = activeTab;
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;

      const res = await fetchJobApplications(params);
      const data = res.data;
      setJobs(data.results || []);
      const count = data.count ?? data.results.length;
      setTotalPages(Math.ceil(count / 18));
      setCurrentPage(page);
    } catch (e) {
      console.error(e);
      alert("Error fetching job applications");
    } finally {
      setHasFetched(true);
    }
  }, [activeTab, debouncedSearchTerm, sortOrder]);

  useEffect(() => {
    resetPage();
    fetchJobs(1);
  }, [debouncedSearchTerm, activeTab, sortOrder, fetchJobs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleStatus = (val: string) => setFormData(prev => ({ ...prev, status: val }));
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, date_applied: e.target.value }));
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));
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

  // CRUD operations
  const addJob = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => form.append(k, v as string));
    files.forEach(f => form.append("attachments", f));
    try {
      await createJobApplication(form, getCookie("csrftoken"));
      resetPage();
      fetchJobs(1);
      resetForm();
      setIsAddOpen(false);
    } catch {
      alert("Error adding job application");
    }
  };

  const updateJob = async () => {
    if (!currentJob) return;
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => form.append(k, v as string));
    files.forEach(f => form.append("attachments", f));
    try {
      await updateJobApplicationAPI(currentJob.id, form, getCookie("csrftoken"));
      resetPage();
      fetchJobs(1);
      resetForm();
      setIsEditOpen(false);
      setCurrentJob(null);
      alert("Job application updated.");
    } catch {
      alert("Error updating job application");
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteJobApplicationAPI(id, getCookie("csrftoken"));
      const prev = currentPage > 1 ? currentPage - 1 : 1;
      resetPage();
      fetchJobs(prev);
    } catch {
      alert("Error deleting job application");
    }
  };

  const deleteAttachment = async (jobId: string, attId: string) => {
    if (!confirm("Delete this attachment?")) return;
    try {
      await deleteAttachmentAPI(jobId, attId, getCookie("csrftoken"));
      fetchJobs(currentPage);
    } catch {
      alert("Error deleting attachment");
    }
  };

  const startEdit = (job: JobApplication) => {
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
    setIsEditOpen(true);
  };

  // Pagination helpers
  const goTo = (p: number) => { if (p >= 1 && p <= totalPages) fetchJobs(p); };
  const range = useMemo(() => getPaginationRange(currentPage, totalPages), [currentPage, totalPages]);

  return (
    <div className={`${leftPaddingClass} transition-all duration-300 min-h-screen`}>
      <div className="container mx-auto pt-8 pr-1 max-w-[105rem] w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-0">
          <h1 className="text-3xl mt-3 lg:mt-2 font-bold">Job Application Tracker</h1>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />Add Application
          </Button>
        </div>

        {/* Filters */}
        <div className="rounded-xl p-2 mb-2">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-1.5 block">
                Search Applications
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by company or position"
                  className="pl-9"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="sort-order" className="text-sm font-medium mb-1.5 block">
                Sort by Date
              </Label>
              <Select
                value={sortOrder}
                onValueChange={val => { setSortOrder(val as any); resetPage(); }}
              >
                <SelectTrigger id="sort-order" className="w-full">
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
              onClick={() => { setSearchTerm(""); setSortOrder("desc"); resetPage(); fetchJobs(1); }}
            >
              <Filter className="h-4 w-4 mr-2" /> Reset Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={val => { setActiveTab(val); resetPage(); }}
          className="mb-4"
        >
          <TabsList className="dark:bg-zinc-900">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="interview">Interviews</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Cards */}
        <div className="job-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length === 0 && hasFetched ? (
            <Card className="w-full p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <CardTitle className="text-emerald-500">No Jobs</CardTitle>
              </div>
              <h3 className="text-xl font-semibold mb-2">No job applications found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchTerm || activeTab !== "all"
                  ? "Try adjusting your search or filters."
                  : "Start by adding your first job application."}
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />Add Your First Application
              </Button>
            </Card>
          ) : (
            jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={() => startEdit(job)}
                onDelete={() => deleteJob(job.id)}
                onDeleteAttachment={deleteAttachment}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => { e.preventDefault(); goTo(currentPage - 1); }}
                  />
                </PaginationItem>
                {range.map((p, i) =>
                  p === "..." ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        onClick={e => { e.preventDefault(); goTo(Number(p)); }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => { e.preventDefault(); goTo(currentPage + 1); }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Dialogs */}
        <AddJobDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          formData={formData}
          onInputChange={handleChange}
          handleStatusChange={handleStatus}
          handleDateChange={handleDate}
          files={files}
          handleFileUpload={handleFiles}
          removeFile={removeFile}
          onSubmit={addJob}
        />
        <EditJobDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          formData={formData}
          onInputChange={handleChange}
          handleStatusChange={handleStatus}
          handleDateChange={handleDate}
          files={files}
          handleFileUpload={handleFiles}
          removeFile={removeFile}
          onSubmit={updateJob}
          currentJob={currentJob}
          onDeleteAttachment={deleteAttachment}
        />
      </div>
    </div>
  );
};

export default JobApplicationsPage;


