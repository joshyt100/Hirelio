
import React, { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Clock,
  TrendingUp,
  Briefcase,
  Building,
  MapPin,
  CheckCircle,
  XCircle,
  BarChart2,
  PieChartIcon,
  LineChartIcon,
  Filter,
} from "lucide-react"

import { JobApplication } from "@/types/application"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data based on the initialJobs from the tracking page
const sampleJobs: JobApplication[] = [
  {
    id: "1",
    company: "Acme Inc",
    position: "Frontend Developer",
    location: "San Francisco, CA (Remote)",
    status: "interview",
    dateApplied: new Date("2023-03-15"),
    notes: "Had first interview on March 20th. Waiting for second round.",
    attachments: [
      {
        id: "a1",
        name: "Resume_Frontend_2023.pdf",
        type: "resume",
        url: "#",
        dateAdded: new Date("2023-03-15"),
      },
      {
        id: "a2",
        name: "Cover_Letter_Acme.pdf",
        type: "coverLetter",
        url: "#",
        dateAdded: new Date("2023-03-15"),
      },
    ],
    salary: "$120,000 - $140,000",
    contactPerson: "Jane Smith",
    contactEmail: "jane.smith@acme.com",
    url: "https://acme.com/careers/frontend-developer",
  },
  {
    id: "2",
    company: "TechCorp",
    position: "Senior React Developer",
    location: "New York, NY",
    status: "applied",
    dateApplied: new Date("2023-03-10"),
    notes: "Applied through their careers portal. Used referral from David.",
    attachments: [
      {
        id: "a3",
        name: "Resume_Senior_React.pdf",
        type: "resume",
        url: "#",
        dateAdded: new Date("2023-03-10"),
      },
    ],
    salary: "$150,000 - $170,000",
    url: "https://techcorp.com/jobs/senior-react-developer",
  },
  {
    id: "3",
    company: "StartupXYZ",
    position: "Full Stack Engineer",
    location: "Remote",
    status: "saved",
    dateApplied: new Date("2023-03-05"),
    notes: "Interesting startup in the AI space. Need to customize resume before applying.",
    attachments: [],
    url: "https://startupxyz.com/careers",
  },
  {
    id: "4",
    company: "BigTech Co",
    position: "Software Engineer II",
    location: "Seattle, WA",
    status: "offer",
    dateApplied: new Date("2023-02-20"),
    notes: "Received offer on April 5th. Need to respond by April 15th.",
    attachments: [],
    salary: "$160,000 - $180,000",
    contactPerson: "John Recruiter",
    contactEmail: "john@bigtech.com",
  },
  {
    id: "5",
    company: "Local Startup",
    position: "Frontend Lead",
    location: "Austin, TX",
    status: "rejected",
    dateApplied: new Date("2023-02-15"),
    notes: "Rejected after final interview. Feedback: needed more leadership experience.",
    attachments: [],
  },
  {
    id: "6",
    company: "Tech Innovators",
    position: "UI/UX Developer",
    location: "Chicago, IL (Hybrid)",
    status: "interview",
    dateApplied: new Date("2023-02-10"),
    notes: "Second interview scheduled for next week.",
    attachments: [],
    salary: "$110,000 - $130,000",
  },
  {
    id: "7",
    company: "Global Systems",
    position: "React Native Developer",
    location: "Remote",
    status: "applied",
    dateApplied: new Date("2023-02-05"),
    notes: "Applied through LinkedIn Easy Apply.",
    attachments: [],
  },
  {
    id: "8",
    company: "Creative Solutions",
    position: "Frontend Architect",
    location: "Boston, MA",
    status: "saved",
    dateApplied: new Date("2023-02-01"),
    notes: "Interesting position, need to prepare portfolio.",
    attachments: [],
    salary: "$140,000 - $160,000",
  },
  {
    id: "9",
    company: "Data Dynamics",
    position: "Full Stack Developer",
    location: "Denver, CO",
    status: "rejected",
    dateApplied: new Date("2023-01-25"),
    notes: "Position filled internally.",
    attachments: [],
  },
  {
    id: "10",
    company: "Cloud Enterprises",
    position: "Senior Frontend Engineer",
    location: "Remote",
    status: "offer",
    dateApplied: new Date("2023-01-20"),
    notes: "Offer received: $145k base + 15% bonus + stock options.",
    attachments: [],
    salary: "$145,000",
    contactPerson: "Sarah Hiring",
    contactEmail: "sarah@cloud.com",
  },
]

