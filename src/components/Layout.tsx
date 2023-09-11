"use client";
import { Fira_Sans, Inter } from "next/font/google";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Separator } from "./ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

const fira = Fira_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <main
      className={`${fira.className} grid place-content-center h-screen flex-row bg-background w-screen`}
    >
      <Card className="max-w-[65rem] w-fit">
        <CardHeader>
          <div className="flex justify-between items-end">
            <CardTitle>{"Liar's Dice"}</CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
            >
              {theme !== "light" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Separator />
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
};

export default Layout;
