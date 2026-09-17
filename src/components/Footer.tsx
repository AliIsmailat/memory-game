export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <span>
          &copy; {new Date().getFullYear()} Memory Game. All rights reserved.
        </span>
        <div className="flex gap-4">
          <a href="#" className="transition-colors hover:text-text">
            About
          </a>
          <a href="#" className="transition-colors hover:text-text">
            GitHub
          </a>
          <a href="#" className="transition-colors hover:text-text">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
