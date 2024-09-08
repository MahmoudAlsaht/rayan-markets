"use client";
import React, {
  ChangeEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { setHours, setMinutes, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function DayTimePicker({
  selected,
  setSelected,
}: {
  setSelected: React.Dispatch<SetStateAction<Date>>;
  selected: Date;
}) {
  const [timeValue, setTimeValue] = useState<string>("00:00");

  useEffect(() => {
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newSelectedDate = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
      hours,
      minutes,
    );
    setSelected(newSelectedDate);
  }, [selected, setSelected, timeValue]);

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
      hours,
      minutes,
    );
    setSelected(newSelectedDate);
    setTimeValue(time);
    console.log(newSelectedDate);
  };

  const handleDaySelect = (date: Date) => {
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );
    setSelected(new Date(format(date as Date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")));
  };

  return (
    <div>
      <div className="me-1">
        اختر وقت من الساعة ال9 صباحاََ حتى ال12 منتصف الليل
        <label>
          <input
            className="rounded-sm bg-slate-600 px-3"
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            min="09:00"
            max="00:00"
          />
        </label>
      </div>
      <Calendar
        mode="single"
        required
        selected={selected}
        onSelect={handleDaySelect}
        footer={`التاريخ المختار (${selected ? selected.toLocaleString() : "لا يوجد"})`}
      />
    </div>
  );
}
