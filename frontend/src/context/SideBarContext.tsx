


// src/context/SidebarContext.tsx
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { SidebarContextType } from "@/types/SidebarTypes";

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // collapsed=false means full desktop or overlay open on mobile
  const [collapsed, setCollapsed] = useState(true);
  // isMobile tracks viewport < 1024px
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), []);
  const openSidebar = useCallback(() => setCollapsed(false), []);
  const closeSidebar = useCallback(() => setCollapsed(true), []);

  // Sidebar is overlay when on mobile and expanded (collapsed=false)
  const isOverlayOpen = useMemo(() => isMobile && !collapsed, [isMobile, collapsed]);

  const value = useMemo<SidebarContextType>(
    () => ({ collapsed, toggleCollapsed, openSidebar, closeSidebar, isMobile, isOverlayOpen }),
    [collapsed, toggleCollapsed, openSidebar, closeSidebar, isMobile, isOverlayOpen]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};
