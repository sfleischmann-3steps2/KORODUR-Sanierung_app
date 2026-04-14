"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "../../../lib/LocaleContext";

export default function WizardRedirect() {
  const router = useRouter();
  const { lang } = useLocale();

  useEffect(() => {
    router.replace(`/${lang}/loesungsfinder/`);
  }, [router, lang]);

  return null;
}
