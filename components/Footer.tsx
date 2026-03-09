export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-6 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Site Radar — Desenvolvido por Raphael Robles ♥.</p>
      </div>
    </footer>
  );
}