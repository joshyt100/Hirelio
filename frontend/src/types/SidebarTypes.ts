
export interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}



export interface SidebarContextType {
  /** Whether the sidebar is collapsed (desktop hot-dog mode) or expanded */
  collapsed: boolean;
  /** Toggle between collapsed and expanded */
  toggleCollapsed: () => void;
  /** Explicitly expand (open) the sidebar */
  openSidebar: () => void;
  /** Explicitly collapse (hide or shrink) the sidebar */
  closeSidebar: () => void;
  /** True when running on mobile (the "sausage" toggle is visible) */
  isMobile: boolean;
  /** Whether the sidebar is open as an overlay on mobile */
  isOverlayOpen: boolean;
}
