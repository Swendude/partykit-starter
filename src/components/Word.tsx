import { initialGame } from "../../game/logic";
import { useState, useEffect } from "react";

function Word() {
  const [word, setWord] = useState("");

  useEffect(() => {
    setWord(initialGame().target);
  }, []);

  const wordArray = word.split("");

  return (
    <div className="flex border-2 border-solid border-black justify-center my-8">
      {wordArray.map((letter, index) => (
        <li
          key={index}
          className="border-2 border-solid border-black p-4 list-none "
        >
          <span className="invisible"> {letter}</span>
        </li>
      ))}

      <form></form>
    </div>
  );
}

export default Word;
