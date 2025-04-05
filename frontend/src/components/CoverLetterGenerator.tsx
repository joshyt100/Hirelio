import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CiEdit } from "react-icons/ci";
import { generateCoverLetter } from "@/api/generate";
import { saveCoverLetter } from "@/api/save";
import { CoverLetterData } from "../types/types";

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>(() => localStorage.getItem("jobDescription") || "");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(() => localStorage.getItem("coverLetter") || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [jobName, setJobName] = useState<string>(() => localStorage.getItem("jobName") || "");
  const [companyName, setCompanyName] = useState<string>(() => localStorage.getItem("companyName") || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState<string | null>(coverLetter);
  const [isSaved, setIsSaved] = useState<boolean>(() => localStorage.getItem("isSaved") === "true");

  useEffect(() => {
    localStorage.setItem("jobDescription", jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    if (coverLetter) {
      localStorage.setItem("coverLetter", coverLetter);
    }
  }, [coverLetter]);

  useEffect(() => {
    localStorage.setItem("jobName", jobName);
  }, [jobName]);

  useEffect(() => {
    localStorage.setItem("companyName", companyName);
  }, [companyName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResume(event.target.files[0]);
    }
  };

  const handleGenerateCoverLetter = async (): Promise<void> => {
    if (!resume || !jobDescription || !jobName || !companyName) {
      setError("Please upload a resume, enter a job description, and provide job and company names.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("resume", resume);
    formData.append("job_name", jobName);
    formData.append("company_name", companyName);

    try {
      const response = await generateCoverLetter(formData);
      setCoverLetter(response.coverLetter);
      localStorage.setItem("coverLetter", response.coverLetter);
      setIsSaved(false); // Allow saving again since it's a new cover letter
      localStorage.setItem("isSaved", "false");
    } catch (error) {
      setError("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverLetterSave = async (): Promise<void> => {
    if (!jobName || !companyName || !coverLetter || isSaved) {
      setError("You have already saved this cover letter.");
      return;
    }

    const data: CoverLetterData = {
      job_title: jobName,
      company_name: companyName,
      cover_letter: coverLetter,
    };

    try {
      await saveCoverLetter(data);
      setIsSaved(true);
      localStorage.setItem("isSaved", "true");
    } catch (error) {
      setError("Failed to save cover letter");
    }
  };

  const handleEditSave = () => {
    if (editedCoverLetter) {
      setCoverLetter(editedCoverLetter);
      localStorage.setItem("coverLetter", editedCoverLetter);
      setIsSaved(false); // Allow saving again since it's modified
      localStorage.setItem("isSaved", "false");
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="  w-11/12 sm:max-w-xl md:max-w-4xl lg:max-w-6xl 2xl:max-w-8xl h-full    flex flex-col items-center justify-center ml-28  max-w-lg md:flex-row ">
        <div className="p-6 w-full sm:w-full rounded-lg h-full flex flex-col">
          <h1 className="text-3xl w-full font-bold mb-6">Cover Letter Generator</h1>
          <h2 className="text-lg w-full font-semibold mb-4">Enter Job Description</h2>
          <Textarea
            placeholder="Enter job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full sm:w flex-1 min-h-[400px] border border-border resize-none mb-4"
          />

          <div className="mb-4">
            <Label htmlFor="job-name">Job Name</Label>
            <Input
              id="job-name"
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="w-full mt-2 border border-border"
              placeholder="Enter job name"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full mt-2 border-border"
              placeholder="Enter company name"
            />
          </div>

          <Label htmlFor="resume">Upload Resume</Label>
          <Input id="resume" type="file" accept=".pdf" onChange={handleFileChange} className="w-full border border-border mt-2" />

          <Button onClick={handleGenerateCoverLetter} disabled={loading} className="mt-4 w-full">
            {loading ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </div>

        <div className="p-6 w-full sm:w-full rounded-lg flex flex-col justify-center items-center min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"></div>
              <p className="mt-4">Generating your cover letter...</p>
            </div>
          ) : coverLetter ? (
            <div className="w-full relative ">
              <h2 className="text-lg font-semibold mt-10 mb-4">Generated Cover Letter</h2>
              <div className="relative">
                <Textarea
                  placeholder=""
                  value={coverLetter}
                  className="w-full sm:w flex-1 min-h-[750px] bg-zinc-100 border border-border    dark:bg-zinc-950 resize-none mb-4"
                  readOnly
                />

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <button className="absolute top-3 right-3 bg-gray-700 text-white p-2 rounded-md hover:bg-gray-700 transition flex items-center justify-center">
                      <CiEdit />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Cover Letter</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      placeholder="Edit cover letter..."
                      value={editedCoverLetter || ""}
                      onChange={(e) => setEditedCoverLetter(e.target.value)}
                      className="w-full h-[500px] resize-none border border-border"
                    />
                    <DialogFooter>
                      <Button onClick={handleEditSave}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button onClick={handleCoverLetterSave} disabled={isSaved} className="absolute  text-white da   top-3  mr-1 right-12">
                  {isSaved ? "Already Saved" : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <p>Your cover letter will appear here.</p>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

