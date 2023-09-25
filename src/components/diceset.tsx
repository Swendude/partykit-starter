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

export const DiceSet = ({
  dice,
  variant = "md",
  hidden = false,
}: {
  dice: DiceSetT | null;
  variant?: "md" | "sm";
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
            size={variant === "md" ? 72 : 36}
          />
        ))}
      </div>
    );
  }

  if (hidden) {
    return (
      <div className="flex justify-between">
        {fiveTuple.map((_, i) =>
          dice[i].status === "removed" ? (
            <XSquare key={i} className="" size={variant === "md" ? 72 : 36} />
          ) : (
            <Square key={i} className="" size={variant === "md" ? 72 : 36} />
          )
        )}
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
        if (thisDice.status === "removed") {
          return (
            <XSquare
              key={i}
              className="stroke-accent fill-accent"
              size={variant === "md" ? 72 : 36}
            />
          );
        } else {
          const Icon = faceToIcon(thisDice.value);
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
              <Icon key={i} className="" size={variant === "md" ? 72 : 36} />
            </motion.div>
          );
        }
      })}
    </motion.div>
  );
};
