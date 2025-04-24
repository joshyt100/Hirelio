"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Lock, Bell, Shield, LogOut, Edit, Upload, Save } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
// import { toast } from "@/components/ui/use-toast"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  jobTitle: string
  location: string
  website: string
}

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate()
  const { isMobile, collapsed } = useSidebar()
  const leftPaddingClass = collapsed ? "lg:pl-32" : "lg:pl-[17rem]"

  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    bio: "Experienced software developer with a passion for creating user-friendly applications. Currently seeking new opportunities in frontend development.",
    jobTitle: "Senior Frontend Developer",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    applicationUpdates: true,
    newFeatures: false,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    activityAlerts: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSecurityChange = (key: keyof typeof securitySettings) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
    }, 1000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    // Simulate logout
    setTimeout(() => navigate("/login"), 1500)
  }

  return (
    <div className="min-h-screen">
      <div
        className={`container ${!isMobile && leftPaddingClass} ${isMobile ? "px-4" : ""} pr-4 pt-8 mx-auto max-w-[96rem] w-full transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-3xl mt-4 font-bold bg-clip-text">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>
          <Button variant="destructive" className="mt-4 sm:mt-0" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={profileImage || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {profileData.firstName.charAt(0)}
                    {profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <label htmlFor="profile-image" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                        <Edit className="h-4 w-4" />
                      </div>
                      <input
                        id="profile-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-muted-foreground">{profileData.jobTitle}</p>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={loading}>
                        {loading ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p>{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p>{profileData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p>{profileData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profileData.website}
                    </a>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex gap-2 mt-4">
                    <Badge variant="outline" className="bg-primary/10">
                      React
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      TypeScript
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Next.js
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      UI/UX
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different settings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="dark:bg-zinc-850 mb-6">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab Content */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={profileData.jobTitle}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                {isEditing && (
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resume & Skills</CardTitle>
                <CardDescription>Manage your resume and professional skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Current Resume</h4>
                      <p className="text-sm text-muted-foreground">resume-alex-johnson-2023.pdf</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/10">
                        React
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        TypeScript
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        Next.js
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        UI/UX
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        JavaScript
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        HTML/CSS
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        Redux
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10">
                        Node.js
                      </Badge>
                      {isEditing && (
                        <Button variant="outline" size="sm" className="h-6">
                          <span className="text-xs">+ Add Skill</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab Content */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityChange("twoFactorAuth")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                  </div>
                  <Switch
                    id="session-timeout"
                    checked={securitySettings.sessionTimeout}
                    onCheckedChange={() => handleSecurityChange("sessionTimeout")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activity-alerts">Login Activity Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for new login attempts</p>
                  </div>
                  <Switch
                    id="activity-alerts"
                    checked={securitySettings.activityAlerts}
                    onCheckedChange={() => handleSecurityChange("activityAlerts")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab Content */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage how and when you receive email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive important account alerts via email</p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notifications.emailAlerts}
                    onCheckedChange={() => handleNotificationChange("emailAlerts")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="application-updates">Application Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your job applications change status
                    </p>
                  </div>
                  <Switch
                    id="application-updates"
                    checked={notifications.applicationUpdates}
                    onCheckedChange={() => handleNotificationChange("applicationUpdates")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-features">New Features</Label>
                    <p className="text-sm text-muted-foreground">Stay updated on new features and improvements</p>
                  </div>
                  <Switch
                    id="new-features"
                    checked={notifications.newFeatures}
                    onCheckedChange={() => handleNotificationChange("newFeatures")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional content and special offers</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={() => handleNotificationChange("marketingEmails")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab Content */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control how your information is used and shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <p className="text-sm text-muted-foreground mb-4">Control who can see your profile information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="public" name="visibility" className="h-4 w-4" defaultChecked />
                        <Label htmlFor="public">Public</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="private" name="visibility" className="h-4 w-4" />
                        <Label htmlFor="private">Private</Label>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium">Data Usage</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage how your data is used to improve our services
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="analytics">Analytics & Improvements</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to use your data to improve our services
                          </p>
                        </div>
                        <Switch id="analytics" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="personalization">Personalization</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to personalize your experience based on your activity
                          </p>
                        </div>
                        <Switch id="personalization" defaultChecked />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium">Account Actions</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage your account data and settings</p>
                    <div className="space-y-4">
                      <Button variant="outline">Download My Data</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfileLayout

