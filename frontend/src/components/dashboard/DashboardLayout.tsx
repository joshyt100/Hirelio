import React, { useState, useEffect, useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "../../context/SideBarContext";
import { useAuth } from "@/context/AuthContext";
import {
  DashboardResponse,
  StatusDatum,
  TimelineDatum,
  RateDatum,
  KeyValue,
  RecentApp,
} from "@/types/JobApplicationTypes";

// Dashboard API endpoint
const DASHBOARD_URL = "http://127.0.0.1:8000/api/dashboard/";

// Color maps for pies - defined outside component to prevent recreation
const STATUS_COLORS = {
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

const RATE_COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

// Memoized card components to prevent unnecessary re-renders
const SummaryCard = React.memo(({ title, value, subtitle }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </CardContent>
  </Card>
));

// Memoized application item component
const ApplicationItem = React.memo(({ job, formatDate }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-2 h-2 mt-2 rounded-full"
      style={{
        backgroundColor: STATUS_COLORS[job.status.charAt(0).toUpperCase() + job.status.slice(1)],
      }}
    />
    <div className="flex-1 space-y-1">
      <div className="flex justify-between">
        <p className="font-medium">{job.position}</p>
        <span className="text-xs text-muted-foreground">{formatDate(job.date_applied)}</span>
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
));

// Memoized chart components
const StatusPieChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={STATUS_COLORS[entry.name]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
));

const ResponseRateChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value">
        {data.map((_, idx) => (
          <Cell key={`cell-${idx}`} fill={RATE_COLORS[idx % RATE_COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
));

const LocationBarChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={120} />
      <Tooltip />
      <Bar dataKey="value" fill="#6366F1" />
    </BarChart>
  </ResponsiveContainer>
));

const TimelineChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
));

const CompanyBarChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={120} />
      <Tooltip />
      <Bar dataKey="value" fill="#6B7280" />
    </BarChart>
  </ResponsiveContainer>
));

const ResponseTimePieChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((_, idx) => (
          <Cell key={`cell-${idx}`} fill={RESPONSE_TIME_COLORS[idx % RESPONSE_TIME_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
));

// Main dashboard component
export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    total_applications: 0,
    active_applications: 0,
    interview_count: 0,
    offer_count: 0,
    rejection_count: 0,
    response_rate: 0,
    success_rate: 0,
    status_data: [],
    timeline_data: [],
    response_rate_data: [],
    location_data: [],
    company_data: [],
    time_to_response_data: [],
    recent_applications: [],
  });

  // UI controls
  const [timeRange, setTimeRange] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const { isMobile, collapsed } = useSidebar();
  const { checkAuthStatus } = useAuth();

  // Memoized classes to prevent recalculation
  const containerClasses = useMemo(() => {
    const leftPadding = collapsed ? "pl-16" : "pl-60";
    return `p-4 ${!isMobile && leftPadding} ${isMobile ? "ml-0" : "ml-10"} transition-all duration-300`;
  }, [isMobile, collapsed]);

  // Format date function (memoized to avoid recreation)
  const formatDate = useMemo(() => (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }), []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(DASHBOARD_URL, {
          withCredentials: true,
          params: { time_range: timeRange },
        });
        setDashboardData(resp.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Calculate derived values only when needed
  const interviewRate = useMemo(() => {
    const { interview_count, total_applications } = dashboardData;
    return interview_count > 0
      ? `${((interview_count / total_applications) * 100).toFixed(1)}% interview rate`
      : "No interviews yet";
  }, [dashboardData.interview_count, dashboardData.total_applications]);

  const offerRate = useMemo(() => {
    const { offer_count, total_applications } = dashboardData;
    return offer_count > 0
      ? `${((offer_count / total_applications) * 100).toFixed(1)}% offer rate`
      : "No offers yet";
  }, [dashboardData.offer_count, dashboardData.total_applications]);

  if (error) {
    return <div className="p-4 text-red-500">Error loading dashboard: {error}</div>;
  }

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="container mx-auto py-6 max-w-7xl 2xl:max-w-[100rem]">
          {/* Header & Filter Skeleton */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-40" />
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24 mb-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <Skeleton className="h-10 w-full mb-6" />

          {/* Charts Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="container mx-auto py-6 max-w-7xl 2xl:max-w-[100rem]">
        {/* Header & filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold sm:mt-4 lg:mt-0">Job Application Dashboard</h1>
            <p className="text-muted-foreground mb-4">Track your job search progress and analytics</p>
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
          <SummaryCard
            title="Total Applications"
            value={dashboardData.total_applications}
            subtitle={`${dashboardData.active_applications} active applications`}
          />
          <SummaryCard
            title="Interviews"
            value={dashboardData.interview_count}
            subtitle={interviewRate}
          />
          <SummaryCard
            title="Offers"
            value={dashboardData.offer_count}
            subtitle={offerRate}
          />
          <SummaryCard
            title="Response Rate"
            value={`${dashboardData.response_rate.toFixed(1)}%`}
            subtitle={`${dashboardData.success_rate.toFixed(1)}% success rate`}
          />
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
                  <CardDescription>Distribution of your job applications by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <StatusPieChart data={dashboardData.status_data} />
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
                    {dashboardData.recent_applications.map((job) => (
                      <ApplicationItem key={job.id} job={job} formatDate={formatDate} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Response Rates Bar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response & Success Rates</CardTitle>
                  <CardDescription>How often you get responses, interviews, and offers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponseRateChart data={dashboardData.response_rate_data} />
                  </div>
                </CardContent>
              </Card>

              {/* Top Locations Horizontal Bar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Locations</CardTitle>
                  <CardDescription>Where you're applying most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <LocationBarChart data={dashboardData.location_data} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab - Only render when active */}
          {activeTab === "timeline" && (
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Timeline</CardTitle>
                  <CardDescription>Your job application activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <TimelineChart data={dashboardData.timeline_data} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Insights Tab - Only render when active */}
          {activeTab === "insights" && (
            <TabsContent value="insights" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Companies</CardTitle>
                    <CardDescription>Companies you've applied to most</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CompanyBarChart data={dashboardData.company_data} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Time to Response</CardTitle>
                    <CardDescription>How long companies take to respond</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponseTimePieChart data={dashboardData.time_to_response_data} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
