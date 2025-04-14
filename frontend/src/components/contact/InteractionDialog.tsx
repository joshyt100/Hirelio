// contact/InteractionDialog.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { interactionTypes } from "@/types/ContactTypes";

interface InteractionFormData {
  date: Date;
  type: "email" | "call" | "meeting" | "message" | "other";
  notes: string;
}

interface InteractionDialogProps {
  isOpen: boolean;
  contactName: string;
  initialData: InteractionFormData;
  onClose: () => void;
  onSubmit: (data: InteractionFormData) => void;
}

export const InteractionDialog: React.FC<InteractionDialogProps> = ({
  isOpen,
  contactName,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [interactionData, setInteractionData] = useState<InteractionFormData>(initialData);

  useEffect(() => {
    setInteractionData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInteractionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setInteractionData((prev) => ({ ...prev, type: value as InteractionFormData["type"] }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInteractionData((prev) => ({ ...prev, date: new Date(e.target.value) }));
  };

  const formatDateForInput = (date: Date) => new Date(date).toISOString().split("T")[0];

  const handleSubmit = () => {
    onSubmit(interactionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Interaction</DialogTitle>
          <DialogDescription>Record a new interaction with {contactName}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interaction-type">Interaction Type</Label>
              <Select value={interactionData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="interaction-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {interactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interaction-date">Date</Label>
              <Input
                id="interaction-date"
                name="date"
                type="date"
                value={formatDateForInput(interactionData.date)}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interaction-notes">Notes</Label>
            <Textarea
              id="interaction-notes"
              name="notes"
              placeholder="What did you discuss? Any action items?"
              value={interactionData.notes}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Interaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

