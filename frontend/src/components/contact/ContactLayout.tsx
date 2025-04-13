import React, { useState, useEffect } from "react";
import { useSidebar } from '@/context/SideBarContext';
import {
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Star,
  StarOff,
  LinkedinIcon,
  Twitter,
  MessageSquare,
  Clock,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  relationship: string;
  notes?: string;
  lastContacted?: Date;
  nextFollowUp?: Date;
  linkedinUrl?: string;
  twitterUrl?: string;
  isFavorite: boolean;
  tags: string[];
  interactions: Interaction[];
  avatar?: string;
}

interface Interaction {
  id: string;
  date: Date;
  type: "email" | "call" | "meeting" | "message" | "other";
  notes: string;
}

// Options for relationship, interaction types, and tags.
const relationshipOptions = [
  { value: "former-colleague", label: "Former Colleague" },
  { value: "current-colleague", label: "Current Colleague" },
  { value: "classmate", label: "Classmate" },
  { value: "friend", label: "Friend" },
  { value: "mentor", label: "Mentor" },
  { value: "recruiter", label: "Recruiter" },
  { value: "manager", label: "Manager" },
  { value: "industry-contact", label: "Industry Contact" },
  { value: "other", label: "Other" },
];

const interactionTypes = [
  { value: "email", label: "Email", icon: Mail },
  { value: "call", label: "Call", icon: Phone },
  { value: "meeting", label: "Meeting", icon: Users },
  { value: "message", label: "Message", icon: MessageSquare },
  { value: "other", label: "Other", icon: Calendar },
];

const tagOptions = [
  "tech",
  "engineering",
  "design",
  "product",
  "marketing",
  "recruiter",
  "hiring",
  "mentor",
  "referral",
  "startup",
  "enterprise",
  "technical",
  "management",
  "networking",
];

// Helper to read csrf token from cookies
const getCSRFToken = (): string => {
  let csrfToken = "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) {
    csrfToken = parts.pop()?.split(";").shift() || "";
  }
  return csrfToken;
};

