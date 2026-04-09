"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "../../../lib/LocaleContext";

export default function KonfiguratorRedirect() {
  const router = useRouter();
  const { lang } = useLocale();

  useEffect(() => {
    router.replace(`/${lang}/sanierung-finden`);
  }, [router, lang]);

  return null;
}
