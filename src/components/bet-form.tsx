import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BetValidator = z.object({
  amount: z.number().int(),
  face: z.number().min(1).max(6),
});

export const BetForm = () => {
  const betForm = useForm({ resolver: zodResolver(BetValidator) });
  return <p>bet!</p>;
};
