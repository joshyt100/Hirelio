import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export const NoDataRow: React.FC = () => (
  <TableRow>
    <TableCell colSpan={4} className="text-center">
      No cover letters found.
    </TableCell>
  </TableRow>
);

