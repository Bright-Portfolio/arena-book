import { FC } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  label: string;
  placeholder: string;
  error?: string;
}

export const TextareaField: FC<TextareaFieldProps> = ({
  label,
  placeholder,
  error,
  ...props
}) => {
  return (
    <Field className="flex flex-col justify-start items-stretch gap-2">
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        rows={3}
        placeholder={placeholder}
        className="max-h-20 resize-none overflow-y-auto scrollbar-hide"
        {...props}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};
