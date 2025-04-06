import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { SolidCircleLoader } from "./SolidCircleLoader";

export const TableSkeleton: React.FC = () => (
  <TableRow>
    <TableCell colSpan={4} className="text-center">
      <SolidCircleLoader className="w-6 h-6 mx-auto my-8" />
    </TableCell>
  </TableRow>
);

