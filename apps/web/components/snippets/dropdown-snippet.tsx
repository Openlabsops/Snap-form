import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { Label } from "@repo/ui/components/ui/label";
import type { DropdownSnippetProps } from "./types";

export function DropdownSnippet({
  element,
  value = "",
  onChange,
  readOnly,
}: DropdownSnippetProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={element.id}>
        {element.label}
        {element.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {element.description && (
        <p className="text-xs text-muted-foreground">{element.description}</p>
      )}
      {readOnly ? (
        <div
          id={element.id}
          role="combobox"
          aria-disabled="true"
          aria-expanded="false"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background opacity-50 cursor-not-allowed"
        >
          <span className="text-muted-foreground">
            {element.placeholder ?? "Select an option…"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      ) : (
        <Select
          value={value}
          onValueChange={(val) => val && onChange?.(val)}
          required={element.required}
        >
          <SelectTrigger>
            <SelectValue placeholder={element.placeholder ?? "Select an option…"} />
          </SelectTrigger>
          <SelectPopup>
            {element.options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      )}
    </div>
  );
}
