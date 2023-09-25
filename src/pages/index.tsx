import { Portal } from "@/components/portal";
import Game from "@/components/game";
import Layout from "@/components/layout";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

export const setupValidator = z.object({
  username: z.string().nonempty({ message: "Please pick a username" }),
  roomId: z.string().min(4, { message: "Requires more than 4 characters" }),
});

export type GameSetup = z.infer<typeof setupValidator>;

export default function Home() {
  // const [setup, setSetup] = useState<GameSetup | null>(null);
  const [setup, setSetup] = useState<GameSetup | null>(null);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Layout>
        {setup !== null ? (
          <Game
            roomId={setup.roomId}
            username={setup.username}
            leaveRoom={() => setSetup(null)}
          />
        ) : (
          <>
            <Portal setSetup={setSetup} />
            <Separator />
            <div className="flex gap-2 pt-2">
              {["Bob", "Alice", "Jane", "Joe"].map((name, i) => (
                <Button
                  key={i}
                  variant={"outline"}
                  size={"icon"}
                  onClick={() =>
                    setSetup({
                      username: `${name}`,
                      roomId: "AAAA",
                    })
                  }
                >
                  {name}
                </Button>
              ))}
            </div>
          </>
        )}
      </Layout>
      <Toaster />
    </ThemeProvider>
  );
}
