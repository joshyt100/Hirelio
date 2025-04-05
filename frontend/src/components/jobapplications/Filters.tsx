import React from "react";
import { Search } from "lucide-react";
import { Input, Select, SelectItem } from "../ui";

export default function Filters({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by company, position, or location..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

