import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, FileText, Briefcase, Building, Sparkles, Moon, Sun, Check, Clock, Award, Zap, PenTool, Save, BarChart2, FolderPlus, FileUp, ListChecks, LineChart, Calendar, Search, Bell } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider/theme-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-50 backdrop-blur-2xl bg-opacity-80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">HireMind</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button variant="outline" className="rounded-full">
                Log in
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button className="rounded-full">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background -z-10"></div>
        <div className="absolute top-20 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              100% Free • No Credit Card Required
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Your Complete Job Application Suite
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Track applications, generate cover letters, analyze your job search progress, and manage all your career documents in one place - completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full w-full sm:w-auto"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Get Started — It's Free
                  <ArrowRight
                    className={`ml-2 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-5xl mx-auto relative">
            <div className="bg-card rounded-xl shadow-xl border dark:border-zinc-900 overflow-hidden">
              <div className="bg-muted p-4 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm font-medium">HireMind Dashboard</div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 p-6">
                <div className="space-y-4 md:col-span-1">
                  <h3 className="font-semibold">Job Applications</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm h-64 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium">Recent Applications</div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FolderPlus className="h-4 w-4 mr-1" />
                        Add New
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-background p-3 rounded-md border">
                        <div className="flex justify-between">
                          <div className="font-medium">Software Engineer</div>
                          <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Applied</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Acme Inc.</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            <span>2 files</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Apr 2, 2025</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background p-3 rounded-md border">
                        <div className="flex justify-between">
                          <div className="font-medium">Product Manager</div>
                          <div className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">Interview</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Tech Solutions Ltd.</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            <span>3 files</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Mar 28, 2025</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Cover Letter Generator</h3>
                    <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      <span>AI Powered</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm h-64 overflow-hidden relative">
                    <div className="font-medium mb-2">Job Description</div>
                    <div className="bg-background p-2 rounded border text-xs mb-3 line-clamp-2">
                      We are looking for a talented Software Engineer to join our team...
                    </div>

                    <div className="font-medium mb-2">Attached Files</div>
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-center gap-2 bg-background p-2 rounded border text-xs">
                        <FileText className="h-3 w-3 text-primary" />
                        <span>resume.pdf</span>
                      </div>
                    </div>

                    <div className="font-medium mb-2">Generated Cover Letter</div>
                    <div className="bg-background p-2 rounded border text-xs h-20 overflow-hidden relative">
                      <p className="font-medium">Dear Hiring Manager,</p>
                      <p className="mt-1 text-muted-foreground">
                        I am writing to express my interest in the Software Engineer position at Acme Inc...
                      </p>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none"></div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-1">
                  <h3 className="font-semibold">Application Analytics</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm h-64 overflow-hidden relative">
                    <div className="flex flex-col h-full">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-background p-3 rounded-md border text-center">
                          <div className="text-2xl font-bold text-primary">12</div>
                          <div className="text-xs text-muted-foreground">Active Applications</div>
                        </div>
                        <div className="bg-background p-3 rounded-md border text-center">
                          <div className="text-2xl font-bold text-green-500">3</div>
                          <div className="text-xs text-muted-foreground">Interviews</div>
                        </div>
                      </div>

                      <div className="font-medium mb-2">Application Status</div>
                      <div className="bg-background p-3 rounded-md border mb-3 h-24">
                        <div className="flex items-end justify-between h-16 gap-1">
                          <div className="bg-primary/20 w-1/5 h-[30%] rounded-t"></div>
                          <div className="bg-primary/40 w-1/5 h-[60%] rounded-t"></div>
                          <div className="bg-primary/60 w-1/5 h-[80%] rounded-t"></div>
                          <div className="bg-primary/80 w-1/5 h-[40%] rounded-t"></div>
                          <div className="bg-primary w-1/5 h-[20%] rounded-t"></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                          <span>Applied</span>
                          <span>Offers</span>
                        </div>
                      </div>

                      <div className="font-medium mb-2">Response Rate</div>
                      <div className="bg-background p-3 rounded-md border flex items-center">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="ml-2 text-xs font-medium">35%</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              All features completely free
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-primary/5 -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How HireMind Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our all-in-one platform streamlines your entire job application process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-sm border dark:border-zinc-900 relative group hover:shadow-md transition-all">
              <div className="absolute -top-5 -left-5 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Search className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Applications</h3>
              <p className="text-muted-foreground">
                Add and organize all your job applications in one place with status tracking and reminders.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Centralized application tracking</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Status updates and reminders</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Notes and follow-up tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-sm border dark:border-zinc-900 relative group hover:shadow-md transition-all">
              <div className="absolute -top-5 -left-5 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                2
              </div>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FileText className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Cover Letters</h3>
              <p className="text-muted-foreground">
                Create tailored cover letters with AI that match your resume to each job description.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>AI-powered personalization</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Company and role customization</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>One-click generation</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-sm border dark:border-zinc-900 relative group hover:shadow-md transition-all">
              <div className="absolute -top-5 -left-5 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FileUp className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage Documents</h3>
              <p className="text-muted-foreground">
                Store and organize all your resumes, cover letters, and other job application documents.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Document version control</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Attach files to applications</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Easy access and sharing</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-sm border dark:border-zinc-900 relative group hover:shadow-md transition-all">
              <div className="absolute -top-5 -left-5 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                4
              </div>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BarChart2 className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analyze Progress</h3>
              <p className="text-muted-foreground">
                Get insights into your job search with analytics and reporting on your application progress.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Application success rates</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Interview conversion metrics</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Job search optimization tips</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-background to-background -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HireMind?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to streamline your job search and increase your chances of success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ">
            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ListChecks className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
              <p className="text-muted-foreground">
                Keep track of all your job applications in one place with status updates, deadlines, and follow-up reminders.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Cover Letter Generator</h3>
              <p className="text-muted-foreground">
                Create tailored cover letters in seconds that match your resume to each job description, highlighting your relevant skills.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <LineChart className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Search Analytics</h3>
              <p className="text-muted-foreground">
                Gain insights into your job search with detailed analytics on application success rates, response times, and interview conversions.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FolderPlus className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Management</h3>
              <p className="text-muted-foreground">
                Store and organize all your resumes, cover letters, and other job application documents in one secure location.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
              <p className="text-muted-foreground">
                Never miss a follow-up with automated reminders for application deadlines, interview preparation, and thank you notes.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Free</h3>
              <p className="text-muted-foreground">
                Unlike other services, HireMind is completely free to use with no hidden fees, subscriptions, or credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-primary/5 to-background -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                Job Application Tracker
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Never lose track of your applications again</h2>
              <p className="text-lg text-muted-foreground mb-6">
                HireMind's application tracker helps you stay organized throughout your job search. Track status updates, deadlines, and important contacts all in one place.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Centralized dashboard</span>
                    <p className="text-sm text-muted-foreground">View all your applications at a glance with status indicators</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Custom status tracking</span>
                    <p className="text-sm text-muted-foreground">Create custom application stages that match your job search workflow</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">File attachments</span>
                    <p className="text-sm text-muted-foreground">Attach resumes, cover letters, and other documents to each application</p>
                  </div>
                </li>
              </ul>

              <Link to="/tracker">
                <Button className="rounded-full">
                  Explore Job Tracker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-xl shadow-lg border dark:border-zinc-900 overflow-hidden">
              <div className="bg-muted p-4 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm font-medium">Application Tracker</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold">My Applications</h3>
                  <Button variant="outline" size="sm" className="h-8">
                    <FolderPlus className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Senior Frontend Developer</div>
                        <div className="text-sm text-muted-foreground">TechCorp Inc.</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Applied: Apr 1, 2025</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full text-xs">
                        Interview Scheduled
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded border">
                        <FileText className="h-3 w-3" />
                        <span>resume_v2.pdf</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded border">
                        <FileText className="h-3 w-3" />
                        <span>cover_letter.pdf</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">UX Designer</div>
                        <div className="text-sm text-muted-foreground">Design Studio Co.</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Applied: Mar 28, 2025</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        Applied
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded border">
                        <FileText className="h-3 w-3" />
                        <span>portfolio.pdf</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded border">
                        <FileText className="h-3 w-3" />
                        <span>design_cover.pdf</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Full Stack Developer</div>
                        <div className="text-sm text-muted-foreground">Innovate Labs</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Applied: Mar 25, 2025</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">
                        Offer Received
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded border">
                        <FileText className="h-3 w-3" />
                        <span>resume.pdf</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded border">
                        <FileText className="h-3 w-3" />
                        <span>github_portfolio.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Feature Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 via-background to-primary/5 -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <div className="bg-card rounded-xl shadow-lg border dark:border-zinc-900 overflow-hidden">
                <div className="bg-muted p-4 border-b flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm font-medium">Application Analytics</div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-muted/30 p-4 rounded-lg border text-center">
                      <div className="text-3xl font-bold text-primary">24</div>
                      <div className="text-xs text-muted-foreground">Total Applications</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border text-center">
                      <div className="text-3xl font-bold text-yellow-500">6</div>
                      <div className="text-xs text-muted-foreground">Interviews</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border text-center">
                      <div className="text-3xl font-bold text-green-500">2</div>
                      <div className="text-xs text-muted-foreground">Offers</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Application Success Rate</h4>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="h-40 flex items-end justify-between gap-2">
                        <div className="flex flex-col items-center w-1/4">
                          <div className="bg-primary/20 w-full h-[85%] rounded-t"></div>
                          <div className="text-xs mt-2">Week 1</div>
                        </div>
                        <div className="flex flex-col items-center w-1/4">
                          <div className="bg-primary/40 w-full h-[60%] rounded-t"></div>
                          <div className="text-xs mt-2">Week 2</div>
                        </div>
                        <div className="flex flex-col items-center w-1/4">
                          <div className="bg-primary/60 w-full h-[40%] rounded-t"></div>
                          <div className="text-xs mt-2">Week 3</div>
                        </div>
                        <div className="flex flex-col items-center w-1/4">
                          <div className="bg-primary/80 w-full h-[65%] rounded-t"></div>
                          <div className="text-xs mt-2">Week 4</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Response Time Analysis</h4>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tech Companies</span>
                            <span>5.2 days avg</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Startups</span>
                            <span>3.8 days avg</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Enterprise</span>
                            <span>8.5 days avg</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                Job Search Analytics
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Gain insights to optimize your job search</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Track your application performance, identify patterns, and make data-driven decisions to improve your job search strategy.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Success rate tracking</span>
                    <p className="text-sm text-muted-foreground">Monitor which applications lead to interviews and offers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Response time analysis</span>
                    <p className="text-sm text-muted-foreground">See how quickly different companies respond to your applications</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Skill gap identification</span>
                    <p className="text-sm text-muted-foreground">Identify which skills are most in-demand for your target roles</p>
                  </div>
                </li>
              </ul>

              <Link to="/analytics">
                <Button className="rounded-full">
                  Explore Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Letter Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-background -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                AI Cover Letter Generator
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Create perfect cover letters in seconds</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI analyzes job descriptions and your resume to create tailored cover letters that highlight your relevant skills and experience.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">AI-powered personalization</span>
                    <p className="text-sm text-muted-foreground">Tailored to each job description and company</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Skill matching</span>
                    <p className="text-sm text-muted-foreground">Highlights your most relevant skills for each position</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Professional formatting</span>
                    <p className="text-sm text-muted-foreground">Perfect structure and tone for any industry</p>
                  </div>
                </li>
              </ul>

              <Link to="/cover-letters">
                <Button className="rounded-full">
                  Generate Cover Letters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-xl shadow-lg border dark:border-zinc-900 overflow-hidden">
              <div className="bg-muted p-4 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm font-medium">Cover Letter Generator</div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Description</label>
                    <div className="bg-muted/30 p-3 rounded-lg border text-sm h-20 overflow-hidden relative">
                      We are seeking a talented Frontend Developer with experience in React, TypeScript, and modern web technologies. The ideal candidate will have a strong portfolio of responsive web applications and a passion for creating exceptional user experiences...
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company</label>
                      <div className="bg-muted/30 p-3 rounded-lg border text-sm">TechCorp Inc.</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Position</label>
                      <div className="bg-muted/30 p-3 rounded-lg border text-sm">Frontend Developer</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Resume</label>
                    <div className="bg-muted/30 p-3 rounded-lg border text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>resume_2025.pdf</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Generated Cover Letter</label>
                      <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Generated</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border text-sm h-40 overflow-hidden relative">
                      <p className="font-medium">Dear Hiring Manager,</p>
                      <p className="mt-3">I am writing to express my interest in the Frontend Developer position at TechCorp Inc. With over 5 years of experience in React, TypeScript, and modern web development, I am confident in my ability to contribute to your team's success.</p>
                      <p className="mt-3">My experience creating responsive, user-friendly interfaces aligns perfectly with your requirements. In my current role at InnoTech Solutions, I've led the development of several key projects that improved user engagement by 45% and reduced load times by 30%...</p>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to know about HireMind</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is HireMind really free?</AccordionTrigger>
                <AccordionContent>
                  Yes! HireMind is completely free to use. We don't require a credit card, and there are no hidden fees
                  or premium tiers. We believe everyone should have access to tools that help them land their dream job.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the job application tracker work?</AccordionTrigger>
                <AccordionContent>
                  Our job application tracker allows you to add and organize all your job applications in one place. You can track the status of each application, set reminders for follow-ups, and attach relevant documents like resumes and cover letters to each application.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I attach multiple files to my job applications?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can attach multiple files to each job application, including different versions of your resume, cover letters, portfolios, and any other relevant documents. This helps you keep all your application materials organized in one place.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How does the analytics feature help my job search?</AccordionTrigger>
                <AccordionContent>
                  Our analytics feature provides insights into your job search performance, including application success rates, response times, and interview conversion rates. This data helps you identify patterns and optimize your job search strategy for better results.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  We take data security seriously. Your resume, cover letters, and job information are encrypted and only used to provide you with our services. We don't share your personal information with third parties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How many job applications can I track?</AccordionTrigger>
                <AccordionContent>
                  You can track unlimited job applications with HireMind. There are no restrictions on how many applications you can add, documents you can upload, or cover letters you can generate.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/10 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Get Started Today
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your job search?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of job seekers who are using HireMind to organize their job search, create professional cover letters, and land their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full w-full sm:w-auto">
                  Get Started Now — It's Free
                  <Zap className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                <span>100% free</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited usage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-lg p-1.5">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">HireMind</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete job application suite with AI-powered tools to help you land your dream job.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/tracker" className="text-sm text-muted-foreground hover:text-foreground">
                    Job Application Tracker
                  </Link>
                </li>
                <li>
                  <Link to="/cover-letters" className="text-sm text-muted-foreground hover:text-foreground">
                    Cover Letter Generator
                  </Link>
                </li>
                <li>
                  <Link to="/analytics" className="text-sm text-muted-foreground hover:text-foreground">
                    Job Search Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/documents" className="text-sm text-muted-foreground hover:text-foreground">
                    Document Management
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground">
                    Career Guides
                  </Link>
                </li>
                <li>
                  <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground">
                    Resume Templates
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HireMind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
