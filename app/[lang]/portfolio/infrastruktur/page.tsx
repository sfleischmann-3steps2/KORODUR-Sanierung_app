"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function InfrastrukturRedirect() {
  const router = useRouter();
  const { lang } = useParams();
  useEffect(() => {
    router.replace(`/${lang}/referenzen/`);
  }, [router, lang]);
  return null;
}
