// The real <html> lives in [locale]/layout.tsx so it can set lang="en" / "fr".
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
