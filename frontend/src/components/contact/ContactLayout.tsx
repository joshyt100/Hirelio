// contact/ContactLayout.tsx

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSidebar } from "@/context/SideBarContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardTitle } from "@/components/ui/card";
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
import {
  ContactFormDialog,
  ContactFormData,
} from "./ContactFormDialog";
import { InteractionDialog } from "./InteractionDialog";
import {
  Contact,
  Interaction,
  relationshipOptions,
  tagOptions,
} from "@/types/ContactTypes";
import { getCookie } from "@/utils/csrfUtils";

// debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debounced;
}

// pagination helper (same as jobs)
function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const DOTS = "...";
  const totalPageNumbersToShow = 7;
  if (totalPages <= totalPageNumbersToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const left = Math.max(currentPage - 1, 1);
  const right = Math.min(currentPage + 1, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;
  const first = 1,
    last = totalPages;

  if (!showLeftDots && showRightDots) {
    return [
      ...Array.from({ length: 4 }, (_, i) => i + 1),
      DOTS,
      last,
    ];
  }
  if (showLeftDots && !showRightDots) {
    return [
      first,
      DOTS,
      ...Array.from({ length: 4 }, (_, i) => totalPages - 3 + i),
    ];
  }
  return [
    first,
    DOTS,
    left,
    currentPage,
    right,
    DOTS,
    last,
  ];
}

export default function ContactLayout() {
  const { collapsed } = useSidebar();
  const leftPadding = collapsed ? "pl-24" : "pl-64";

  // filters & tabs
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  // data
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // pagination
  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // dialogs & form state
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

  const [interactionForm, setInteractionForm] =
    useState<Omit<Interaction, "id">>({
      date: new Date(),
      type: "email",
      notes: "",
    });

  // fetch function
  const fetchContacts = useCallback(
    async (page = 1) => {
      setContactsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (relationshipFilter)
          params.append("relationship", relationshipFilter);
        if (tagFilter) params.append("tag", tagFilter);
        if (activeTab === "favorites") {
          params.append("is_favorite", "true");
        }

        const res = await fetch(
          `http://127.0.0.1:8000/api/contacts/?${params.toString()}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setContacts(data.results || []);
        const count = data.count ?? data.results.length;
        setTotalPages(Math.ceil(count / PAGE_SIZE));
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching contacts", err);
      } finally {
        setContactsLoading(false);
      }
    },
    [debouncedSearch, relationshipFilter, tagFilter, activeTab]
  );

  // reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
    fetchContacts(1);
  }, [
    debouncedSearch,
    relationshipFilter,
    tagFilter,
    activeTab,
    fetchContacts,
  ]);

  // scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // pagination helpers
  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchContacts(page);
  };

  // form handlers
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

  // CRUD actions (add / update / delete / interaction)
  const addContact = async (
    data: ContactFormData,
    tags: string[]
  ) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/contacts/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ ...data, tags }),
        }
      );
      if (!res.ok) throw new Error();
      setIsAddOpen(false);
      resetContactForm();
      fetchContacts(1);
    } catch (err) {
      console.error("Add contact error", err);
    } finally {
      setActionLoading(false);
    }
  };

  const updateContact = async (
    data: ContactFormData,
    tags: string[]
  ) => {
    if (!currentContact) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/contacts/${currentContact.id}/`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ ...data, tags }),
        }
      );
      if (!res.ok) throw new Error();
      setIsEditOpen(false);
      resetContactForm();
      fetchContacts(currentPage);
    } catch (err) {
      console.error("Update contact error", err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete contact?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/contacts/${id}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      if (!res.ok) throw new Error();
      // if last item on page, go back one
      const newPage =
        contacts.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      fetchContacts(newPage);
    } catch (err) {
      console.error("Delete contact error", err);
    } finally {
      setActionLoading(false);
    }
  };

  const addInteraction = async (data: Omit<Interaction, "id">) => {
    if (!currentContact) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/contacts/${currentContact.id}/interactions/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error();
      setIsInteractOpen(false);
      setInteractionForm({
        date: new Date(),
        type: "email",
        notes: "",
      });
      fetchContacts(currentPage);
    } catch (err) {
      console.error("Add interaction error", err);
    } finally {
      setActionLoading(false);
    }
  };

  // dialog openers
  const openAdd = () => {
    resetContactForm();
    setIsAddOpen(true);
  };
  const openEdit = (c: Contact) => {
    setCurrentContact(c);
    setContactForm({
      name: c.name,
      email: c.email,
      phone: c.phone ?? "",
      company: c.company ?? "",
      position: c.position ?? "",
      relationship: c.relationship,
      notes: c.notes ?? "",
      lastContacted: c.lastContacted,
      nextFollowUp: c.nextFollowUp,
      linkedinUrl: c.linkedinUrl ?? "",
      twitterUrl: c.twitterUrl ?? "",
    });
    setSelectedTags(c.tags);
    setIsEditOpen(true);
  };
  const openInteract = (c: Contact) => {
    setCurrentContact(c);
    setIsInteractOpen(true);
  };

  return (
    <div className={`${leftPadding} transition-all duration-300 `}>
      <div className="container mx-auto pl-8 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Network Contacts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your professional connections
            </p>
          </div>
          <Button onClick={openAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
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
          onValueChange={(v) =>
            setActiveTab(v as "all" | "favorites")
          }
          className="mb-6"
        >
          <TabsList className="dark:bg-zinc-850">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Grid + Loader */}
        <div className="relative">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity duration-300 ${contactsLoading ? "opacity-50" : "opacity-100"
              }`}
          >
            {!contactsLoading && contacts.length === 0 ? (
              <Card className="w-full p-12 flex flex-col items-center text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No contacts found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedSearch ||
                    relationshipFilter ||
                    tagFilter
                    ? "Try adjusting your filters."
                    : "Add your first contact."}
                </p>
                <Button onClick={openAdd}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </Card>
            ) : (
              contacts.map((c) => (
                <ContactCard
                  key={c.id}
                  contact={c}
                  onEdit={() => openEdit(c)}
                  onLogInteraction={() =>
                    openInteract(c)
                  }
                  onDelete={() => deleteContact(c.id)}
                  toggleFavorite={() => {
                    /* you can implement UI toggle here */
                  }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1)
                        goToPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {paginationRange.map((p, i) =>
                  p === "..." ? (
                    <PaginationItem key={`dot-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(
                            Number(p)
                          );
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        goToPage(currentPage + 1);
                    }}
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
          onTagSelect={(t) =>
            setSelectedTags((prev) =>
              prev.includes(t)
                ? prev.filter((x) => x !== t)
                : [...prev, t]
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
          onTagSelect={(t) =>
            setSelectedTags((prev) =>
              prev.includes(t)
                ? prev.filter((x) => x !== t)
                : [...prev, t]
            )
          }
          onClose={() => setIsEditOpen(false)}
          onSubmit={updateContact}
          actionLoading={actionLoading}
        />

        <InteractionDialog
          isOpen={isInteractOpen}
          contactName={currentContact?.name ?? ""}
          initialData={interactionForm}
          onClose={() => setIsInteractOpen(false)}
          onSubmit={addInteraction}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}

