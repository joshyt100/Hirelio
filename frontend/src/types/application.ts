
export interface Attachment {
  id: string
  name: string
  type: "resume" | "coverLetter" | "other"
  url: string
  dateAdded: Date
}

export interface JobApplication {
  id: string
  company: string
  position: string
  location: string
  status: "saved" | "applied" | "interview" | "offer" | "rejected"
  dateApplied: Date
  notes: string
  attachments: Attachment[]
  salary?: string
  contactPerson?: string
  contactEmail?: string
  url?: string
}
