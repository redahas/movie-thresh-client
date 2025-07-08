import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Toggle({ checked, onCheckedChange }: ToggleProps) {
  return (
    <Button
      variant={checked ? "default" : "outline"}
      size="sm"
      onClick={() => onCheckedChange(!checked)}
      className="h-8 w-16"
    >
      {checked ? <Check className="h-4 w-4" /> : "Off"}
    </Button>
  );
}
