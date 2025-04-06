import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CoverLetterMetadataResponse } from "@/types/types";
import { CoverLetterRow } from "./CoverLetterRow";
import { LoadingRow } from "./LoadingRow";
import { NoDataRow } from "./NoDataRow";

interface Props {
  coverLetters: CoverLetterMetadataResponse[];
  loading: boolean;
  initialLoading: boolean;
  onDownload: (id: number) => void;
}

export const CoverLetterTable: React.FC<Props> = ({ coverLetters, loading, initialLoading, onDownload }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialLoading ? (
          <LoadingRow />
        ) : coverLetters.length > 0 ? (
          <>
            {coverLetters.map((letter) => (
              <CoverLetterRow key={letter.id} letter={letter} onDownload={onDownload} />
            ))}
            {loading && <LoadingRow />}
          </>
        ) : (
          <NoDataRow />
        )}
      </TableBody>
    </Table>
  </div>
);

