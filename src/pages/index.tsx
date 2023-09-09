import Game from "@/components/Game";
import Layout from "@/components/Layout";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomid] = useState<string | null>(null);
  const [showGame, setShowGame] = useState<boolean>(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!(username && roomId)) {
      alert("Please provide a username and roomId!");
    } else {
      setShowGame(true);
    }
  };

  // Show the game after the user has picked a room and a username
  if (showGame && username && roomId) {
    return <Game roomId={roomId} username={username} />;
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
            value={username || ""}
            onChange={(e) => setUsername(e.currentTarget.value)}
            className="border border-black p-2"
            name="username"
            id="username"
          />
          <label className="text-stone-600 text-xs font-bold" htmlFor="roomid">
            RoomId
          </label>
          <input
            type="text"
            value={roomId || ""}
            onChange={(e) => setRoomid(e.currentTarget.value)}
            className="border border-black p-2"
            name="roomid"
            id="roomid"
          />
          <button className="rounded border border-black py-5 hover:bg-yellow-400 group">
            <p className="group-hover:animate-bounce">Join the party🎉</p>
          </button>
        </form>
      </div>
    </Layout>
  );
}
