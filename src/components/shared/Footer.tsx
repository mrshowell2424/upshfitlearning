export default function Footer() {
  return (
    <footer className="bg-gray-050 border-t border-hairline py-8 px-8 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} Upshift Learning. All rights reserved.</p>
      </div>
    </footer>
  );
}
