"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE } from "../../../lib/i18n";
import { basePath } from "../../../lib/basePath";

export default function SlugRedirectClient({ slug }: { slug: string }) {
  useEffect(() => {
    window.location.replace(`${basePath}/${DEFAULT_LOCALE}/referenzen/${slug}`);
  }, [slug]);

  return null;
}
