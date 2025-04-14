// contact/ContactTypes.ts

import { Mail, Phone, Users, MessageSquare, Calendar } from "lucide-react";

export interface Interaction {
  id: string;
  date: Date;
  type: "email" | "call" | "meeting" | "message" | "other";
  notes: string;
}

export interface Contact {
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

export const relationshipOptions = [
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

export const interactionTypes = [
  { value: "email", label: "Email", icon: Mail },
  { value: "call", label: "Call", icon: Phone },
  { value: "meeting", label: "Meeting", icon: Users },
  { value: "message", label: "Message", icon: MessageSquare },
  { value: "other", label: "Other", icon: Calendar },
];

export const tagOptions = [
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

