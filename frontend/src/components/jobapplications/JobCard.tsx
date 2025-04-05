import React from "react";
import { Edit, Trash2, Calendar, Paperclip, MoreHorizontal, MapPin, Building } from "lucide-react";
import { JobApplication } from "@/types/application";
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui";

const statusColors: Record<string, string> = {
  saved: "bg-slate-500 text-white",
  applied: "bg-blue-500 text-white",
  interview: "bg-amber-500 text-white",
  offer: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US");

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onDeleteAttachment,
}: {
  job: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteAttachment: (jobId: string, attachmentId: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
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
            <Badge className={statusColors[job.status]}>{job.status}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Applied: {formatDate(job.date_applied)}
        </div>
        {job.notes && <p className="text-sm">{job.notes}</p>}
        {job.attachments?.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {job.attachments.map((a) => (
                <div key={a.id} className="flex items-center bg-secondary rounded-md px-3 py-1.5 text-sm">
                  <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                  <span className="mr-2">{a.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 hover:bg-destructive/20"
                    onClick={() => onDeleteAttachment(job.id, a.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
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
  );
}

