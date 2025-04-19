
import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, FileText, Briefcase, Building } from "lucide-react"
import { useState } from "react"

interface CoverLetterFormProps {
  jobDescription: string
  setJobDescription: (value: string) => void
  jobName: string
  setJobName: (value: string) => void
  companyName: string
  setCompanyName: (value: string) => void
  resume: File | null
  setResume: (file: File | null) => void
  onGenerate: () => void
  loading: boolean
}

export const CoverLetterForm = ({
  jobDescription,
  setJobDescription,
  jobName,
  setJobName,
  companyName,
  setCompanyName,
  resume,
  setResume,
  onGenerate,
  loading,
}: CoverLetterFormProps) => {
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setResume(file)
    setFileName(file?.name || "")
  }

  return (
    <Card className=" w-full  border dark:border-zinc-700 ">
      <CardHeader className="pb-4 border-b  dark:border-zinc-700">
        <CardTitle className="flex items-center text-2xl">
          <FileText className="mr-2 h-6 w-6 text-primary " />
          Job Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="job-name" className="text-sm font-medium flex items-center">
              <Briefcase className="mr-2 h-4 w-4 " />
              Job Title
            </Label>
            <Input
              id="job-name"
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="w-full "
              placeholder="Software Engineer, Product Manager, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-sm font-medium flex items-center">
              <Building className="mr-2 h-4 w-4 " />
              Company Name
            </Label>
            <Input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description" className="text-sm font-medium">
              Job Description
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full min-h-[25rem]  resize-none"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Include the full job description for the best results
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm font-medium flex items-center">
              <FileUp className="mr-2 h-4 w-4 " />
              Upload Resume (PDF)
            </Label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="resume"
                className="relative cursor-pointer bg-zinc-100 dark:bg-zinc-800 rounded-md font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-zinc-500 dark:focus-within:ring-zinc-400 flex-1"
              >
                <div className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center">
                  <span>{fileName || "Select PDF file"}</span>
                  <Input id="resume" type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />
                </div>
              </label>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Your resume will be used to personalize your cover letter
            </p>
          </div>

          <Button
            onClick={onGenerate}
            disabled={loading}
            className="w-full py-3 text-base font-medium "
            size="lg"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Cover Letter...
              </>
            ) : (
              "Generate Cover Letter"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

