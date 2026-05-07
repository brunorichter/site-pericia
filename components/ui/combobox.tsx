"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  label?: string
  className?: string
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum item encontrado.",
  label,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      {label ? (
        <span className="mb-1 block text-xs uppercase tracking-wide text-brand-cyan-100/80">
          {label}
        </span>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-[52px] justify-between rounded-xl border border-slate-600/80 bg-slate-900/80 px-4 text-left text-white shadow-sm shadow-black/20 ring-1 ring-white/[0.03] hover:border-cyan-300/40 hover:bg-slate-900 focus-visible:ring-cyan-400/40",
              !selectedOption && "text-brand-cyan-100/80"
            )}
          >
            <div className="flex flex-col leading-tight text-left">
              <span className="text-[11px] uppercase tracking-widest text-slate-400">
                {label ?? "Opção"}
              </span>
              <span className="text-sm font-semibold">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-brand-cyan-500/30 bg-brand-dark text-white shadow-2xl">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="placeholder:text-brand-cyan-100/60"
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup className="max-h-56 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => handleSelect(currentValue)}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{option.label}</span>
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 text-brand-cyan-300 transition-opacity",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
