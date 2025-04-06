import React from "react";
import { SolidCircleLoader } from "./SolidCircleLoader";

export const LoadingRow = ({ colSpan = 4 }: { colSpan?: number }) => (
  <tr>
    <td colSpan={colSpan} className="text-center">
      <SolidCircleLoader className="w-6 h-6 mx-auto my-4" />
    </td>
  </tr>
);

