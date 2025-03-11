
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  FileText,
  Briefcase,
  Building,
  Sparkles,
  Moon,
  Sun,
  Check,
  Clock,
  Award,
  Zap,
  PenTool,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
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
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CoverAI</span>
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
              Create Perfect Cover Letters with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate tailored cover letters in seconds that match your resume and the job description. Stand out from
              the crowd and land your dream job without spending a penny.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generate">
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

          {/* Cover Letter Preview */}
          <div className="max-w-5xl mx-auto relative">
            <div className="bg-card rounded-xl shadow-xl border dark:border-zinc-900 overflow-hidden">
              <div className="bg-muted p-4 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm font-medium">CoverAI Generator</div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Input</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm h-64 overflow-hidden relative">
                    <div className="font-medium mb-2">Job Description</div>
                    <p className="text-muted-foreground line-clamp-3">
                      We are looking for a talented Software Engineer to join our team...
                    </p>
                    <div className="font-medium mt-4 mb-2">Resume</div>
                    <div className="flex items-center gap-2 text-primary">
                      <FileText className="h-4 w-4" />
                      <span>resume.pdf</span>
                    </div>
                    <div className="font-medium mt-4 mb-2">Job Details</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Company</div>
                        <div>Acme Inc.</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Position</div>
                        <div>Software Engineer</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Generated Cover Letter</h3>
                    <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      <span>AI Generated</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm h-64 overflow-hidden relative">
                    <p className="font-medium">Dear Hiring Manager,</p>
                    <p className="mt-4 text-muted-foreground">
                      I am writing to express my interest in the Software Engineer position at Acme Inc. With my
                      background in full-stack development and experience with React, Node.js, and cloud technologies, I
                      believe I would be a valuable addition to your team.
                    </p>
                    <p className="mt-4 text-muted-foreground">
                      Throughout my career, I have demonstrated a strong ability to develop scalable applications and
                      collaborate effectively with cross-functional teams...
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Generated in just 5 seconds
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-primary/5 -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CoverAI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes creating professional cover letters simple and fast
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-sm border dark:border-zinc-900 relative group hover:shadow-md transition-all">
              <div className="absolute -top-5 -left-5 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Briefcase className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enter Job Details</h3>
              <p className="text-muted-foreground">
                Paste the job description and enter the job title and company name to customize your cover letter.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Full job description analysis</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Company research integration</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Role-specific customization</span>
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
              <h3 className="text-xl font-semibold mb-3">Upload Resume</h3>
              <p className="text-muted-foreground">
                Upload your resume so we can match your skills and experience to the job requirements.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Skill matching technology</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Experience highlighting</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>PDF format support</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-sm border dark:border-zinc-900 relative group hover:shadow-md transition-all">
              <div className="absolute -top-5 -left-5 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate & Save</h3>
              <p className="text-muted-foreground">
                Our AI generates a personalized cover letter that you can edit, copy, and save for future reference.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>One-click generation</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Easy editing capabilities</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  <span>Unlimited saves</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CoverAI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to create impressive cover letters that get results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Personalization</h3>
              <p className="text-muted-foreground">
                Our AI analyzes job descriptions and your resume to create tailored cover letters that
                highlight your relevant skills and experience.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Building className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Company-Specific Content</h3>
              <p className="text-muted-foreground">
                Generate cover letters that speak directly to each company's values, culture, and job requirements for a
                more personalized approach.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Hours of Time</h3>
              <p className="text-muted-foreground">
                What would take hours to write manually takes just seconds with CoverAI, allowing you to apply to more
                jobs in less time.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Save className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Manage</h3>
              <p className="text-muted-foreground">
                Store all your cover letters in one place for easy access, editing, and future reference whenever you
                need them.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <PenTool className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Writing</h3>
              <p className="text-muted-foreground">
                Our AI is trained on successful cover letters to ensure professional language, proper formatting, and
                compelling content.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-zinc-900 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Free</h3>
              <p className="text-muted-foreground">
                Unlike other services, CoverAI is completely free to use with no hidden fees, subscriptions, or credit
                card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-primary/5 to-background -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Compare</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See why CoverAI is the smart choice for your cover letter needs
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center font-semibold">
                  <div className="bg-primary/10 rounded-lg p-4 mb-2">
                    <div className="bg-primary rounded-lg p-1.5 inline-block mb-2">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>CoverAI</div>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-full py-1 px-3 text-xs inline-block">
                    Recommended
                  </div>
                </div>
                <div className="col-span-1 text-center font-semibold">
                  <div className="bg-muted rounded-lg p-4 mb-2">
                    <div>Writing It Yourself</div>
                  </div>
                </div>
                <div className="col-span-1 text-center font-semibold">
                  <div className="bg-muted rounded-lg p-4 mb-2">
                    <div>Paid Services</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2 items-center bg-card rounded-lg p-4">
                <div className="col-span-1 font-medium">Price</div>
                <div className="col-span-1 text-center font-semibold text-primary">Free</div>
                <div className="col-span-1 text-center">Free</div>
                <div className="col-span-1 text-center">$15-$50/month</div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2 items-center bg-card rounded-lg p-4">
                <div className="col-span-1 font-medium">Time to Create</div>
                <div className="col-span-1 text-center font-semibold text-primary">Seconds</div>
                <div className="col-span-1 text-center">Hours</div>
                <div className="col-span-1 text-center">Minutes</div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2 items-center bg-card rounded-lg p-4">
                <div className="col-span-1 font-medium">Personalization</div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2 items-center bg-card rounded-lg p-4">
                <div className="col-span-1 font-medium">AI-Powered</div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
                <div className="col-span-1 text-center">
                  <div className="w-5 h-0.5 bg-muted-foreground mx-auto"></div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="w-5 h-0.5 bg-muted-foreground mx-auto"></div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2 items-center bg-card rounded-lg p-4">
                <div className="col-span-1 font-medium">Resume Analysis</div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
                <div className="col-span-1 text-center">
                  <div className="w-5 h-0.5 bg-muted-foreground mx-auto"></div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="w-5 h-0.5 bg-muted-foreground mx-auto"></div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2 items-center bg-card rounded-lg p-4">
                <div className="col-span-1 font-medium">Generous Free Usage Limits</div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
                <div className="col-span-1 text-center">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                </div>
                <div className="col-span-1 text-center">
                  <div className="w-5 h-0.5 bg-muted-foreground mx-auto"></div>
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to know about CoverAI</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is CoverAI really free?</AccordionTrigger>
                <AccordionContent>
                  Yes! CoverAI is completely free to use. We don't require a credit card, and there are no hidden fees
                  or premium tiers. We believe everyone should have access to tools that help them land their dream job.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does CoverAI create personalized cover letters?</AccordionTrigger>
                <AccordionContent>
                  CoverAI uses advanced artificial intelligence to analyze your resume and the job description. It
                  identifies relevant skills, experiences, and qualifications to create a tailored cover letter that
                  highlights your strengths for the specific position you're applying for.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I edit the generated cover letters?</AccordionTrigger>
                <AccordionContent>
                  While our AI creates high-quality cover letters, you can always edit them to add personal touches or
                  make any adjustments you'd like before saving or downloading.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  We take data security seriously. Your resume and job information are encrypted and only used to
                  generate your cover letters. We don't share your personal information with third parties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How many cover letters can I create?</AccordionTrigger>
                <AccordionContent>
                  You can create unlimited cover letters with CoverAI. There are no restrictions on how many you can
                  generate, edit, or save.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>What's next?</AccordionTrigger>
                <AccordionContent>
                  We're working on expanding this service to include resume optimizations and more advanced features. Stay tuned for updates!
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Create Your Perfect Cover Letter?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our growing community of job seekers who are using CoverAI to create professional cover letters and
              improve their job application success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generate">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full w-full sm:w-auto">
                  Start Generating Now — It's Free
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
                <span>Generous free usage</span>
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
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">CoverAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating professional cover letters with AI technology to help you land your dream job.
              </p>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CoverAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}


