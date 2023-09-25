import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { DiceFace } from "../../game/logic";

const BetValidator = z.object({
  amount: z.number().int(),
  face: z.number().min(1).max(6),
});

export const BetForm = ({ active }: { active: boolean }) => {
  const betForm = useForm({
    resolver: zodResolver(BetValidator),
    defaultValues: {
      amount: 1,
      face: 1,
    },
  });

  return (
    <Form {...betForm}>
      <form
        onSubmit={betForm.handleSubmit((data) => console.log(data))}
        className=""
      >
        <FormField
          control={betForm.control}
          name="amount"
          render={({ field, formState, fieldState }) => {
            return (
              <FormItem className="">
                <FormLabel className="sr-only">Amount</FormLabel>
                <FormControl>
                  <div className="flex  gap-4 justify-stretch items-center ">
                    <Button
                      type="button"
                      className="flex-grow"
                      variant={"outline"}
                      onClick={() => field.onChange(field.value - 1)}
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      className="flex-grow"
                      variant={"outline"}
                      onClick={() => field.onChange(field.value + 1)}
                    >
                      +
                    </Button>
                  </div>
                  {/* <Select
                  onValueChange={(val) => betForm.setValue("face", Number(val))}
                  defaultValue={"1"}
                >
                  <SelectTrigger className="">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Array(6)].map((_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                  {/* <Input {...field} /> */}
                </FormControl>
                {/* {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )} */}
              </FormItem>
            );
          }}
        />
        <Button type="submit" variant={"ghost"}>
          Place bet!
        </Button>
      </form>
      <div>
        {Array.from({ length: betForm.getValues().amount }, (_, i) => {
          const Icon = faceToIcon(betForm.getValues().face as DiceFace);
          return <Icon key={i}></Icon>;
        })}
      </div>
    </Form>
  );
};
