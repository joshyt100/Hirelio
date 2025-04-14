// contact/ContactFormDialog.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
//import relationshipOptions, tagOptions  from "@types/ContactTypes";
import { relationshipOptions, tagOptions } from "@/types/ContactTypes";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  relationship: string;
  notes: string;
  lastContacted?: Date;
  nextFollowUp?: Date;
  linkedinUrl: string;
  twitterUrl: string;
}

interface ContactFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData: ContactFormData;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClose: () => void;
  onSubmit: (data: ContactFormData, tags: string[]) => void;
}

export const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
  isOpen,
  mode,
  initialData,
  selectedTags,
  onTagSelect,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ContactFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRelationshipChange = (value: string) => {
    setFormData((prev) => ({ ...prev, relationship: value }));
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "lastContacted" | "nextFollowUp"
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value ? new Date(e.target.value) : undefined }));
  };

  const formatDateForInput = (date?: Date) => (date ? new Date(date).toISOString().split("T")[0] : "");

  const handleSubmit = () => {
    onSubmit(formData, selectedTags);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Contact" : "Edit Contact"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new professional contact to your network for potential referrals and opportunities."
              : "Update the details of your contact."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" name="phone" placeholder="555-123-4567" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select value={formData.relationship} onValueChange={handleRelationshipChange}>
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" name="company" placeholder="Company name" value={formData.company} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position (Optional)</Label>
              <Input id="position" name="position" placeholder="Job title" value={formData.position} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastContacted">Last Contacted (Optional)</Label>
              <Input
                id="lastContacted"
                name="lastContacted"
                type="date"
                value={formatDateForInput(formData.lastContacted)}
                onChange={(e) => handleDateChange(e, "lastContacted")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextFollowUp">Next Follow-up (Optional)</Label>
              <Input
                id="nextFollowUp"
                name="nextFollowUp"
                type="date"
                value={formatDateForInput(formData.nextFollowUp)}
                onChange={(e) => handleDateChange(e, "nextFollowUp")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter URL (Optional)</Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                placeholder="https://twitter.com/username"
                value={formData.twitterUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {tagOptions.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onTagSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about this contact"
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{mode === "add" ? "Add Contact" : "Update Contact"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

