import { referenzen } from "../../../data/referenzen";
import SlugRedirectClient from "./SlugRedirectClient";

export function generateStaticParams() {
  return referenzen.map((r) => ({ slug: r.slug }));
}

export default async function ReferenzSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SlugRedirectClient slug={slug} />;
}
