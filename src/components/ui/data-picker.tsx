"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "../../../src/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value: Date;
  onChange: any
}
export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-[240px] h-[56px] rounded-lg justify-center gap-4 cursor-pointer items-center text-left font-normal border-[1px] border-zinc-300 flex ",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "PPP", { locale: ptBR })
          ) : (
            <span>Selecione a data</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
