import { useCallback, useEffect, useState } from "react";

export default function useNavigationMenus() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const closeMenus = useCallback(() => {
    setMobileOpen(false);
    setOwnerMenuOpen(false);
    setProfileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => setMobileOpen((value) => !value);

  const toggleOwnerMenu = () => {
    setOwnerMenuOpen((value) => !value);
    setProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen((value) => !value);
    setOwnerMenuOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenus();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeMenus]);

  return {
    mobileOpen,
    ownerMenuOpen,
    profileMenuOpen,
    closeMenus,
    toggleMobileMenu,
    toggleOwnerMenu,
    toggleProfileMenu,
  };
}
