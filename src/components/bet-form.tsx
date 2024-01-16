import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { faceToIcon } from "./diceset";
import { DiceFace, betIsHigher } from "../../game/logic";
import { Input } from "./ui/input";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
const BetValidator = z.object({
  amount: z.number().int(),
  face: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
});

type Bet = z.infer<typeof BetValidator>;

export const BetForm = ({
  active,
  current,
  maxDice,
  onBet,
}: {
  active: boolean;
  current: Bet | null;
  maxDice: number;
  onBet: (bet: Bet) => void;
}) => {
  const betForm = useForm({
    resolver: zodResolver(BetValidator),
    defaultValues: current || {
      amount: 1,
      face: 1,
    },
  });

  useEffect(() => {
    if (current) {
      betForm.setValue("amount", current.amount);
      betForm.setValue("face", current.face);
    }
  }, [current, betForm]);

  const watchAmount = betForm.watch("amount");

  const updateAmount = (change: number) => {
    const newValue = watchAmount + change;
    if (0 < newValue && newValue <= maxDice)
      betForm.setValue("amount", newValue);
  };

  const watchFace = betForm.watch("face");

  const updateFace = (change: number) => {
    const newValue = watchFace + change;
    if (0 < newValue && newValue < 7) betForm.setValue("face", newValue);
  };

  return (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      <Form {...betForm}>
        <BetView
          active={active}
          bet={{ amount: watchAmount, face: watchFace as Bet["face"] }}
        />
        <form
          onSubmit={betForm.handleSubmit((b) =>
            onBet({ amount: b.amount, face: b.face as Bet["face"] })
          )}
          className=""
        >
          <div className="flex mb-2 gap-4">
            <FormField
              control={betForm.control}
              name="amount"
              render={({ field, fieldState, formState }) => {
                return (
                  <FormItem className="">
                    <FormLabel className="sr-only">Amount</FormLabel>
                    <FormControl>
                      <>
                        <Input type="hidden" {...field} />
                        <div className="flex justify-stretch items-center gap-2">
                          <Button
                            type="button"
                            className="flex-grow py-8"
                            disabled={field.value === 1 || !active}
                            variant={"outline"}
                            onClick={() => updateAmount(-1)}
                          >
                            Less dice
                          </Button>
                          <Button
                            type="button"
                            className="flex-grow py-8"
                            variant={"outline"}
                            disabled={field.value === maxDice || !active}
                            onClick={() => updateAmount(1)}
                          >
                            More dice
                          </Button>
                        </div>
                      </>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={betForm.control}
              name="face"
              render={({ field, fieldState, formState }) => {
                return (
                  <FormItem className="">
                    <FormLabel className="sr-only">Face</FormLabel>
                    <FormControl>
                      <>
                        <Input type="hidden" {...field} />
                        <div className="flex justify-stretch items-center gap-2">
                          <Button
                            type="button"
                            className="flex-grow py-8"
                            variant={"outline"}
                            disabled={field.value === 1 || !active}
                            onClick={() => updateFace(-1)}
                          >
                            Lower face
                          </Button>
                          <Button
                            type="button"
                            className="flex-grow py-8"
                            variant={"outline"}
                            disabled={field.value === 6 || !active}
                            onClick={() => updateFace(1)}
                          >
                            Higher face
                          </Button>
                        </div>
                      </>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button
              type="submit"
              className="flex-grow py-8 mt-2"
              variant={"default"}
              disabled={
                !active ||
                (current !== null &&
                  betIsHigher(current, {
                    amount: watchAmount,
                    face: watchFace as Bet["face"],
                  }))
              }
            >
              Place bet!
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export const BetView = ({
  bet,
  active = true,
}: {
  bet: Bet;
  active?: boolean;
}) => {
  const FaceIcon = faceToIcon(bet.face);

  return (
    <div className={cn("p-1", !active && "opacity-50")}>
      <p className="text-4xl ">
        {bet.amount}
        <span className="text-xl">{" x "}</span>
        <span>
          <FaceIcon className="inline" size={36} />
        </span>
      </p>
    </div>
  );
};
