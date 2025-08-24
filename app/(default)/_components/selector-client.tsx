"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { type SelectorOption } from "@/app/(default)/_components/selectors.store";

interface SelectorClientProps {
  icon: React.ReactNode;
  placeholder: string;
  options: SelectorOption[];
  value?: string; // selected option value
  onChangeAction: (option: SelectorOption | null) => void;
}

export function SelectorClient({
  icon,
  placeholder,
  options,
  value,
  onChangeAction,
}: SelectorClientProps) {
  const id = React.useId();

  const handleValueChange = (val: string) => {
    const selectedOption = options.find((o) => o.value === val) || null;
    onChangeAction(selectedOption);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger
        id={id}
        className="w-full border-none shadow-none ring-0 ring-offset-0 hover:border-transparent hover:bg-transparent hover:shadow-none focus:shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:shadow-none data-[state=open]:ring-0 dark:bg-transparent dark:shadow-none dark:ring-0 dark:hover:bg-transparent"
      >
        <div className="flex w-full items-center gap-2 overflow-hidden [&_[data-slot=select-value]]:truncate">
          {icon}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
