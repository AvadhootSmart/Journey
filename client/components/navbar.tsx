"use client";

import { ThemeToggle } from "./themeToggle";

export const Navbar = () => {
  return <nav className="flex justify-between items-center p-4 border-b border-muted-foreground"><h1>Journey</h1> <ThemeToggle /></nav>;
};
