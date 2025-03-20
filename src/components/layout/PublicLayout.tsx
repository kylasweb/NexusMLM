import React from "react";
import { Link } from "react-router-dom";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold">
              Nexus MLM
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Create account
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nexus MLM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
