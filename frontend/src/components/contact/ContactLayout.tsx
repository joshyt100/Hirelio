import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSidebar } from "@/context/SideBarContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolidCircleLoader } from "../loader/SolidCircleLoader";
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
import { useDebounce } from "@/hooks/useDebounce";

// Helper to compute pagination range
function getPaginationRange(current: number, total: number): (number | string)[] {
  const DOTS = "...";
  const MAX = 7;
  if (total <= MAX) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(current - 1, 1);
  const right = Math.min(current + 1, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  const first = 1;
  const last = total;
  if (!showLeftDots && showRightDots) {
    return [...Array.from({ length: 4 }, (_, i) => i + 1), DOTS, last];
  }
  if (showLeftDots && !showRightDots) {
    return [first, DOTS, ...Array.from({ length: 4 }, (_, i) => total - 3 + i)];
  }
  return [first, DOTS, left, current, right, DOTS, last];
}

export default function ContactLayout() {
  const { isMobile, collapsed } = useSidebar();
  const leftPadding = isMobile
    ? "px-4"
    : collapsed
      ? "lg:pl-24 pr-2"
      : "lg:pl-[17rem]";

  // Filters & tabs
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  // Pagination state
  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Data & loading
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [prefetchedPages, setPrefetchedPages] = useState<Record<number, Contact[]>>({});

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

  // Fetch a page (with optional prefetch flag)
  const fetchPage = useCallback(
    async (page: number, prefetch = false) => {
      const params: Record<string, any> = { page, page_size: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (relationshipFilter) params.relationship = relationshipFilter;
      if (tagFilter) params.tag = tagFilter;
      if (activeTab === "favorites") params.is_favorite = true;

      if (!prefetch) setContactsLoading(true);
      try {
        const res = await fetchContactsAPI(params);
        const results = res.data.results as Contact[];
        const count = res.data.count as number;
        const pages = Math.ceil(count / PAGE_SIZE);

        if (prefetch) {
          setPrefetchedPages(prev => ({ ...prev, [page]: results }));
        } else {
          setContacts(results);
          setTotalPages(pages);
          setCurrentPage(page);
        }

        // schedule next prefetch
        if (!prefetch && page < pages) fetchPage(page + 1, true);
      } catch (err) {
        console.error(`Error fetching page ${page}`, err);
      } finally {
        if (!prefetch) setContactsLoading(false);
      }
    },
    [debouncedSearch, relationshipFilter, tagFilter, activeTab]
  );

  // Public fetchContacts uses prefetch cache
  const fetchContacts = useCallback(
    (page: number) => {
      if (prefetchedPages[page]) {
        setContacts(prefetchedPages[page]);
        setCurrentPage(page);
        window.scrollTo(0, 0);
        if (page + 1 <= totalPages && !prefetchedPages[page + 1]) {
          fetchPage(page + 1, true);
        }
      } else {
        fetchPage(page);
      }
    },
    [prefetchedPages, totalPages, fetchPage]
  );

  // Reset and load when filters change
  useEffect(() => {
    setPrefetchedPages({});
    fetchContacts(1);
  }, [debouncedSearch, relationshipFilter, tagFilter, activeTab]);

  // Scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  // Form/dialog handlers
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

  // CRUD actions
  const addContact = async (data: ContactFormData, tags: string[]) => {
    setContactsLoading(true);
    try {
      await createContactAPI(data, tags);
      setIsAddOpen(false);
      resetContactForm();
      fetchContacts(1);
    } finally {
      setContactsLoading(false);
    }
  };

  const updateContact = async (data: ContactFormData, tags: string[]) => {
    if (!currentContact) return;
    setContactsLoading(true);
    try {
      await updateContactAPI(currentContact.id, data, tags);
      setIsEditOpen(false);
      resetContactForm();
      fetchContacts(currentPage);
    } finally {
      setContactsLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm("Delete contact?")) return;
    setContactsLoading(true);
    try {
      await deleteContactAPI(id);
      const newPage = contacts.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      fetchContacts(newPage);
    } finally {
      setContactsLoading(false);
    }
  };

  const addInteraction = async (data: Omit<Interaction, "id">) => {
    if (!currentContact) return;
    setContactsLoading(true);
    try {
      await addInteractionAPI(currentContact.id, data);
      setIsInteractOpen(false);
      setInteractionForm({ date: new Date(), type: "email", notes: "" });
      fetchContacts(currentPage);
    } finally {
      setContactsLoading(false);
    }
  };

  const toggleFavorite = async (contact: Contact) => {
    try {
      await toggleFavoriteAPI(contact.id, !contact.isFavorite);
      fetchContacts(currentPage);
    } catch { }
  };

  return (
    <div className={`${leftPadding} transition-all duration-300`}>
      <div className="container mx-auto py-6 max-w-[105rem]">
        {/* Header */}
        <div className="flex mt-6 lg:mt-4 flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Network Contacts</h1>
          <Button onClick={openAdd}><UserPlus className="mr-2 w-4 h-4" /> Add Contact</Button>
        </div>

        {/* Filters */}
        <ContactsToolbar
          searchTerm={search}
          setSearchTerm={setSearch}
          relationshipFilter={relationshipFilter}
          setRelationshipFilter={setRelationshipFilter}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          relationshipOptions={relationshipOptions}
          tagOptions={tagOptions}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)} className="mb-3">
          <TabsList className="dark:bg-zinc-850">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Contacts Grid */}
        {contactsLoading && contacts.length === 0 ? <SolidCircleLoader className="w-10 h-10 mx-auto my-8" /> : (
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${contactsLoading ? 'opacity-50' : 'opacity-100'}`}>
            {contacts.length === 0 ? (
              <Card className="w-full p-12 flex flex-col items-center text-center">
                <User className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedSearch || relationshipFilter || tagFilter ? "Try adjusting your filters." : "Add your first contact."}
                </p>
                <Button onClick={openAdd}><UserPlus className="mr-2 w-4 h-4" /> Add Contact</Button>
              </Card>
            ) : contacts.map(ct => (
              <ContactCard
                key={ct.id}
                contact={ct}
                onEdit={() => openEdit(ct)}
                onLogInteraction={() => openInteract(ct)}
                onDelete={() => deleteContact(ct.id)}
                toggleFavorite={() => toggleFavorite(ct)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!contactsLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => { e.preventDefault(); if (currentPage > 1) fetchContacts(currentPage - 1); }}
                  />
                </PaginationItem>
                {paginationRange.map((p, i) => p === "..." ? (
                  <PaginationItem key={`ell-${i}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === currentPage} onClick={e => { e.preventDefault(); fetchContacts(Number(p)); }}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => { e.preventDefault(); if (currentPage < totalPages) fetchContacts(currentPage + 1); }}
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
          onTagSelect={tag => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
          onClose={() => setIsAddOpen(false)}
          onSubmit={addContact}
          actionLoading={contactsLoading}
        />
        <ContactFormDialog
          isOpen={isEditOpen}
          mode="edit"
          initialData={contactForm}
          selectedTags={selectedTags}
          onTagSelect={tag => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
          onClose={() => setIsEditOpen(false)}
          onSubmit={updateContact}
          actionLoading={contactsLoading}
        />
        <InteractionDialog
          isOpen={isInteractOpen}
          contactName={currentContact?.name || ""}
          initialData={interactionForm}
          onClose={() => setIsInteractOpen(false)}
          onSubmit={addInteraction}
          actionLoading={contactsLoading}
        />
      </div>
    </div>
  );
}

