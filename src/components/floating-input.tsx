import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, Props>(
  ({ label, icon, error, className, id, value, defaultValue, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(value ?? defaultValue);
    const floating = focused || hasValue;

    return (
      <div className="kawn-field">
        <div
          className={cn(
            "relative flex items-center rounded-xl border bg-card transition-all duration-200",
            "border-border",
            focused && "border-gold ring-4 ring-gold/20 shadow-[0_0_0_4px_rgba(242,201,76,0.12)]",
            error && "border-destructive",
          )}
        >
          {icon && (
            <span className="ps-4 text-muted-foreground" aria-hidden>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            className={cn(
              "peer h-14 w-full bg-transparent px-4 pt-4 pb-1 text-sm text-foreground outline-none placeholder:text-transparent",
              icon && "ps-2",
              className,
            )}
            placeholder={label}
            {...rest}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute text-muted-foreground transition-all duration-200",
              "start-4",
              icon && "start-11",
              floating
                ? "top-1.5 text-[11px] font-semibold tracking-wide text-primary-medium dark:text-gold"
                : "top-1/2 -translate-y-1/2 text-sm",
            )}
          >
            {label}
          </label>
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive ps-1">{error}</p>}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";
