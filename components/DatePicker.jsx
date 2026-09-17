"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import Icon from "./Icon";

export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined;
}

function formatDate(date) {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DatePicker({
  label,
  value,
  onChange,
  from,
  to,
  onRangeChange,
  min,
  required = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const range = Boolean(onRangeChange);
  const selected = range
    ? { from: parseDate(from), to: parseDate(to) }
    : parseDate(value);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <span className={`flex items-center gap-1 ${className}`}>
        <input
          aria-label={label}
          type="text"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 w-full bg-transparent text-[11px] outline-none"
        />
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={`Choose ${label.toLowerCase()}`}
            className="shrink-0 rounded p-1 text-slate hover:bg-blue-500/10"
          >
            <Icon name="calendar" size={18} />
          </button>
        </Popover.Trigger>
      </span>
      <Popover.Portal>
        <Popover.Content
          aria-label={range ? "Choose travel dates" : "Choose experience date"}
          align="start"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 rounded-lg bg-panel shadow-xl"
        >
          <Calendar
            autoFocus
            mode={range ? "range" : "single"}
            min={range ? 1 : undefined}
            defaultMonth={parseDate(value) || parseDate(from) || parseDate(min)}
            selected={selected}
            disabled={{ before: parseDate(min) || new Date() }}
            onSelect={(selection) => {
              if (range) {
                onRangeChange(
                  formatDate(selection?.from),
                  formatDate(selection?.to),
                );
                if (selection?.from && selection?.to) setOpen(false);
              } else {
                onChange(formatDate(selection));
                setOpen(false);
              }
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
