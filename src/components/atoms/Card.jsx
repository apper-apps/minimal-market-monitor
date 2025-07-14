import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;