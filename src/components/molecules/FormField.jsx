import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  className, 
  labelClassName, 
  inputClassName,
  required = false,
  ...props 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      <Label className={cn(labelClassName)} htmlFor={props.id}>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Input
        className={cn(
          error && "border-error focus:ring-error",
          inputClassName
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;