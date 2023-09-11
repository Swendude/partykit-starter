import Game from "@/components/Game";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

const queryParamsValidator = z.object({
  username: z.string().min(1),
  roomId: z.string().min(1),
});

interface GameSetup {
  username: string | null;
  roomId: string | null;
  showGame: boolean;
}

export default function Home() {
  const [setup, setSetup] = useState<GameSetup>({
    username: null,
    roomId: null,
    showGame: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const parsed = queryParamsValidator.safeParse(router.query);
      if (parsed.success) {
        setSetup(() => ({
          username: parsed.data.username,
          roomId: parsed.data.roomId,
          showGame: true,
        }));
      }
    }
  }, [router, setSetup]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!setup || !(setup.username && setup.roomId)) {
      alert("Please provide a username and roomId!");
    } else {
      setSetup({ ...setup, showGame: true });
      router.push(
        {
          query: {
            username: setup.username,
            roomId: setup.roomId,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  // Show the game after the user has picked a room and a username
  if (setup !== null && setup.showGame && setup.roomId && setup.username) {
    return (
      <>
        <Layout>
          <Game roomId={setup.roomId} username={setup.username} />
          <div className="flex justify-end">
            <button
              onClick={() => {
                router.push({
                  pathname: "/",
                  query: null,
                });
                setSetup({
                  username: null,
                  roomId: null,
                  showGame: false,
                });
              }}
              className="bg-black rounded p-2 inline-block shadow text-xs text-stone-50 hover:animate-wiggle"
            >
              Leave Room
            </button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl pb-5">Welcome to the Partykit starter!🎈</h1>
      <div>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <label
            className="text-stone-600 text-xs font-bold"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            value={setup.username || ""}
            onChange={(e) =>
              setSetup({ ...setup, username: e.currentTarget.value })
            }
            className="border border-black p-2"
            name="username"
            id="username"
          />
          <label className="text-stone-600 text-xs font-bold" htmlFor="roomid">
            RoomId
          </label>
          <input
            type="text"
            value={setup.roomId || ""}
            onChange={(e) =>
              setSetup({ ...setup, roomId: e.currentTarget.value })
            }
            className="border border-black p-2"
            name="roomid"
            id="roomid"
          />
          <button className="rounded border p-5 bg-yellow-400 group text-black shadow hover:shadow-lg transition-all duration-200 hover:scale-125">
            <p className="font-bold hover:animate-wiggle">Join the party🎉</p>
          </button>
        </form>
      </div>
    </Layout>
  );
}
