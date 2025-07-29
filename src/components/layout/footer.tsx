import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#48896D] text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <p className="text-sm">
          © {new Date().getFullYear()} GreenLoops. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
