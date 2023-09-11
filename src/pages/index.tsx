import { Portal } from "@/components/portal";
import Game from "@/components/game";
import Layout from "@/components/layout";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

export const setupValidator = z.object({
  username: z.string().min(1),
  roomId: z.string().min(4),
});

export type GameSetup = z.infer<typeof setupValidator>;

export default function Home() {
  const [setup, setSetup] = useState<GameSetup | null>(null);

  // Show the game after the user has picked a room and a username
  if (setup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Layout>
          <Game roomId={setup.roomId} username={setup.username} />
          <div className="flex justify-end">
            <button
              onClick={() => setSetup(null)}
              className="bg-black rounded p-2 inline-block shadow text-xs text-stone-50 hover:animate-wiggle"
            >
              Leave Room
            </button>
          </div>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Layout>
        <Portal setSetup={setSetup} />
      </Layout>
    </ThemeProvider>
  );
}
