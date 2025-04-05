import React, { useState, useEffect, useCallback } from "react";
import {
  fetchJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  deleteAttachment,
} from "@/api/jobApplications";
import { JobApplication } from "@/types/application";
import Filters from "./Filters";
import TabsSection from "./TabsSection";
import JobCard from "./JobCard";
import JobDialog from "./JobDialog";
import { Button } from "../ui";

import { Plus } from "lucide-react";

export default function TrackingPageLayout() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(
    async (cursor: string | null = null, append = false) => {
      setLoading(true);
      try {
        const params: any = {};
        if (activeTab !== "all") params.status = activeTab;
        if (searchTerm) params.search = searchTerm;
        if (cursor) params.cursor = cursor;

        const data = await fetchJobApplications(params);
        const newJobs = data.results || [];
        setJobs((prev) => (append ? [...prev, ...newJobs] : newJobs));
        setNextCursor(data.next ? new URL(data.next).searchParams.get("cursor") : null);
      } catch (err) {
        alert("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    },
    [activeTab, searchTerm]
  );

  useEffect(() => {
    fetchJobs(null);
  }, [fetchJobs]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || !nextCursor) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 200
      ) {
        fetchJobs(nextCursor, true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, nextCursor, fetchJobs]);

  const handleAdd = async (formData: FormData) => {
    await createJobApplication(formData);
    setIsDialogOpen(false);
    fetchJobs(null);
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    await updateJobApplication(id, formData);
    setEditJob(null);
    setIsDialogOpen(false);
    fetchJobs(null);
  };

  const handleDelete = async (id: string) => {
    await deleteJobApplication(id);
    fetchJobs(null);
  };

  const handleDeleteAttachment = async (jobId: string, attachmentId: string) => {
    await deleteAttachment(jobId, attachmentId);
    fetchJobs(null);
  };

  return (
    <div className="ml-20 md:ml-20 lg:ml-32 p-4">
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Job Application Tracker</h1>
            <p className="text-muted-foreground mt-4">Track and manage your job applications</p>
          </div>
          <Button className="text-black" onClick={() => { setEditJob(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Application
          </Button>
        </div>

        <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} clearJobs={() => setJobs([])} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={() => { setEditJob(job); setIsDialogOpen(true); }}
              onDelete={() => handleDelete(job.id)}
              onDeleteAttachment={handleDeleteAttachment}
            />
          ))}
        </div>

        <JobDialog
          open={isDialogOpen}
          onClose={() => { setEditJob(null); setIsDialogOpen(false); }}
          onSubmit={editJob ? handleUpdate : handleAdd}
          editJob={editJob}
        />
      </div>
    </div>
  );
}

