import React, { useRef } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CSRFToken from "@/components/csrf-token/CSRFToken";
import { LogoutConfirmProps } from "@/types/AuthTypes";

export const LogoutConfirm: React.FC<LogoutConfirmProps> = ({
  open,
  onClose,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Let the browser submit the form
  };

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.submit(); // 🔥 manually submit the real form
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <DialogContent className="z-50 max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          {/* REAL FORM with CSRF */}
          <form
            ref={formRef}
            action="http://127.0.0.1:8000/api/logout/"
            method="POST"
            onSubmit={handleSubmit}
            className="mt-4 space-y-4"
          >
            <CSRFToken />

            <DialogFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={submitForm}>
                Logout
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

