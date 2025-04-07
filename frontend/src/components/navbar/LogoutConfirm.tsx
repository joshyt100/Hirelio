import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirm: React.FC<LogoutConfirmProps> = ({ open, onClose, onConfirm }) => {
  return (
    <div className="flex items-center justify-center">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">Confirm Logout</h2>
          </DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

