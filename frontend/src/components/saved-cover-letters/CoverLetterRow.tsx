import React from "react";
import { FaRegCopy } from "react-icons/fa";
import { CoverLetterMetadataResponse } from "@/types/types";

interface Props {
  letter: CoverLetterMetadataResponse;
  onDownload: (id: number) => void;
}

export const CoverLetterRow: React.FC<Props> = ({ letter, onDownload }) => (
  <tr>
    <td>{letter.company_name}</td>
    <td>{letter.job_title}</td>
    <td>{new Date(letter.created_at).toLocaleString()}</td>
    <td className="text-right">
      <button onClick={() => onDownload(letter.id)}>
        <FaRegCopy className="text-primary" size={20} />
      </button>
    </td>
  </tr>
);

