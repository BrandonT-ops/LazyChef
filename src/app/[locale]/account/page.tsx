import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountPanel } from "@/components/auth/AccountPanel";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("title"), robots: { index: false } };
}

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ reset?: string; auth_error?: string }> };

export default async function AccountPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  return (
    <div className="container-page py-12">
      <AccountPanel resetMode={sp.reset === "1"} linkError={sp.auth_error === "1"} />
    </div>
  );
}
