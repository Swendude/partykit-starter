import {
  Square,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  XSquare,
} from "lucide-react";
import { DICE_FACES, DiceFace, DiceSet as DiceSetT } from "../../game/logic";
import { motion } from "framer-motion";
export const faceToIcon = (face: DiceFace) => {
  switch (face) {
    case 1:
      return Dice1;
    case 2:
      return Dice2;
    case 3:
      return Dice3;
    case 4:
      return Dice4;
    case 5:
      return Dice5;
    case 6:
      return Dice6;
  }
};

const twSizes = {
  base: 1,
  "2xl": 32,
} as const;

type Size = keyof typeof twSizes;

export const DiceSet = ({
  dice,
  size = "base",
  hidden = false,
}: {
  dice: DiceSetT | null;
  size?: Size;
  hidden?: boolean;
}) => {
  const fiveTuple = [...new Array(5)];

  if (dice === null) {
    return (
      <div className="flex justify-between">
        {fiveTuple.map((_, i) => (
          <Square
            key={i}
            className="stroke-accent fill-accent"
            size={twSizes[size]}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="flex justify-between"
      variants={{
        hidden: {},
        shown: {
          transition: {
            staggerChildren: 0.3,
          },
        },
      }}
      initial={"hidden"}
      animate={"shown"}
    >
      {fiveTuple.map((_, i) => {
        const thisDice = dice[i];

        const Icon = faceToIcon(
          thisDice.status !== "removed" ? thisDice.value : 1
        );
        return (
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -100,
                rotate: 300,
              },
              shown: {
                opacity: 1,
                y: 0,
                rotate: 0,
              },
            }}
            key={i}
          >
            {hidden && thisDice.status === "removed" ? (
              <XSquare
                key={i}
                className="opacity-50 fill"
                size={twSizes[size]}
              />
            ) : hidden ? (
              <Square key={i} className="opacity-50" size={twSizes[size]} />
            ) : (
              <Icon key={i} className="" size={twSizes[size]} />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