// Extended sample data for more realistic analytics
const extendedJobs: JobApplication[] = [
  ...sampleJobs,
  {
    id: "11",
    company: "DevOps Inc",
    position: "Frontend Developer",
    location: "Portland, OR",
    status: "applied",
    dateApplied: new Date("2023-01-15"),
    notes: "",
    attachments: [],
  },
  {
    id: "12",
    company: "AI Solutions",
    position: "UI Engineer",
    location: "Remote",
    status: "interview",
    dateApplied: new Date("2023-01-10"),
    notes: "",
    attachments: [],
  },
  {
    id: "13",
    company: "Fintech Startup",
    position: "React Developer",
    location: "Miami, FL",
    status: "rejected",
    dateApplied: new Date("2023-01-05"),
    notes: "",
    attachments: [],
  },
  {
    id: "14",
    company: "Health Tech",
    position: "Frontend Engineer",
    location: "Minneapolis, MN",
    status: "applied",
    dateApplied: new Date("2022-12-20"),
    notes: "",
    attachments: [],
  },
  {
    id: "15",
    company: "Education Platform",
    position: "UI/UX Developer",
    location: "Remote",
    status: "interview",
    dateApplied: new Date("2022-12-15"),
    notes: "",
    attachments: [],
  },
]

// Status options and colors (matching the tracking page)
const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
]

const statusColors: Record<string, string> = {
  saved: "#64748b", // slate-500
  applied: "	#5D3FD3", // blue-500
  interview: "#f59e0b", // amber-500
  offer: "#22c55e", // green-500
  rejected: "#ef4444", // red-500
}

// Helper functions
const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

const getMonthName = (date: Date) => new Date(date).toLocaleDateString("en-US", { month: "short" })

const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Prepare data for charts
const prepareStatusData = (jobs: JobApplication[]) => {
  const counts = {
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  }

  jobs.forEach((job) => {
    if (job.status in counts) {
      counts[job.status as keyof typeof counts]++
    }
  })

  return Object.entries(counts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: statusColors[status],
  }))
}

const prepareTimelineData = (jobs: JobApplication[]) => {
  // Group by month
  const monthlyData: Record<string, { month: string; applications: number; interviews: number; offers: number }> = {}

  jobs.forEach((job) => {
    const month = getMonthName(job.dateApplied)
    if (!monthlyData[month]) {
      monthlyData[month] = { month, applications: 0, interviews: 0, offers: 0 }
    }

    monthlyData[month].applications++
    if (job.status === "interview") monthlyData[month].interviews++
    if (job.status === "offer") monthlyData[month].offers++
  })

  // Convert to array and sort by month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return Object.values(monthlyData).sort(
    (a, b) => months.indexOf(a.month as string) - months.indexOf(b.month as string),
  )
}

const prepareResponseRateData = (jobs: JobApplication[]) => {
  const total = jobs.length
  const responses = jobs.filter((job) => job.status !== "saved" && job.status !== "applied").length
  const interviews = jobs.filter(
    (job) => job.status === "interview" || job.status === "offer" || job.status === "rejected",
  ).length
  const offers = jobs.filter((job) => job.status === "offer").length

  const responseRate = total > 0 ? (responses / total) * 100 : 0
  const interviewRate = responses > 0 ? (interviews / responses) * 100 : 0
  const offerRate = interviews > 0 ? (offers / interviews) * 100 : 0

  return [
    { name: "Response Rate", value: responseRate.toFixed(1) },
    { name: "Interview Rate", value: interviewRate.toFixed(1) },
    { name: "Offer Rate", value: offerRate.toFixed(1) },
  ]
}

