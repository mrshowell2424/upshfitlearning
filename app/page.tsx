import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-8 py-16 max-w-7xl mx-auto w-full">
        <h1 className="text-[34px] font-bold mb-4">Upshift Learning Hub</h1>
        <p className="text-text-muted text-lg">Phase 1 foundation complete. Design tokens, header, footer, and Poppins font ready for Phase 3.</p>
      </main>
      <Footer />
    </div>
  );
}
