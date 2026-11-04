import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Suspense } from "react";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-full flex-col">
      <Suspense fallback={<div className="h-20" />}>
  <Navbar />
</Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
