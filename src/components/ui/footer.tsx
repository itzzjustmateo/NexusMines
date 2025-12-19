import * as React from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

type FooterProps = React.HTMLAttributes<HTMLElement> & {
  createdAt: number;
  name: string;
  allRightsReserved?: boolean;
  rightsText?: string;
};

function Footer({
  createdAt,
  name,
  allRightsReserved = false,
  rightsText = "All rights reserved.",
  className,
  ...props
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (currentYear < createdAt) {
    throw new Error(
      `[Footer] createdAt (${createdAt}) cannot be in the future.`,
    );
  }

  const yearLabel =
    currentYear === createdAt ? `${createdAt}` : `${createdAt}–${currentYear}`;

  return (
    <footer className={cn("w-full py-6", className)} {...props}>
      <Text size="xs" variant="muted" align="center">
        © {yearLabel} {name}
        {allRightsReserved && <> {rightsText}</>}
      </Text>
    </footer>
  );
}

export { Footer };
