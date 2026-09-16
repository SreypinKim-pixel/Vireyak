"use client";

import * as Select from "@radix-ui/react-select";
import Icon from "./Icon";

// Radix reserves an empty string for its placeholder; our destination filter
// intentionally uses an empty value to mean all destinations.
const ALL_VALUE = "__vireyak_all__";

export default function Dropdown({
  id,
  label,
  value,
  onChange,
  options,
  variant = "field",
  className = "",
}) {
  const selected = String(value);
  return (
    <Select.Root
      value={selected === "" ? ALL_VALUE : selected}
      onValueChange={(next) => onChange(next === ALL_VALUE ? "" : next)}
    >
      <Select.Trigger
        id={id}
        aria-label={label}
        className={`group flex w-full min-w-0 items-center justify-between gap-3 rounded-lg text-left text-xs text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel data-[state=open]:text-secondary dark:data-[state=open]:text-brightgold ${variant === "inline" ? "min-h-7 bg-transparent py-1" : "min-h-11 border border-slate/30 bg-panel px-3.5 py-3 hover:border-accent/70 data-[state=open]:border-accent"} ${className}`}
      >
        <span className="truncate">
          <Select.Value />
        </span>
        <Select.Icon asChild>
          <Icon
            name="chevron"
            size={14}
            className="rotate-90 text-slate transition-transform group-data-[state=open]:-rotate-90 group-data-[state=open]:text-accent"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          collisionPadding={16}
          className="dropdown-menu z-[80] min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-slate/20 bg-panel text-ink shadow-[0_16px_48px_-12px_rgba(14,13,21,0.3)] dark:border-slate/30"
        >
          <Select.ScrollUpButton className="flex h-7 items-center justify-center bg-panel text-accent">
            <Icon name="chevron" size={13} className="-rotate-90" />
          </Select.ScrollUpButton>
          <Select.Viewport className="max-h-[min(320px,var(--radix-select-content-available-height))] p-1.5">
            <Select.Group>
              <Select.Label className="mx-1 mb-1 border-b border-slate/15 px-2 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/55">
                {label}
              </Select.Label>
              {options.map((option) => (
                <Select.Item
                  key={String(option.value)}
                  value={
                    String(option.value) === ""
                      ? ALL_VALUE
                      : String(option.value)
                  }
                  textValue={option.label}
                  className="relative flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-lg py-3 pl-3 pr-10 text-xs outline-none transition-colors data-[highlighted]:bg-slate/10 data-[state=checked]:bg-gold/10 data-[state=checked]:font-medium data-[state=checked]:text-navy dark:data-[state=checked]:bg-brightgold/10 dark:data-[state=checked]:text-brightgold"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3 text-accent">
                    <Icon name="check" size={15} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-7 items-center justify-center bg-panel text-accent">
            <Icon name="chevron" size={13} className="rotate-90" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
