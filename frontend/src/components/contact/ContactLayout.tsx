// contact/ContactLayout.tsx
import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SideBarContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { User, UserPlus } from "lucide-react";
import { Contact, Interaction } from "@/types/ContactTypes";
import { ContactsToolbar } from "./ContactsToolbar";
import { ContactCard } from "./ContactCard";
import { ContactFormDialog, ContactFormData } from "./ContactFormDialog";
import { InteractionDialog } from "./InteractionDialog";

import { relationshipOptions, tagOptions } from "@/types/ContactTypes";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  const [contactFormData, setContactFormData] = useState<ContactFormData>({
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [interactionFormData, setInteractionFormData] = useState<Omit<Interaction, "id">>({
    date: new Date(),
    type: "email",
    notes: "",
  });

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Sidebar handling
  const { collapsed } = useSidebar();
  const leftPadding = collapsed ? "pl-24" : "pl-64";

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      // Assume response returns { results: [...] }
      setContacts(data.results || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // CRUD Operations
  const addContact = async (data: ContactFormData, tags: string[]) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ ...data, tags }),
      });
      if (!response.ok) throw new Error("Error creating contact");
      const newContact = await response.json();
      setContacts((prev) => [newContact, ...prev]);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Add contact error:", error);
    }
  };

  const updateContact = async (data: ContactFormData, tags: string[]) => {
    if (!currentContact) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${currentContact.id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ ...data, tags }),
      });
      if (!response.ok) throw new Error("Error updating contact");
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
      if (!response.ok) throw new Error("Error deleting contact");
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Delete contact error:", error);
    }
  };

  const addInteraction = async (data: Omit<Interaction, "id">) => {
    if (!currentContact) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${currentContact.id}/interactions/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error creating interaction");
      const interaction = await response.json();
      const updatedContact = {
        ...currentContact,
        interactions: [interaction, ...currentContact.interactions],
        lastContacted: new Date(),
      };
      setContacts((prev) =>
        prev.map((contact) => (contact.id === currentContact.id ? updatedContact : contact))
      );
      setInteractionFormData({ date: new Date(), type: "email", notes: "" });
      setIsInteractionDialogOpen(false);
    } catch (error) {
      console.error("Add interaction error:", error);
    }
  };

  // Helper function to reset the contact form
  const resetForm = () => {
    setContactFormData({
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

  // Utility: filter contacts based on search/filters/tabs
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.position && contact.position.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRelationship = relationshipFilter ? contact.relationship === relationshipFilter : true;
    const matchesTag = tagFilter ? contact.tags.includes(tagFilter) : true;
    const matchesFavorite = activeTab === "favorites" ? contact.isFavorite : true;
    // For tabs "all" and "favorites"
    return matchesSearch && matchesRelationship && matchesTag && matchesFavorite;
  });

  // Functions to handle dialogs from a child (ContactCard)
  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    // Set form data from the contact’s data for editing
    setContactFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
      position: contact.position || "",
      relationship: contact.relationship,
      notes: contact.notes || "",
      lastContacted: contact.lastContacted,
      nextFollowUp: contact.nextFollowUp,
      linkedinUrl: contact.linkedinUrl || "",
      twitterUrl: contact.twitterUrl || "",
    });
    setSelectedTags(contact.tags);
    setIsEditDialogOpen(true);
  };

  const handleOpenInteractionDialog = (contact: Contact) => {
    setCurrentContact(contact);
    setIsInteractionDialogOpen(true);
  };

  // Dummy toggleFavorite handler (implement your own logic if needed)
  const toggleFavorite = (id: string) => {
    setContacts((prev) =>
      prev.map((contact) => (contact.id === id ? { ...contact, isFavorite: !contact.isFavorite } : contact))
    );
  };

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

        <ContactsToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          relationshipFilter={relationshipFilter}
          setRelationshipFilter={setRelationshipFilter}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          relationshipOptions={relationshipOptions}
          tagOptions={tagOptions}
        />

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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onLogInteraction={handleOpenInteractionDialog}
                  onDelete={deleteContact}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Contact Dialog */}
        <ContactFormDialog
          isOpen={isAddDialogOpen}
          mode="add"
          initialData={contactFormData}
          selectedTags={selectedTags}
          onTagSelect={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            )
          }
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={addContact}
        />

        {/* Edit Contact Dialog */}
        <ContactFormDialog
          isOpen={isEditDialogOpen}
          mode="edit"
          initialData={contactFormData}
          selectedTags={selectedTags}
          onTagSelect={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            )
          }
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={updateContact}
        />

        {/* Interaction Dialog */}
        <InteractionDialog
          isOpen={isInteractionDialogOpen}
          contactName={currentContact?.name || ""}
          initialData={interactionFormData}
          onClose={() => setIsInteractionDialogOpen(false)}
          onSubmit={addInteraction}
        />
      </div>
    </div>
  );
}

