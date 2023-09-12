import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export function LogView({ logs }: { logs: string[] }) {
  return (
    <ScrollArea className="h-32 w-full rounded-md border">
      <div className="p-4 space-y-2">
        {logs.toReversed().map((log, k) => (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 100,
            }}
            key={k}
            className="rounded-full px-4 py-2 font-semibold bg-muted"
          >
            {log}
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
