"use client";

import { useEffect } from "react";
import { basePath } from "../lib/basePath";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${basePath}/sw.js`)
        .catch(() => {
          // SW registration failed silently – non-critical
        });
    }
  }, []);

  return null;
}
