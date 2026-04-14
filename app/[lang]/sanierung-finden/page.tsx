"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SanierungFindenRedirect() {
  const router = useRouter();
  const { lang } = useParams();
  useEffect(() => {
    router.replace(`/${lang}/loesungsfinder/`);
  }, [router, lang]);
  return null;
}