export default function ContactLayout() {
  // State declarations
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newInteraction, setNewInteraction] = useState<Omit<Interaction, "id">>({
    date: new Date(),
    type: "email",
    notes: "",
  });

  const [formData, setFormData] = useState<Omit<Contact, "id" | "interactions" | "isFavorite" | "tags">>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    relationship: "industry-contact",
    notes: "",
    lastContacted: undefined,
    nextFollowUp: undefined,
    linkedinUrl: "",
    twitterUrl: "",
  });

  // Fetch contacts from the backend on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // handle sidebar toggle
  const { collapsed } = useSidebar();
  const leftPadding = collapsed ? "pl-24" : "pl-64";

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      // Assuming your paginated response returns { results: [...] }
      setContacts(data.results || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRelationshipChange = (value: string) => {
    setFormData((prev) => ({ ...prev, relationship: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "lastContacted" | "nextFollowUp") => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value ? new Date(e.target.value) : undefined }));
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleInteractionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInteraction((prev) => ({ ...prev, [name]: value }));
  };

  const handleInteractionTypeChange = (value: string) => {
    setNewInteraction((prev) => ({ ...prev, type: value as Interaction["type"] }));
  };

  const handleInteractionDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInteraction((prev) => ({ ...prev, date: new Date(e.target.value) }));
  };

  // CRUD operations using endpoints

  const addContact = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ ...formData, tags: selectedTags }),
      });
      if (!response.ok) {
        throw new Error("Error creating contact");
      }
      const newContact = await response.json();
      setContacts((prev) => [newContact, ...prev]);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Add contact error:", error);
    }
  };

  const updateContact = async () => {
    if (!currentContact) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${currentContact.id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ ...formData, tags: selectedTags }),
      });
      if (!response.ok) {
        throw new Error("Error updating contact");
      }
      const updatedContact = await response.json();
      setContacts((prev) =>
        prev.map((contact) => (contact.id === currentContact.id ? updatedContact : contact))
      );
      resetForm();
      setIsEditDialogOpen(false);
      setCurrentContact(null);
    } catch (error) {
      console.error("Update contact error:", error);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
      if (!response.ok) {
        throw new Error("Error deleting contact");
      }
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Delete contact error:", error);
    }
  };

  const addInteraction = async () => {
    if (!currentContact) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/contacts/${currentContact.id}/interactions/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify(newInteraction),
        }
      );
      if (!response.ok) {
        throw new Error("Error creating interaction");
      }
      const interaction = await response.json();
      const updatedContact = {
        ...currentContact,
        interactions: [interaction, ...currentContact.interactions],
        lastContacted: new Date(),
      };
      setContacts((prev) =>
        prev.map((contact) => (contact.id === currentContact.id ? updatedContact : contact))
      );
      setNewInteraction({ date: new Date(), type: "email", notes: "" });
      setIsInteractionDialogOpen(false);
    } catch (error) {
      console.error("Add interaction error:", error);
    }
  };

  // Local helper to reset the form state
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      relationship: "industry-contact",
      notes: "",
      lastContacted: undefined,
      nextFollowUp: undefined,
      linkedinUrl: "",
      twitterUrl: "",
    });
    setSelectedTags([]);
  };

  // Utility functions
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatDateForInput = (date?: Date) => (date ? new Date(date).toISOString().split("T")[0] : "");

  const getRelationshipLabel = (value: string) =>
    relationshipOptions.find((opt) => opt.value === value)?.label || "Unknown";

  const getInteractionTypeIcon = (type: string) => {
    const interactionType = interactionTypes.find((t) => t.value === type);
    const Icon = interactionType?.icon || Calendar;
    return <Icon className="h-4 w-4" />;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getTimeAgo = (date?: Date) => {
    if (!date) return "";
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Filter contacts based on search, relationship and tags
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.position && contact.position.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRelationship = relationshipFilter ? contact.relationship === relationshipFilter : true;
    const matchesTag = tagFilter ? contact.tags.includes(tagFilter) : true;
    const matchesFavorite = activeTab === "favorites" ? contact.isFavorite : true;
    const matchesTab = activeTab === "all" || activeTab === "favorites" ? true : false;
    return matchesSearch && matchesRelationship && matchesTag && matchesFavorite && matchesTab;
  });

  return (
    <div className={`${leftPadding} transition-all duration-300 p-4`}>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold">Network Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your professional connections and referral sources
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, company..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select onValueChange={(value) => setRelationshipFilter(value === "all-relationships" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-relationships">All Relationships</SelectItem>
                {relationshipOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setTagFilter(value === "all-tags" ? null : value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tags">All Tags</SelectItem>
                {tagOptions.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="dark:bg-zinc-850">
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {filteredContacts.length === 0 ? (
            <Card className="w-full p-12 flex flex-col items-center justify-center text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || relationshipFilter || tagFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start by adding your first contact to your network."}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {contact.name}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => toggleFavorite(contact.id)}
                            >
                              {contact.isFavorite ? (
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                              </span>
                            </Button>
                          </CardTitle>
                          <CardDescription className="flex flex-col gap-1 mt-1">
                            <span className="flex items-center">
                              <Mail className="h-3.5 w-3.5 mr-1.5" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="flex items-center">
                                <Phone className="h-3.5 w-3.5 mr-1.5" />
                                {contact.phone}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => editContact(contact)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAddInteractionDialog(contact)}>
                            <MessageSquare className="h-4 w-4 mr-2" /> Log Interaction
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteContact(contact.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      {(contact.company || contact.position) && (
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>
                            {contact.position}
                            {contact.position && contact.company && " at "}
                            {contact.company}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span>{getRelationshipLabel(contact.relationship)}</span>
                      </div>
                      {contact.lastContacted && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>Last contacted: {getTimeAgo(contact.lastContacted)}</span>
                        </div>
                      )}
                      {contact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {contact.notes && (
                        <div className="mt-3 text-sm">
                          <p className="line-clamp-2">{contact.notes}</p>
                        </div>
                      )}
                      {contact.interactions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Recent Interactions</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                            {contact.interactions.slice(0, 3).map((interaction) => (
                              <div
                                key={interaction.id}
                                className="flex gap-2 text-sm border-l-2 border-muted pl-3 py-1"
                              >
                                <div className="flex-shrink-0 mt-0.5">{getInteractionTypeIcon(interaction.type)}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <span className="font-medium capitalize">{interaction.type}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(new Date(interaction.date))}
                                    </span>
                                  </div>
                                  <p className="text-xs mt-1 line-clamp-2">{interaction.notes}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editContact(contact)}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openAddInteractionDialog(contact)}>
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Log Interaction
                      </Button>
                      {contact.linkedinUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(contact.linkedinUrl, "_blank")}
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {contact.twitterUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(contact.twitterUrl, "_blank")}
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Contact Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new professional contact to your network for potential referrals and opportunities.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="555-123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select value={formData.relationship} onValueChange={handleRelationshipChange}>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <SelectTrigger id="relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position (Optional)</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Job title"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastContacted">Last Contacted (Optional)</Label>
                  <Input
                    id="lastContacted"
                    name="lastContacted"
                    type="date"
                    value={formatDateForInput(formData.lastContacted)}
                    onChange={(e) => handleDateChange(e, "lastContacted")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextFollowUp">Next Follow-up (Optional)</Label>
                  <Input
                    id="nextFollowUp"
                    name="nextFollowUp"
                    type="date"
                    value={formatDateForInput(formData.nextFollowUp)}
                    onChange={(e) => handleDateChange(e, "nextFollowUp")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter URL (Optional)</Label>
                  <Input
                    id="twitterUrl"
                    name="twitterUrl"
                    placeholder="https://twitter.com/username"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes about this contact"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addContact}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>Update the details of your contact.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone (Optional)</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    placeholder="555-123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-relationship">Relationship</Label>
                  <Select value={formData.relationship} onValueChange={handleRelationshipChange}>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <SelectTrigger id="edit-relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company (Optional)</Label>
                  <Input
                    id="edit-company"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position (Optional)</Label>
                  <Input
                    id="edit-position"
                    name="position"
                    placeholder="Job title"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lastContacted">Last Contacted (Optional)</Label>
                  <Input
                    id="edit-lastContacted"
                    name="lastContacted"
                    type="date"
                    value={formatDateForInput(formData.lastContacted)}
                    onChange={(e) => handleDateChange(e, "lastContacted")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nextFollowUp">Next Follow-up (Optional)</Label>
                  <Input
                    id="edit-nextFollowUp"
                    name="nextFollowUp"
                    type="date"
                    value={formatDateForInput(formData.nextFollowUp)}
                    onChange={(e) => handleDateChange(e, "nextFollowUp")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-linkedinUrl">LinkedIn URL (Optional)</Label>
                  <Input
                    id="edit-linkedinUrl"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-twitterUrl">Twitter URL (Optional)</Label>
                  <Input
                    id="edit-twitterUrl"
                    name="twitterUrl"
                    placeholder="https://twitter.com/username"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  placeholder="Add any notes about this contact"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateContact}>Update Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Interaction Dialog */}
        <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>Log Interaction</DialogTitle>
              <DialogDescription>Record a new interaction with {currentContact?.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interaction-type">Interaction Type</Label>
                  <Select value={newInteraction.type} onValueChange={handleInteractionTypeChange}>
                    <SelectContent>
                      {interactionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <SelectTrigger id="interaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interaction-date">Date</Label>
                  <Input
                    id="interaction-date"
                    name="date"
                    type="date"
                    value={formatDateForInput(newInteraction.date)}
                    onChange={handleInteractionDateChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interaction-notes">Notes</Label>
                <Textarea
                  id="interaction-notes"
                  name="notes"
                  placeholder="What did you discuss? Any action items?"
                  value={newInteraction.notes}
                  onChange={handleInteractionInputChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInteractionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addInteraction}>Save Interaction</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