const prepareLocationData = (jobs: JobApplication[]) => {
  const locationMap: Record<string, number> = {}

  jobs.forEach((job) => {
    let location = "Unknown"

    if (job.location) {
      if (job.location.toLowerCase().includes("remote")) {
        location = "Remote"
      } else {
        // Extract city or state
        const match = job.location.match(/([A-Za-z\s]+),?\s*([A-Z]{2})/)
        location = match ? match[1] : job.location.split(",")[0]
      }
    }

    locationMap[location] = (locationMap[location] || 0) + 1
  })

  return Object.entries(locationMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 locations
}

const prepareCompanyData = (jobs: JobApplication[]) => {
  const companyMap: Record<string, number> = {}

  jobs.forEach((job) => {
    companyMap[job.company] = (companyMap[job.company] || 0) + 1
  })

  return Object.entries(companyMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 companies
}

const prepareTimeToResponseData = (jobs: JobApplication[]) => {
  // This would normally use actual response dates, but we'll simulate for the demo
  // In a real app, you'd track when status changes from applied to interview/rejected
  const responseTimesInDays = [3, 5, 7, 10, 14, 21, 28, 30]

  const data = responseTimesInDays.reduce((acc: Record<string, number>, days) => {
    const category = days <= 7 ? "< 1 week" : days <= 14 ? "1-2 weeks" : days <= 30 ? "2-4 weeks" : "> 4 weeks"
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return Object.entries(data).map(([name, value]) => ({ name, value }))
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export default function DashboardLayout() {
  const [jobs, setJobs] = useState<JobApplication[]>(extendedJobs)
  const [timeRange, setTimeRange] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Filter jobs based on time range
  const filteredJobs = React.useMemo(() => {
    if (timeRange === "all") return jobs

    const now = new Date()
    const cutoffDate = new Date()

    if (timeRange === "30days") {
      cutoffDate.setDate(now.getDate() - 30)
    } else if (timeRange === "90days") {
      cutoffDate.setDate(now.getDate() - 90)
    } else if (timeRange === "6months") {
      cutoffDate.setMonth(now.getMonth() - 6)
    }

    return jobs.filter((job) => job.dateApplied >= cutoffDate)
  }, [jobs, timeRange])

  // Prepare data for charts
  const statusData = React.useMemo(() => prepareStatusData(filteredJobs), [filteredJobs])
  const timelineData = React.useMemo(() => prepareTimelineData(filteredJobs), [filteredJobs])
  const responseRateData = React.useMemo(() => prepareResponseRateData(filteredJobs), [filteredJobs])
  const locationData = React.useMemo(() => prepareLocationData(filteredJobs), [filteredJobs])
  const companyData = React.useMemo(() => prepareCompanyData(filteredJobs), [filteredJobs])
  const timeToResponseData = React.useMemo(() => prepareTimeToResponseData(filteredJobs), [filteredJobs])

  // Calculate summary metrics
  const totalApplications = filteredJobs.length
  const activeApplications = filteredJobs.filter((job) => job.status === "applied" || job.status === "interview").length
  const interviewCount = filteredJobs.filter((job) => job.status === "interview").length
  const offerCount = filteredJobs.filter((job) => job.status === "offer").length
  const rejectionCount = filteredJobs.filter((job) => job.status === "rejected").length
  const responseRate =
    totalApplications > 0
      ? (((interviewCount + offerCount + rejectionCount) / totalApplications) * 100).toFixed(1)
      : "0"
  const successRate =
    interviewCount + offerCount + rejectionCount > 0
      ? ((offerCount / (interviewCount + offerCount + rejectionCount)) * 100).toFixed(1)
      : "0"

  // Get recent activity
  const recentApplications = [...filteredJobs]
    .sort((a, b) => b.dateApplied.getTime() - a.dateApplied.getTime())
    .slice(0, 5)

  return (
    <div className="ml-20 md:ml-20 lg:ml-32 p-4">
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold">Job Application Dashboard</h1>
            <p className="text-muted-foreground">Track your job search progress and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeApplications} active applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interviewCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {interviewCount > 0
                  ? `${((interviewCount / totalApplications) * 100).toFixed(1)}% interview rate`
                  : "No interviews yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offerCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {offerCount > 0
                  ? `${((offerCount / totalApplications) * 100).toFixed(1)}% offer rate`
                  : "No offers yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responseRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{successRate}% success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Application Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                  <CardDescription>Distribution of your job applications by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Applications</CardTitle>
                  <CardDescription>Your most recent job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((job) => (
                      <div key={job.id} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full bg-${job.status === "offer" ? "green" : job.status === "interview" ? "amber" : job.status === "rejected" ? "red" : job.status === "applied" ? "blue" : "slate"}-500`}
                          style={{ backgroundColor: statusColors[job.status] }}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{job.position}</p>
                            <span className="text-xs text-muted-foreground">{formatDate(job.dateApplied)}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{job.company}</span>
                            {job.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{job.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Rates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Rates</CardTitle>
                  <CardDescription>Your application success metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={responseRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" name="Percentage" fill="#3b82f6">
                          {responseRateData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#3b82f6" : index === 1 ? "#f59e0b" : "#22c55e"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Locations</CardTitle>
                  <CardDescription>Where you're applying most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={locationData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Timeline</CardTitle>
                <CardDescription>Your job application activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        name="Applications"
                      />
                      <Line type="monotone" dataKey="interviews" stroke="#f59e0b" name="Interviews" />
                      <Line type="monotone" dataKey="offers" stroke="#22c55e" name="Offers" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Time to Response</CardTitle>
                  <CardDescription>How long companies take to respond</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeToResponseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#64748b" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Activity</CardTitle>
                  <CardDescription>Your application frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Companies</CardTitle>
                  <CardDescription>Companies you've applied to most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={companyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" name="Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Success Metrics</CardTitle>
                  <CardDescription>Your application conversion rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm font-medium">Application to Interview</span>
                      </div>
                      <span className="font-bold">
                        {totalApplications > 0 ? `${((interviewCount / totalApplications) * 100).toFixed(1)}%` : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${totalApplications > 0 ? (interviewCount / totalApplications) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="text-sm font-medium">Interview to Offer</span>
                      </div>
                      <span className="font-bold">
                        {interviewCount > 0 ? `${((offerCount / interviewCount) * 100).toFixed(1)}%` : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${interviewCount > 0 ? (offerCount / interviewCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-sm font-medium">Rejection Rate</span>
                      </div>
                      <span className="font-bold">
                        {totalApplications > 0 ? `${((rejectionCount / totalApplications) * 100).toFixed(1)}%` : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${totalApplications > 0 ? (rejectionCount / totalApplications) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Efficiency</CardTitle>
                  <CardDescription>Time and effort analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Average applications per week</span>
                    </div>
                    <span className="font-bold">
                      {(
                        totalApplications /
                        (filteredJobs.length > 0
                          ? Math.max(
                            1,
                            Math.ceil(
                              (new Date().getTime() -
                                Math.min(...filteredJobs.map((job) => job.dateApplied.getTime()))) /
                              (7 * 24 * 60 * 60 * 1000),
                            ),
                          )
                          : 1)
                      ).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Interview success rate</span>
                    </div>
                    <span className="font-bold">
                      {interviewCount > 0 ? `${((offerCount / interviewCount) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Applications to get an offer</span>
                    </div>
                    <span className="font-bold">
                      {offerCount > 0 ? (totalApplications / offerCount).toFixed(1) : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visualization Options</CardTitle>
                  <CardDescription>Change how you view your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 space-y-2"
                      onClick={() => setActiveTab("overview")}
                    >
                      <PieChartIcon className="h-8 w-8" />
                      <span>Overview</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 space-y-2"
                      onClick={() => setActiveTab("timeline")}
                    >
                      <LineChartIcon className="h-8 w-8" />
                      <span>Timeline</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 space-y-2"
                      onClick={() => setActiveTab("insights")}
                    >
                      <BarChart2 className="h-8 w-8" />
                      <span>Insights</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


