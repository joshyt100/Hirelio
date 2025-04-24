import React, { useState, useEffect } from "react";
import { CoverLetterForm } from "./CoverLetterForm";
import { CoverLetterResult } from "./CoverLetterResult";
import { generateCoverLetter } from "@/api/generate";
import { saveCoverLetter } from "@/api/save";
import { CoverLetterData } from "@/types/CoverLetterTypes";
import { useSidebar } from "@/context/SideBarContext";
//import { SolidCircleLoader } from "../loader/SolidCircleLoader";

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem("jobDescription") || "");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(() => localStorage.getItem("coverLetter") || null);
  const [jobName, setJobName] = useState(() => localStorage.getItem("jobName") || "");
  const [companyName, setCompanyName] = useState(() => localStorage.getItem("companyName") || "");
  const [isSaved, setIsSaved] = useState(() => localStorage.getItem("isSaved") === "true");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isMobile, collapsed } = useSidebar();
  const leftPadding = collapsed ? "pl-20" : "pl-64";

  useEffect(() => {
    localStorage.setItem("jobDescription", jobDescription);
    localStorage.setItem("jobName", jobName);
    localStorage.setItem("companyName", companyName);
    if (coverLetter) {
      localStorage.setItem("coverLetter", coverLetter);
    }
  }, [jobDescription, jobName, companyName, coverLetter]);

  const handleGenerateCoverLetter = async () => {
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
      setIsSaved(false);
      localStorage.setItem("isSaved", "false");
    } catch (error) {
      setError("Failed to generate cover letter and the erorr is: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
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
    } catch {
      setError("Failed to save cover letter");
    }
  };

  return (
    <div className={`w-full min-h-screen transition-all duration-300 ${isMobile ? "ml-1" : ""}  ${!isMobile && leftPadding}`}>
      <div className="max-w-7xl px-4 py-8 mx-auto flex flex-col md:flex-row gap-0 lg:gap-4 xl:gap-6">
        <div className="flex-1">
          <h1 className="text-3xl mt-4 font-bold mb-6">Cover Letter Generator</h1>
          <CoverLetterForm
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            jobName={jobName}
            setJobName={setJobName}
            companyName={companyName}
            setCompanyName={setCompanyName}
            resume={resume}
            setResume={setResume}
            onGenerate={handleGenerateCoverLetter}
            loading={loading}
          />
        </div>
        <div className="flex-1">
          <CoverLetterResult
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            onSave={handleSave}
            isSaved={isSaved}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </div>

  );
};
