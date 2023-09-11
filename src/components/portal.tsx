import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GameSetup, setupValidator } from "@/pages";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

export const Portal = ({
  setSetup,
}: {
  setSetup: (gameSetup: GameSetup) => void;
}) => {
  const form = useForm({
    resolver: zodResolver(setupValidator),
    defaultValues: {
      username: "",
      roomId: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(setSetup)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field, formState, fieldState }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Bob" {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
              <FormDescription>
                This will be your public name in the room
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roomId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>RoomId</FormLabel>
              <FormControl>
                <Input placeholder="an-awesome-room" {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
              <FormDescription>
                Join an existing room! Or create a new one.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Join the game</Button>
      </form>
    </Form>
  );
};
