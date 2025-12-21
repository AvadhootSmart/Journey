"use client";

import { ThemeToggle } from "./themeToggle";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/widget")) return null;

  return (
    <nav className="flex justify-between items-center p-4 border-b border-muted-foreground">
      <h1 className="text-xl font-bold">Journey</h1>
      <ThemeToggle />
    </nav>
  );
};
