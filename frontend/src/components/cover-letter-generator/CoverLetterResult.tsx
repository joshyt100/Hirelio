import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditCoverLetterDialog } from "./EditCoverLetterDialog";
import { useSidebar } from "@/context/SideBarContext";
import { SolidCircleLoader } from "../loader/SolidCircleLoader";
import { CoverLetterResultProps } from "@/types/CoverLetterTypes";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CoverLetterResult = ({
  coverLetter,
  setCoverLetter,
  onSave,
  isSaved,
  error,
  loading,
}: CoverLetterResultProps) => {
  const { isMobile } = useSidebar();
  const paddingClass = isMobile ? "px-4" : "px-6";
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleCopy = async () => {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleEditSave = (updatedText: string) => {
    setCoverLetter(updatedText);
    setSaved(false); // Enable save button again
  };

  const handleSaveClick = () => {
    onSave();
    setSaved(true); // Disable save button after saving
  };

  return (
    <div
      className={`${paddingClass} w-full sm:w-full rounded-lg flex flex-col justify-center items-center min-h-[300px]`}
    >
      {loading ? (
        <div className="flex flex-col items-center">
          <SolidCircleLoader className="w-6 h-6 mx-auto my-8" />
          <p className="mt-4">Generating your cover letter...</p>
        </div>
      ) : (
        <div className="w-full">
          <h2 className="text-xl font-semibold mt-10 mb-4">
            Generated Cover Letter
          </h2>
          <div className="relative">
            <Textarea
              value={coverLetter || ""}
              readOnly
              placeholder="Your cover letter will appear here."
              className="w-full flex-1 min-h-[50rem] bg-zinc-50 border border-zinc-300 dark:border-border dark:bg-zinc-900 resize-none mb-4"
            />
            {coverLetter && (
              <div className="flex gap-2 justify-end mb-2">
                <Button onClick={handleCopy} variant="secondary" size="sm">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </>
                  )}
                </Button>
                <EditCoverLetterDialog
                  coverLetter={coverLetter}
                  onSaveEdit={handleEditSave}
                />
                <Button onClick={handleSaveClick} disabled={saved} size="sm">
                  {saved ? "Already Saved" : "Save"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

