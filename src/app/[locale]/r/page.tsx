import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SharedRecipePage } from "@/components/UserRecipes";

// The recipe itself travels in the link after "#", so this page is the same for everyone.
export const metadata: Metadata = { title: "Recipe", robots: { index: false } };

export default async function SharedRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container-page py-10">
      <SharedRecipePage />
    </div>
  );
}
