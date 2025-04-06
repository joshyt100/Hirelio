import React from "react";
import { FaRegCopy } from "react-icons/fa";
import { CoverLetterMetadataResponse } from "@/types/types";
import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  letter: CoverLetterMetadataResponse;
  onDownload: (id: number) => void;
}

export const CoverLetterRow: React.FC<Props> = ({ letter, onDownload }) => (
  <TableRow key={letter.id}>
    <TableCell>{letter.company_name}</TableCell>
    <TableCell>{letter.job_title}</TableCell>
    <TableCell>{new Date(letter.created_at).toLocaleString()}</TableCell>
    <TableCell className="text-right">
      <button onClick={() => onDownload(letter.id)}>
        <FaRegCopy className="text-primary" size={20} />
      </button>
    </TableCell>
  </TableRow>
);

