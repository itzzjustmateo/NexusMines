import * as React from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

type FooterProps = React.HTMLAttributes<HTMLElement> & {
  createdAt: number;
  name: string;
  allRightsReserved?: boolean;
  rightsText?: string;
  extraContent?: React.ReactNode;
};

function Footer({
  createdAt,
  name,
  allRightsReserved = false,
  rightsText = "All rights reserved.",
  className,
  extraContent,
  ...props
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Ensure createdAt is not in future and is a positive integer
  if (
    typeof createdAt !== "number" ||
    isNaN(createdAt) ||
    !Number.isInteger(createdAt) ||
    createdAt <= 1900 ||
    currentYear < createdAt
  ) {
    throw new Error(
      `[Footer] createdAt (${createdAt}) must be a valid year and not in the future.`
    );
  }

  const yearLabel =
    currentYear === createdAt
      ? `${createdAt}`
      : `${createdAt}–${currentYear}`;

  return (
    <footer
      className={cn(
        "w-full py-8 border-t border-border bg-background/80 dark:bg-background/70 flex flex-col items-center gap-1 transition-all duration-200",
        className
      )}
      {...props}
    >
      <Text size="xs" variant="muted" align="center">
        <span>
          © {yearLabel} {name}.{" "}
          {(allRightsReserved || rightsText) && (
            <span>{rightsText}</span>
          )}
        </span>
      </Text>
      {extraContent && (
        <div className="mt-1">{extraContent}</div>
      )}
    </footer>
  );
}

export { Footer };
