import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva(
  "text-foreground text-sm leading-6 antialiased transition-colors selection:bg-primary/20 selection:text-primary-foreground",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
        subtle: "text-muted-foreground/80",
        destructive: "text-destructive",
        success: "text-green-600 dark:text-green-500",
        warning: "text-yellow-600 dark:text-yellow-500",
        info: "text-blue-600 dark:text-blue-500",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xxs: "text-[11px] leading-4",
        xs: "text-xs leading-5",
        sm: "text-sm leading-6",
        md: "text-base leading-7",
        lg: "text-lg leading-8",
        xl: "text-xl leading-9",
        "2xl": "text-2xl leading-10",
      },
      weight: {
        thin: "font-thin",
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      truncate: {
        true: "truncate",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      weight: "normal",
      align: "left",
    },
  },
);

type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
  };

function Text({
  className,
  variant,
  size,
  weight,
  align,
  truncate,
  asChild = false,
  ...props
}: TextProps) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      data-slot="text"
      data-variant={variant}
      className={cn(
        textVariants({
          variant,
          size,
          weight,
          align,
          truncate,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Text, textVariants };
