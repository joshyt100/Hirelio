import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  // Use useCallback to prevent recreation on every render
  const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), []);

  // Use useMemo to prevent context value recreation on every render
  const value = useMemo(() => ({ collapsed, toggleCollapsed }), [collapsed, toggleCollapsed]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};
