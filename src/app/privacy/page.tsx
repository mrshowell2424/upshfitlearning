import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import PolicyPage from "@/components/shared/PolicyPage";
import { POLICIES } from "@/lib/constants/policies";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Upshift Learning collects, uses, shares, and protects information. We do not sell, rent, or trade your personal information to third parties.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <PolicyPage policy={POLICIES.privacy} />
      </main>
      <Footer />
    </div>
  );
}
