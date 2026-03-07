import Image from "next/image";
import { staff } from "@/data/staff";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";

export function List() {
  return (
    <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {staff.map((member) => (
        <Card 
          key={member.id} 
          className="group hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1"
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-brand-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-24 w-24 rounded-full border-2 border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-900 overflow-hidden group-hover:border-brand-accent/50 transition-colors duration-500">
                <Image
                  src={member.image || `https://mc-heads.net/avatar/${member.name}/96`}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full shadow-inner"
                />
              </div>
            </div>

            <Text size="lg" weight="extrabold" className="text-zinc-900 dark:text-zinc-100">
              {member.name}
            </Text>
            
            <div className="mt-1 px-3 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
              <Text weight="bold" className="text-[10px] uppercase tracking-widest text-brand-accent">
                {member.rank}
              </Text>
            </div>

            <Text size="xs" variant="muted" className="mt-4 leading-relaxed line-clamp-3">
              {member.bio}
            </Text>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
