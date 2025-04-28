// contact/ContactsToolbar.tsx
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactsToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  relationshipFilter: string | null;
  setRelationshipFilter: (value: string | null) => void;
  tagFilter: string | null;
  setTagFilter: (value: string | null) => void;
  relationshipOptions: { value: string; label: string }[];
  tagOptions: string[];
}

export const ContactsToolbar: React.FC<ContactsToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  relationshipFilter,
  setRelationshipFilter,
  tagFilter,
  setTagFilter,
  relationshipOptions,
  tagOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-3">
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
  );
};

