import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  className,
  containerClassName,
  required,
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={cn("space-y-1", containerClassName)}>
      <Label htmlFor={inputId} className={cn("text-sm")}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helperText`
              : undefined
        }
        className={className}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-destructive text-sm">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-muted-foreground text-sm">
          {helperText}
        </p>
      )}
    </div>
  );
};
