
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { getCookie } from "../utils/csrfUtils"
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
  LinkIcon,
  Mail,
  User,
  Filter,
  ExternalLink,
} from "lucide-react"

import type { JobApplication } from "@/types/application"

// Import shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// ───── CUSTOM LOADER ─────────────────────────────
const SolidCircleLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div
    className={`border-4 border-solid border-zinc-200 dark:border-zinc-800 border-t-primary dark:border-t-primary rounded-full animate-spin ${className}`}
  />
)

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
]

const statusColors: Record<string, string> = {
  saved: "bg-slate-500 hover:bg-slate-600",
  applied: "bg-sky-500 hover:bg-sky-600",
  interview: "bg-amber-500 hover:bg-amber-600",
  offer: "bg-emerald-500 hover:bg-emerald-600",
  rejected: "bg-rose-500 hover:bg-rose-600",
}

const statusIcons: Record<string, React.ReactNode> = {
  saved: <Paperclip className="h-3.5 w-3.5" />,
  applied: <FileText className="h-3.5 w-3.5" />,
  interview: <Calendar className="h-3.5 w-3.5" />,
  offer: <FileText className="h-3.5 w-3.5" />,
  rejected: <FileText className="h-3.5 w-3.5" />,
}

export default function TrackingPageLayout() {
  // Pagination and filtering state using cursors
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentJob, setCurrentJob] = useState<JobApplication | null>(null)
  const [files, setFiles] = useState<File[]>([])
  // Use snake_case field names to match your backend
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
  })

  // Loading state
  const [jobsLoading, setJobsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // IMPORTANT: API_URL now points to "api/job-applications/".
  const API_URL = "http://127.0.0.1:8000/api/job-applications"

  // Fetch jobs function supporting pagination
  const fetchJobs = useCallback(
    async (cursor: string | null = null, append = false) => {
      setJobsLoading(true)
      try {
        const params: any = {}
        if (activeTab && activeTab !== "all") {
          params.status = activeTab
        }
        if (searchTerm) {
          params.search = searchTerm
        }
        if (cursor) {
          params.cursor = cursor
        }
        const response = await axios.get(API_URL, { params, withCredentials: true })
        const newJobs = response.data.results || []
        if (append) {
          setJobs((prevJobs) => [...prevJobs, ...newJobs])
        } else {
          setJobs(newJobs)
        }
        setNextCursor(response.data.next ? new URL(response.data.next).searchParams.get("cursor") : null)
      } catch (error) {
        alert("Error fetching job applications")
      } finally {
        setJobsLoading(false)
      }
    },
    [activeTab, searchTerm],
  )

  useEffect(() => {
    fetchJobs(null)
  }, [searchTerm, statusFilter, activeTab, fetchJobs])

  // Infinite scroll to fetch more jobs
  useEffect(() => {
    const handleScroll = () => {
      if (jobsLoading || !nextCursor) return
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 200) {
        fetchJobs(nextCursor, true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [jobsLoading, nextCursor, fetchJobs])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date_applied: e.target.value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addJobApplication = async () => {
    setActionLoading(true)
    try {
      const form = new FormData()
      for (const key in formData) {
        form.append(key, formData[key as keyof typeof formData])
      }
      files.forEach((file) => form.append("attachments", file))
      const csrfToken = getCookie("csrftoken")
      await axios.post(API_URL + "/", form, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      })
      fetchJobs(null)
      resetForm()
      setIsAddDialogOpen(false)
    } catch (error: any) {
      alert("Error adding job application")
    } finally {
      setActionLoading(false)
    }
  }

  const updateJobApplication = async () => {
    if (!currentJob) return
    setActionLoading(true)
    try {
      const form = new FormData()
      for (const key in formData) {
        form.append(key, formData[key as keyof typeof formData])
      }
      files.forEach((file) => form.append("attachments", file))
      const csrfToken = getCookie("csrftoken")
      await axios.put(`${API_URL}/${currentJob.id}/`, form, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      })
      fetchJobs(null)
      resetForm()
      setIsEditDialogOpen(false)
      setCurrentJob(null)
      alert("Job application updated.")
    } catch (error: any) {
      alert("Error updating job application")
    } finally {
      setActionLoading(false)
    }
  }

  const deleteJobApplication = async (id: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      setActionLoading(true)
      try {
        const csrfToken = getCookie("csrftoken")
        await axios.delete(`${API_URL}/${id}/`, {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        })
        fetchJobs(null)
      } catch (error: any) {
        alert("Error deleting job application")
      } finally {
        setActionLoading(false)
      }
    }
  }

  const deleteAttachment = async (jobId: string, attachmentId: string) => {
    if (confirm("Are you sure you want to delete this attachment?")) {
      setActionLoading(true)
      try {
        const csrfToken = getCookie("csrftoken")
        await axios.delete(`${API_URL}/${jobId}/attachments/${attachmentId}/`, {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        })
        fetchJobs(null)
      } catch (error: any) {
        alert("Error deleting attachment")
      } finally {
        setActionLoading(false)
      }
    }
  }

  const editJobApplication = (job: JobApplication) => {
    setCurrentJob(job)
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
    })
    setFiles([])
    setIsEditDialogOpen(true)
  }

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
    })
    setFiles([])
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  const formatDateForInput = (date: string) => date

  const getStatusBadge = (status: string) => {
    const color = statusColors[status] || "bg-slate-500 hover:bg-slate-600"
    const label = statusOptions.find((opt) => opt.value === status)?.label || "Unknown"
    const icon = statusIcons[status]

    return (
      <Badge className={`${color} text-white flex items-center gap-1.5 px-2.5 py-1 font-medium`}>
        {icon}
        {label}
      </Badge>
    )
  }

  const getStatusCount = (status: string) => {
    return jobs.filter((job) => job.status === status).length
  }

  return (
    <div className="min-h-screen  ">
      <div className="container pl-24 pr-4 pt-8  mx-auto  max-w-[96rem] w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl font-bold  bg-clip-text ">
              Job Application Tracker
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Track and manage your job applications in one place</p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="   shadow-md  transition-all"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Application
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="  rounded-xl shadow-none p-2 mb-2">
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
                setSearchTerm("")
                setStatusFilter(null)
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
            setActiveTab(value)
            setStatusFilter(null)
            setNextCursor(null)
            setJobs([])
          }}
          className="mb-8"
        >
          <TabsList>
            <TabsTrigger value="all" className={activeTab === "all" ? " dark:bg-black dark:text-white" : ""}>
              All
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className={activeTab === "saved" ? " dark:bg-black dark:text-white" : ""}
            >
              Saved
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              className={activeTab === "applied" ? " dark:bg-black dark:text-white" : ""}
            >
              Applied
            </TabsTrigger>
            <TabsTrigger
              value="interview"
              className={activeTab === "interview" ? " dark:bg-black dark:text-white" : ""}
            >
              Interviews
            </TabsTrigger>
            <TabsTrigger
              value="offer"
              className={activeTab === "offer" ? " dark:bg-black dark:text-white" : ""}
            >
              Offers
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className={activeTab === "rejected" ? " dark:bg-black dark:text-white" : ""}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Cards */}
        <div className="mt-6">
          {jobsLoading && jobs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <SolidCircleLoader className="w-10 h-10" />
            </div>
          ) : jobs.length === 0 ? (
            <Card className="w-full p-12 flex flex-col items-center justify-center text-center ">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No job applications found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start by adding your first job application to track your job search journey."}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className=" "
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Application
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="overflow-hidden     transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <CardTitle className="text-xl font-bold line-clamp-1">{job.position}</CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <Building className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">{job.company}</span>
                        </CardDescription>
                        {job.location && (
                          <CardDescription className="flex items-center text-sm">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span>{job.location}</span>
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>{getStatusBadge(job.status)}</div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Application Status</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => editJobApplication(job)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit Application
                            </DropdownMenuItem>
                            {job.url && (
                              <DropdownMenuItem onClick={() => window.open(job.url, "_blank")}>
                                <ExternalLink className="h-4 w-4 mr-2" /> View Job Posting
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-600 focus:text-rose-600 dark:text-rose-500 dark:focus:text-rose-500"
                              onClick={() => deleteJobApplication(job.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 pt-2">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span>Applied: {formatDate(job.date_applied)}</span>
                      {job.salary && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Salary: {job.salary}</span>
                        </>
                      )}
                    </div>

                    {job.contact_person && (
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <User className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span>Contact: {job.contact_person}</span>
                        {job.contact_email && (
                          <>
                            <span className="mx-1">•</span>
                            <Mail className="h-3.5 w-3.5 mx-1 flex-shrink-0" />
                            <span className="truncate">{job.contact_email}</span>
                          </>
                        )}
                      </div>
                    )}

                    {job.notes && (
                      <div className="mb-3 mt-4">
                        <h4 className="text-sm font-medium mb-1.5">Notes</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{job.notes}</p>
                      </div>
                    )}

                    {job.attachments && job.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1.5 text-sm group"
                            >
                              <Paperclip className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                              <span className="mr-2 truncate max-w-[120px]">{attachment.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteAttachment(job.id, attachment.id)}
                              >
                                <Trash2 className="h-3 w-3 text-rose-500" />
                                <span className="sr-only">Delete attachment</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <Separator className="my-1" />
                  <CardFooter className="pt-3 pb-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => editJobApplication(job)}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Details
                    </Button>
                    {job.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="   "
                        onClick={() => window.open(job.url, "_blank")}
                      >
                        <LinkIcon className="h-3.5 w-3.5 mr-1.5" /> View Job
                      </Button>
                    )}
                  </CardFooter>
                </Card>
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Job Application</DialogTitle>
              <DialogDescription>
                Enter the details of the job you're applying for to keep track of your application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Job title"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, State or Remote"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range (Optional)</Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g. $80,000 - $100,000"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_applied">Date Applied</Label>
                  <Input
                    id="date_applied"
                    name="date_applied"
                    type="date"
                    value={formatDateForInput(formData.date_applied)}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person (Optional)</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    placeholder="Recruiter or hiring manager"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email (Optional)</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Job URL (Optional)</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://company.com/jobs/position"
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes about this application"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="grid gap-2">
                  <div className="  p-4 bg-gray-50 dark:bg-gray-900">
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload resume, cover letter, or other relevant documents
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className=" p-3 mt-2 bg-gray-50 dark:bg-gray-900">
                      <h4 className="text-sm font-medium mb-2">Files to upload:</h4>
                      <ScrollArea className="h-[120px]">
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm   p-2 "
                            >
                              <div className="flex items-center">
                                <Paperclip className="h-4 w-4 mr-2 text-emerald-500" />
                                <span className="truncate max-w-[200px]">{file.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-rose-100 dark:hover:bg-rose-900 "
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                <span className="sr-only">Remove file</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={addJobApplication}
                disabled={actionLoading}
                className=""
              >
                {actionLoading ? <SolidCircleLoader className="w-4 h-4 mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Job Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Job Application</DialogTitle>
              <DialogDescription>Update the details of your job application</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Input
                    id="edit-position"
                    name="position"
                    placeholder="Job title"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    placeholder="City, State or Remote"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Salary Range</Label>
                  <Input
                    id="edit-salary"
                    name="salary"
                    placeholder="e.g. $80,000 - $100,000"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Application Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date Applied</Label>
                  <Input
                    id="edit-date"
                    name="date_applied"
                    type="date"
                    value={formatDateForInput(formData.date_applied)}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Person</Label>
                  <Input
                    id="edit-contact"
                    name="contact_person"
                    placeholder="Recruiter or hiring manager"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Contact Email</Label>
                  <Input
                    id="edit-email"
                    name="contact_email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">Job URL</Label>
                <Input
                  id="edit-url"
                  name="url"
                  placeholder="https://company.com/jobs/position"
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  placeholder="Add any notes about this application"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              {currentJob && currentJob.attachments && currentJob.attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Attachments</Label>
                  <div className=" p-3 bg-gray-50 dark:bg-gray-900">
                    <div className="space-y-2">
                      {currentJob.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between text-sm   p-2 "
                        >
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 mr-2 text-emerald-500" />
                            <span className="truncate max-w-[200px]">{attachment.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-rose-100 dark:hover:bg-rose-900"
                            onClick={() => deleteAttachment(currentJob.id, attachment.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            <span className="sr-only">Remove attachment</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Add New Attachments</Label>
                <div className=" p-4 bg-gray-50 dark:bg-gray-900">
                  <Input
                    id="edit-attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="cursor-pointer"
                  />
                </div>
                {files.length > 0 && (
                  <div className=" p-3 bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-sm font-medium mb-2">Files to upload:</h4>
                    <ScrollArea className="h-[120px]">
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm   p-2 "
                          >
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 mr-2 text-primary" />
                              <span className="truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-rose-100 dark:hover:bg-rose-900 "
                              onClick={() => removeFile(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={updateJobApplication}
                disabled={actionLoading}
                className=""
              >
                {actionLoading ? <SolidCircleLoader className="w-4 h-4 mr-2" /> : null}
                Update Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


