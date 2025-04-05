import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Textarea,
  Label,
  Button,
  Select,
  SelectItem,
} from "../ui";
import { Paperclip, Trash2, Plus, Loader2 } from "lucide-react";
import { JobApplication } from "@/types/application";

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

interface JobDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (idOrForm: any, form?: FormData) => void;
  editJob?: JobApplication | null;
}

export default function JobDialog({ open, onClose, onSubmit, editJob }: JobDialogProps) {
  const [formData, setFormData] = useState({
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
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editJob) {
      setFormData({
        company: editJob.company,
        position: editJob.position,
        location: editJob.location,
        status: editJob.status,
        date_applied: new Date(editJob.date_applied).toISOString().split("T")[0],
        notes: editJob.notes,
        salary: editJob.salary || "",
        contact_person: editJob.contact_person || "",
        contact_email: editJob.contact_email || "",
        url: editJob.url || "",
      });
    } else {
      resetForm();
    }
  }, [editJob]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      files.forEach((file) => form.append("attachments", file));
      if (editJob) {
        await onSubmit(editJob.id, form);
      } else {
        await onSubmit(form);
      }
      resetForm();
      onClose();
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{editJob ? "Edit Job Application" : "Add New Job Application"}</DialogTitle>
          <DialogDescription>
            {editJob
              ? "Update the job application details below."
              : "Enter the details of a job you're applying for."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" name="salary" value={formData.salary} onChange={handleChange} />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_applied">Date Applied</Label>
              <Input
                id="date_applied"
                name="date_applied"
                type="date"
                value={formData.date_applied}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Job URL</Label>
            <Input id="url" name="url" value={formData.url} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <Input type="file" multiple onChange={handleFileUpload} />
            {files.length > 0 && (
              <div className="border rounded-md p-3 mt-2">
                <h4 className="text-sm font-medium mb-2">Files to upload:</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        <span>{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-destructive/20"
                        onClick={() => removeFile(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
            {editJob ? "Update" : "Add"} Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

