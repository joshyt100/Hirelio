import React from "react";
import type { JobApplication } from "@/types/application";
import {
  Calendar,
  Building,
  MapPin,
  Paperclip,
  Trash2,
  Edit,
  ExternalLink,
  LinkIcon,
  Mail,
  User,
} from "lucide-react";

// Import shadcn/ui components
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface JobCardProps {
  job: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteAttachment: (jobId: string, attachmentId: string) => void;
}

const statusColors: Record<string, string> = {
  saved: "bg-slate-500 hover:bg-slate-600",
  applied: "bg-sky-500 hover:bg-sky-600",
  interview: "bg-amber-500 hover:bg-amber-600",
  offer: "bg-emerald-500 hover:bg-emerald-600",
  rejected: "bg-rose-500 hover:bg-rose-600",
};

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const statusIcons: Record<string, React.ReactNode> = {
  saved: <Paperclip className="h-3.5 w-3.5" />,
  applied: <Paperclip className="h-3.5 w-3.5" />,
  interview: <Calendar className="h-3.5 w-3.5" />,
  offer: <Paperclip className="h-3.5 w-3.5" />,
  rejected: <Paperclip className="h-3.5 w-3.5" />,
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, onDeleteAttachment }) => {
  const getStatusBadge = (status: string) => {
    const color = statusColors[status] || "bg-slate-500 hover:bg-slate-600";
    const label = statusOptions.find((opt) => opt.value === status)?.label || "Unknown";
    const icon = statusIcons[status];

    return (
      <Badge className={`${color} text-white flex items-center gap-1.5 px-2.5 py-1 font-medium`}>
        {icon}
        {label}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden transition-shadow">
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
                <TooltipTrigger asChild>{getStatusBadge(job.status)}</TooltipTrigger>
                <TooltipContent>
                  <p>Application Status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Application
                </DropdownMenuItem>
                {job.url && (
                  <DropdownMenuItem onClick={() => window.open(job.url, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" /> View Job Posting
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-rose-600">
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
                    onClick={() => onDeleteAttachment(job.id, attachment.id)}
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
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Details
        </Button>
        {job.url && (
          <Button variant="outline" size="sm" onClick={() => window.open(job.url, "_blank")}>
            <LinkIcon className="h-3.5 w-3.5 mr-1.5" /> View Job
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;

