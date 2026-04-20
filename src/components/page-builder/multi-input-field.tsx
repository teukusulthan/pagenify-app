"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

interface MultiInputFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  placeholder?: string;
}

export function MultiInputField({
  label,
  values,
  onChange,
  error,
  placeholder,
}: MultiInputFieldProps) {
  const [newValue, setNewValue] = useState("");

  function addValue() {
    const trimmed = newValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setNewValue("");
    }
  }

  function removeValue(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={addValue}>
          <Plus className="h-4 w-4" weight="bold" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
