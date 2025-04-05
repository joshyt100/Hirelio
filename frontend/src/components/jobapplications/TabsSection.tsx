import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui";

const statusValues = ["all", "saved", "applied", "interview", "offer", "rejected"];

export default function TabsSection({
  activeTab,
  setActiveTab,
  clearJobs,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clearJobs: () => void;
}) {
  return (
    <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
      <TabsList>
        {statusValues.map((val) => (
          <TabsTrigger
            key={val}
            value={val}
            onClick={() => {
              setActiveTab(val);
              clearJobs();
            }}
            className={activeTab === val ? "bg-white dark:bg-black dark:text-white" : ""}
          >
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

