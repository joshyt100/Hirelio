import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CiEdit } from "react-icons/ci";

export const EditCoverLetterDialog = ({ coverLetter, setCoverLetter }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState(coverLetter);

  const handleSave = () => {
    setCoverLetter(editedCoverLetter);
    localStorage.setItem("coverLetter", editedCoverLetter);
    localStorage.setItem("isSaved", "false");
    setIsEditing(false);
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogTrigger asChild>
        <button className="absolute top-3 right-3 bg-black dark:bg-gray-700 text-white p-2 rounded-md hover:bg-gray-700 transition flex items-center justify-center">
          <CiEdit />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Cover Letter</DialogTitle>
        </DialogHeader>
        <Textarea
          value={editedCoverLetter}
          onChange={(e) => setEditedCoverLetter(e.target.value)}
          className="w-full h-[500px] resize-none border border-border"
        />
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

