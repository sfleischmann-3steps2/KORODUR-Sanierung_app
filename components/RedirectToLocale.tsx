"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE } from "../lib/i18n";
import { basePath } from "../lib/basePath";

export default function RedirectToLocale({ path = "" }: { path?: string }) {
  useEffect(() => {
    const target = `${basePath}/${DEFAULT_LOCALE}${path}`;
    window.location.replace(target);
  }, [path]);

  return null;
}
