import React from "react";

export const NoDataRow = ({ colSpan = 4 }: { colSpan?: number }) => (
  <tr>
    <td colSpan={colSpan} className="text-center">
      No cover letters found.
    </td>
  </tr>
);

