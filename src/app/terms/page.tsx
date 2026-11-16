import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import PolicyPage from "@/components/shared/PolicyPage";
import { POLICIES } from "@/lib/constants/policies";

export const metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern use of the Upshift Learning website, its content, programs, and donations.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <PolicyPage policy={POLICIES.terms} />
      </main>
      <Footer />
    </div>
  );
}
