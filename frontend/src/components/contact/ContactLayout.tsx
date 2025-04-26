// contact/ContactLayout.tsx

// src/components/contact/ContactLayout.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSidebar } from "@/context/SideBarContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserPlus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { SolidCircleLoader } from "../loader/SolidCircleLoader";

import { ContactsToolbar } from "./ContactsToolbar";
import { ContactCard } from "./ContactCard";
import { ContactFormDialog, ContactFormData } from "./ContactFormDialog";
import { InteractionDialog } from "./InteractionDialog";
import { Contact, Interaction, relationshipOptions, tagOptions } from "@/types/ContactTypes";
import {
  fetchContactsAPI,
  createContactAPI,
  updateContactAPI,
  deleteContactAPI,
  addInteractionAPI,
  toggleFavoriteAPI,
} from "@/api/contacts";
//import custom hook
import { useDebounce } from "@/hooks/useDebounce";


// Pagination helper
function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  const DOTS = "...";
  const MAX_DISPLAY = 7;
  if (totalPages <= MAX_DISPLAY) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const left = Math.max(currentPage - 1, 1);
  const right = Math.min(currentPage + 1, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;
  const first = 1;
  const last = totalPages;
  if (!showLeftDots && showRightDots) {
    return [...Array.from({ length: 4 }, (_, i) => i + 1), DOTS, last];
  }
  if (showLeftDots && !showRightDots) {
    return [first, DOTS, ...Array.from({ length: 4 }, (_, i) => totalPages - 3 + i)];
  }
  return [first, DOTS, left, currentPage, right, DOTS, last];
}

