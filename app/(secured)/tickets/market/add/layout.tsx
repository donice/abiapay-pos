import { GoBackButton } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={inter.className}>
      <GoBackButton />
      <header className="mt-2">
        <CustomHeader
          title="Pay Market Levy"
          desc="Create Ticket for Market Levy"
        />
      </header>
      {children}
    </section>
  );
}
