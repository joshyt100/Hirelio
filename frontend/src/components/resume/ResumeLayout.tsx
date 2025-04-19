

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSidebar } from "@/context/SideBarContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileText, CheckCircle, AlertCircle, Info, ArrowRight, Download, Trash2, RefreshCw } from "lucide-react"
import { SolidCircleLoader } from "../loader/SolidCircleLoader"

// Mock data for resume suggestions - in a real app, this would come from an API
const mockSuggestions = [
  {
    id: 1,
    section: "Summary",
    type: "critical",
    suggestion: "Your summary is too generic. Add specific achievements and skills relevant to your target roles.",
    example:
      "Results-driven software engineer with 5+ years experience building scalable web applications, specializing in React and Node.js. Reduced load times by 40% and increased user engagement by 25% at XYZ Corp.",
  },
  {
    id: 2,
    section: "Experience",
    type: "improvement",
    suggestion: "Use more action verbs and quantify your achievements with metrics.",
    example:
      "Implemented automated testing pipeline that reduced bugs in production by 35% and deployment time by 50%.",
  },
  {
    id: 3,
    section: "Skills",
    type: "improvement",
    suggestion: "Organize skills by category and highlight the most relevant ones first.",
    example: "Frontend: React, TypeScript, CSS/SCSS, Next.js\nBackend: Node.js, Express, PostgreSQL, MongoDB",
  },
  {
    id: 4,
    section: "Education",
    type: "tip",
    suggestion: "Only include relevant coursework or projects if you're a recent graduate.",
    example:
      "B.S. Computer Science, Stanford University\nRelevant coursework: Data Structures, Algorithms, Machine Learning",
  },
  {
    id: 5,
    section: "Experience",
    type: "critical",
    suggestion: "Your job descriptions focus too much on responsibilities rather than achievements.",
    example:
      "Led a team of 5 developers to deliver a customer portal that increased self-service resolution by 45% and reduced support tickets by 30%.",
  },
]

// Type definitions
interface ResumeSuggestion {
  id: number
  section: string
  type: "critical" | "improvement" | "tip"
  suggestion: string
  example: string
}

const ResumeLayout: React.FC = () => {
  const { collapsed } = useSidebar()
  const leftPadding = collapsed ? "pl-24" : "pl-[16.5625rem]"

  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<ResumeSuggestion[]>([])
  const [filteredSuggestions, setFilteredSuggestions] = useState<ResumeSuggestion[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create a preview URL for PDF files
      if (selectedFile.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(fileUrl)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  // Simulate analyzing the resume
  const analyzeResume = async () => {
    if (!file) return

    setIsLoading(true)
    setActiveTab("analysis")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would send the file to your backend API
    // const formData = new FormData();
    // formData.append('resume', file);
    // const response = await fetch('/api/analyze-resume', { method: 'POST', body: formData });
    // const data = await response.json();
    // setSuggestions(data.suggestions);

    // Using mock data for demonstration
    setSuggestions(mockSuggestions)
    setFilteredSuggestions(mockSuggestions)
    setIsLoading(false)
  }

  // Filter suggestions by type
  const filterSuggestions = (filter: string) => {
    setActiveFilter(filter)

    if (filter === "all") {
      setFilteredSuggestions(suggestions)
    } else {
      setFilteredSuggestions(suggestions.filter((suggestion) => suggestion.type === filter))
    }
  }

  // Reset the form
  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setSuggestions([])
    setFilteredSuggestions([])
    setActiveTab("upload")
    setActiveFilter("all")

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className="min-h-screen">
      <div className={`container ${leftPadding} pr-4 pt-8 mx-auto max-w-[96rem] w-full transition-all duration-300`}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-2">Upload your resume to get personalized improvement suggestions</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!file}>
              Analysis & Suggestions
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    {!file ? (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
                        <p className="text-muted-foreground mb-4">Drag and drop or click to browse</p>
                        <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-medium mb-2">{file.name}</h3>
                        <p className="text-muted-foreground mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                          >
                            Change File
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFile(null)
                              setPreviewUrl(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={analyzeResume} disabled={!file || isLoading} className="w-full sm:w-auto">
                      {isLoading ? (
                        <>
                          <SolidCircleLoader className="mr-2 h-4 w-4" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Resume
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips for Better Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use a clean, ATS-friendly format without tables or complex layouts</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Include relevant keywords from the job descriptions you're targeting</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Quantify your achievements with specific metrics and results</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Ensure your contact information is up-to-date and professional</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Proofread for spelling and grammar errors</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="mt-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <SolidCircleLoader className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Analyzing your resume...</h3>
                <p className="text-muted-foreground">
                  This may take a minute. We're reviewing your content and formatting.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resume Preview */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Your Resume</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleReset}>
                            <RefreshCw className="h-4 w-4 mr-1" /> Reset
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0 h-[calc(100vh-300px)]">
                      {previewUrl ? (
                        <iframe src={previewUrl} className="w-full h-full rounded-b-lg" title="Resume Preview" />
                      ) : (
                        <div className="flex items-center justify-center h-full p-6 text-center">
                          <div>
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">{file ? file.name : "No preview available"}</h3>
                            <p className="text-muted-foreground">
                              {file ? "Preview not available for this file type" : "Upload a resume to see a preview"}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Suggestions */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Improvement Suggestions</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant={activeFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => filterSuggestions("all")}
                          >
                            All
                          </Button>
                          <Button
                            variant={activeFilter === "critical" ? "default" : "outline"}
                            size="sm"
                            onClick={() => filterSuggestions("critical")}
                            className={activeFilter === "critical" ? "bg-red-500 hover:bg-red-600" : ""}
                          >
                            Critical
                          </Button>
                          <Button
                            variant={activeFilter === "improvement" ? "default" : "outline"}
                            size="sm"
                            onClick={() => filterSuggestions("improvement")}
                            className={activeFilter === "improvement" ? "bg-amber-500 hover:bg-amber-600" : ""}
                          >
                            Improvements
                          </Button>
                          <Button
                            variant={activeFilter === "tip" ? "default" : "outline"}
                            size="sm"
                            onClick={() => filterSuggestions("tip")}
                            className={activeFilter === "tip" ? "bg-blue-500 hover:bg-blue-600" : ""}
                          >
                            Tips
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="p-6 space-y-6">
                          {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion) => (
                              <div key={suggestion.id} className="space-y-3">
                                <div className="flex items-start gap-3">
                                  {suggestion.type === "critical" && (
                                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                  )}
                                  {suggestion.type === "improvement" && (
                                    <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                  )}
                                  {suggestion.type === "tip" && (
                                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium">{suggestion.section}</h3>
                                      <Badge
                                        variant="outline"
                                        className={
                                          suggestion.type === "critical"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                            : suggestion.type === "improvement"
                                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                        }
                                      >
                                        {suggestion.type === "critical"
                                          ? "Critical"
                                          : suggestion.type === "improvement"
                                            ? "Improvement"
                                            : "Tip"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm mb-2">{suggestion.suggestion}</p>
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                      <p className="font-medium mb-1">Example:</p>
                                      <p className="text-muted-foreground whitespace-pre-line">{suggestion.example}</p>
                                    </div>
                                  </div>
                                </div>
                                <Separator />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
                              <p className="text-muted-foreground">
                                Try changing the filter or upload a different resume
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ResumeLayout
