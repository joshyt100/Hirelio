import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Trash2, Edit, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EditJobDialogProps } from "@/types/JobApplicationTypes";


const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const EditJobDialog: React.FC<EditJobDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onInputChange,
  handleStatusChange,
  handleDateChange,
  files,
  handleFileUpload,
  removeFile,
  onSubmit,
  actionLoading,
  currentJob,
  onDeleteAttachment,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Job Application</DialogTitle>
          <DialogDescription>Update the details of your job application</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                name="company"
                placeholder="Company name"
                value={formData.company}
                onChange={onInputChange}
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
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          {/* Location & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                placeholder="City, State or Remote"
                value={formData.location}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-salary">Salary Range</Label>
              <Input
                id="edit-salary"
                name="salary"
                placeholder="e.g. $80,000 - $100,000"
                value={formData.salary}
                onChange={onInputChange}
              />
            </div>
          </div>
          {/* Status & Date Applied */}
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
                value={formData.date_applied}
                onChange={handleDateChange}
              />
            </div>
          </div>
          {/* Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                name="contact_person"
                placeholder="Recruiter or hiring manager"
                value={formData.contact_person}
                onChange={onInputChange}
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
                onChange={onInputChange}
              />
            </div>
          </div>
          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-url">Job URL</Label>
            <Input
              id="edit-url"
              name="url"
              placeholder="https://company.com/jobs/position"
              value={formData.url}
              onChange={onInputChange}
            />
          </div>
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              name="notes"
              placeholder="Add any notes about this application"
              value={formData.notes}
              onChange={onInputChange}
              className="min-h-[100px]"
            />
          </div>
          {/* Current Attachments */}
          {currentJob && currentJob.attachments && currentJob.attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Current Attachments</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-2">
                  {currentJob.attachments.map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center justify-between text-sm p-2">
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-2 text-emerald-500" />
                        <span className="truncate max-w-[200px]">{attachment.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-rose-100 dark:hover:bg-rose-900"
                        onClick={() => onDeleteAttachment(currentJob.id, attachment.id)}
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
          {/* New Attachments */}
          <div className="space-y-2">
            <Label>Add New Attachments</Label>
            <div className="p-4 ">
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
              <div className="p-3 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-sm font-medium mb-2">Files to upload:</h4>
                <ScrollArea className="h-[120px]">
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 mr-2" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-rose-100 dark:hover:bg-rose-900"
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={actionLoading}>
            {actionLoading ? <span>Loading...</span> : <><Plus className="mr-2 h-4 w-4" /> Update Application</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;

