import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "medium", children, ...props }, ref) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/20",
    secondary: "bg-gray-100 text-primary hover:bg-gray-200 focus:ring-gray-300/20",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/20",
    outline: "border border-gray-300 bg-white text-primary hover:bg-gray-50 focus:ring-gray-300/20",
    ghost: "text-primary hover:bg-gray-100 focus:ring-gray-300/20",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;