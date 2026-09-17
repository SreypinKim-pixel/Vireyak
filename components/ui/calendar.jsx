"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "./calendar.module.css";

export function Calendar({ className = "", ...props }) {
  return (
    <DayPicker
      showOutsideDays
      className={`${styles.calendar} ${className}`}
      {...props}
    />
  );
}
