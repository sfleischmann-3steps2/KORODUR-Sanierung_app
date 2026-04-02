"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

const STORAGE_KEY = "korodur-sidebar-collapsed";

export default function AppShell({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapsed

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const toggleMobileDrawer = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        lang={lang}
        dict={dict}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={sidebarOpen}
        onCloseMobile={closeMobileDrawer}
      />

      {/* Main area */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
      >
        <TopBar
          lang={lang}
          dict={dict}
          onMenuToggle={toggleMobileDrawer}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
          <Footer lang={lang} dict={dict} />
        </main>
      </div>
    </div>
  );
}