export default function ContactLayout() {
  const { isMobile, collapsed } = useSidebar();
  const leftPaddingClass = isMobile
    ? "px-4"
    : collapsed
      ? "lg:pl-32"
      : "lg:pl-[17rem]";

  // Filters & tabs
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  // Data & loading state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog & form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInteractOpen, setIsInteractOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  const [contactForm, setContactForm] = useState<ContactFormData>({
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

  const [interactionForm, setInteractionForm] = useState<Omit<Interaction, "id">>({
    date: new Date(),
    type: "email",
    notes: "",
  });

  // Fetch contacts from API
  const fetchContacts = useCallback(
    async (page = 1) => {
      setContactsLoading(true);
      try {
        const params: Record<string, any> = { page, page_size: PAGE_SIZE };
        if (debouncedSearch) params.search = debouncedSearch;
        if (relationshipFilter) params.relationship = relationshipFilter;
        if (tagFilter) params.tag = tagFilter;
        if (activeTab === "favorites") params.is_favorite = true;

        const res = await fetchContactsAPI(params);
        setContacts(res.data.results);
        setTotalPages(Math.ceil(res.data.count / PAGE_SIZE));
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching contacts", error);
      } finally {
        setContactsLoading(false);
      }
    },
    [debouncedSearch, relationshipFilter, tagFilter, activeTab]
  );

  // Load on mount and filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchContacts(1);
  }, [debouncedSearch, relationshipFilter, tagFilter, activeTab]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchContacts(page);
  };

  // Reset form
  const resetContactForm = () => {
    setContactForm({
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
    setCurrentContact(null);
  };

  // CRUD actions
  const addContact = async (data: ContactFormData, tags: string[]) => {
    setActionLoading(true);
    try {
      await createContactAPI(data, tags);
      setIsAddOpen(false);
      resetContactForm();
      fetchContacts(1);
    } catch (error) {
      console.error("Add contact error", error);
    } finally {
      setActionLoading(false);
    }
  };

  const updateContact = async (data: ContactFormData, tags: string[]) => {
    if (!currentContact) return;
    setActionLoading(true);
    try {
      await updateContactAPI(currentContact.id, data, tags);
      setIsEditOpen(false);
      resetContactForm();
      fetchContacts(currentPage);
    } catch (error) {
      console.error("Update contact error", error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm("Delete contact?")) return;
    setActionLoading(true);
    try {
      await deleteContactAPI(id);
      const newPage = contacts.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      fetchContacts(newPage);
    } catch (error) {
      console.error("Delete contact error", error);
    } finally {
      setActionLoading(false);
    }
  };

  const addInteraction = async (data: Omit<Interaction, "id">) => {
    if (!currentContact) return;
    setActionLoading(true);
    try {
      await addInteractionAPI(currentContact.id, data);
      setIsInteractOpen(false);
      setInteractionForm({ date: new Date(), type: "email", notes: "" });
      fetchContacts(currentPage);
    } catch (error) {
      console.error("Add interaction error", error);
    } finally {
      setActionLoading(false);
    }
  };

  const onToggleFavorite = async (contact: Contact) => {
    try {
      await toggleFavoriteAPI(contact.id, !contact.isFavorite);
      fetchContacts(currentPage);
    } catch (error) {
      console.error("Toggle favorite error", error);
    }
  };

  // Dialog openers
  const openAdd = () => { resetContactForm(); setIsAddOpen(true); };
  const openEdit = (contact: Contact) => {
    setCurrentContact(contact);
    setContactForm({
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
    setIsEditOpen(true);
  };
  const openInteract = (contact: Contact) => { setCurrentContact(contact); setIsInteractOpen(true); };

  return (
    <div className={`${leftPaddingClass} transition-all duration-300`}>
      <div className="container mx-auto py-6 max-w-7xl 2xl:max-w-[100rem]">
        {/* Header */}
        <div className="flex mt-6 flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Network Contacts</h1>
            <p className="text-muted-foreground mt-1">Manage your professional connections</p>
          </div>
          <Button onClick={openAdd}>
            <UserPlus className="mr-2 h-4 w-4" />Add Contact
          </Button>
        </div>

        {/* Filters */}
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

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "all" | "favorites")}
          className="mb-6"
        >
          <TabsList className="dark:bg-zinc-850">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Grid & Loader */}
        <div className="relative">
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity duration-300 ${contactsLoading ? "opacity-50" : "opacity-100"
            }`}
          >
            {!contactsLoading && contacts.length === 0 ? (
              <Card className="w-full p-12 flex flex-col items-center text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedSearch || relationshipFilter || tagFilter
                    ? "Try adjusting your filters."
                    : "Add your first contact."}
                </p>
                <Button onClick={openAdd}>
                  <UserPlus className="mr-2 h-4 w-4" />Add Contact
                </Button>
              </Card>
            ) : (
              contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={() => openEdit(contact)}
                  onLogInteraction={() => openInteract(contact)}
                  onDelete={() => deleteContact(contact.id)}
                  toggleFavorite={() => onToggleFavorite(contact)}
                />
              ))
            )}
          </div>
          {contactsLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <SolidCircleLoader className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Pagination */}
        {!contactsLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) goToPage(currentPage - 1); }}
                  />
                </PaginationItem>
                {paginationRange.map((page, idx) => (
                  page === "..." ? (
                    <PaginationItem key={`ellipsis-${idx}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => { e.preventDefault(); goToPage(Number(page)); }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) goToPage(currentPage + 1); }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Dialogs */}
        <ContactFormDialog
          isOpen={isAddOpen}
          mode="add"
          initialData={contactForm}
          selectedTags={selectedTags}
          onTagSelect={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            )
          }
          onClose={() => setIsAddOpen(false)}
          onSubmit={addContact}
          actionLoading={actionLoading}
        />
        <ContactFormDialog
          isOpen={isEditOpen}
          mode="edit"
          initialData={contactForm}
          selectedTags={selectedTags}
          onTagSelect={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            )
          }
          onClose={() => setIsEditOpen(false)}
          onSubmit={updateContact}
          actionLoading={actionLoading}
        />
        <InteractionDialog
          isOpen={isInteractOpen}
          contactName={currentContact?.name || ""}
          initialData={interactionForm}
          onClose={() => setIsInteractOpen(false)}
          onSubmit={addInteraction}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}
