import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
  required?: boolean;
}

export function FormField({
  className,
  error,
  required,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div
      data-slot="form-field"
      className={cn("flex flex-col space-y-2 w-full", className)}
      {...props}
    >
      {children}
      {error && <FormError message={error} />}
    </div>
  )
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({
  className,
  required,
  children,
  ...props
}: FormLabelProps) {
  return (
    <label
      data-slot="form-label"
      className={cn(
        "text-sm font-semibold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {required && <span className="text-destructive font-bold select-none">*</span>}
    </label>
  )
}

export function FormDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormError({
  className,
  message,
  children,
  ...props
}: FormErrorProps) {
  const displayMessage = message || children;
  if (!displayMessage) return null;

  return (
    <p
      data-slot="form-error"
      role="alert"
      className={cn(
        "text-xs sm:text-sm font-medium text-destructive flex items-center gap-1.5 animate-page-transition",
        className
      )}
      {...props}
    >
      <AlertCircle className="size-3.5 shrink-0" />
      <span>{displayMessage}</span>
    </p>
  )
}
