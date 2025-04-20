import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "recharts";
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
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SolidCircleLoader } from "../loader/SolidCircleLoader";
import { useSidebar } from "../../context/SideBarContext";

// Dashboard API endpoint
const DASHBOARD_URL = "http://127.0.0.1:8000/api/dashboard/";

// Color maps for pies
const STATUS_COLORS: Record<string, string> = {
  Saved: "#64748b",
  Applied: "#3b82f6",
  Interview: "#f59e0b",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

const RESPONSE_TIME_COLORS = [
  "#3b82f6", // < 1 week
  "#f59e0b", // 1-2 weeks
  "#64748b", // 2-4 weeks
  "#ef4444", // > 4 weeks
];

type StatusDatum = { name: string; value: number };
type TimelineDatum = { month: string; applications: number; interviews: number; offers: number };
type RateDatum = { name: string; value: number };
type KeyValue = { name: string; value: number };
type RecentApp = { id: number; company: string; position: string; location: string; status: string; date_applied: string };

type DashboardResponse = {
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

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Summary state
  const [totalApplications, setTotalApplications] = useState(0);
  const [activeApplications, setActiveApplications] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  // Chart state
  const [statusData, setStatusData] = useState<StatusDatum[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineDatum[]>([]);
  const [responseRateData, setResponseRateData] = useState<RateDatum[]>([]);
  const [locationData, setLocationData] = useState<KeyValue[]>([]);
  const [companyData, setCompanyData] = useState<KeyValue[]>([]);
  const [timeToResponseData, setTimeToResponseData] = useState<KeyValue[]>([]);

  // Recent applications
  const [recentApplications, setRecentApplications] = useState<RecentApp[]>([]);

  // UI controls
  const [timeRange, setTimeRange] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const { collapsed } = useSidebar();
  const leftPadding = collapsed ? "pl-16" : "pl-48";

  // Fetch and reload on timeRange change
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const resp = await axios.get<DashboardResponse>(DASHBOARD_URL, {
          withCredentials: true,
          params: { time_range: timeRange },
        });
        const data = resp.data;

        setTotalApplications(data.total_applications);
        setActiveApplications(data.active_applications);
        setInterviewCount(data.interview_count);
        setOfferCount(data.offer_count);
        setRejectionCount(data.rejection_count);
        setResponseRate(data.response_rate);
        setSuccessRate(data.success_rate);

        setStatusData(data.status_data);
        setTimelineData(data.timeline_data);
        setResponseRateData(data.response_rate_data);
        setLocationData(data.location_data);
        setCompanyData(data.company_data);
        setTimeToResponseData(data.time_to_response_data);
        setRecentApplications(data.recent_applications);

        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [timeRange]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return <SolidCircleLoader className="w-8 self-center h-8 mt-56 mx-auto my-8" />;
  }
  if (error) {
    return <div className="p-4 text-red-500">Error loading dashboard: {error}</div>;
  }

  return (
    <div className={`ml-20 p-4 ${leftPadding} transition-all duration-300`}>
      <div className="container mx-auto py-6 max-w-7xl">
        {/* Header & filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold">Job Application Dashboard</h1>
            <p className="text-muted-foreground">
              Track your job search progress and analytics
            </p>
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

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeApplications} active applications
              </p>
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
              <div className="text-2xl font-bold">{responseRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {successRate.toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="dark:bg-zinc-850">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status Pie */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                  <CardDescription>
                    Distribution of your job applications by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, idx) => (
                            <Cell key={idx} fill={STATUS_COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Applications</CardTitle>
                  <CardDescription>
                    Your most recent job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((job) => (
                      <div key={job.id} className="flex items-start gap-3">
                        <div
                          className="w-2 h-2 mt-2 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[job.status.charAt(0).toUpperCase() + job.status.slice(1)] }}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{job.position}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(job.date_applied)}
                            </span>
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
            </div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Timeline</CardTitle>
                <CardDescription>
                  Your job application activity over time
                </CardDescription>
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
                      <Line type="monotone" dataKey="applications" stroke="#3b82f6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="interviews" stroke="#f59e0b" />
                      <Line type="monotone" dataKey="offers" stroke="#22c55e" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Companies</CardTitle>
                  <CardDescription>
                    Companies you've applied to most
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={companyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Time to Response</CardTitle>
                  <CardDescription>
                    How long companies take to respond
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeToResponseData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {timeToResponseData.map((_, idx) => (
                            <Cell key={idx} fill={RESPONSE_TIME_COLORS[idx % RESPONSE_TIME_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

