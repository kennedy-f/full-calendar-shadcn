import { FullCalendarEvent } from "@/components/calendar/full-calendar.tsx";
import { addDays, parse } from "date-fns";

export const EventsMock: FullCalendarEvent[] = [
  {
    title: "Onboard",
    person: [
      {
        name: "John doe",
        role: "Organizer",
      },
    ],
    details: "lorem ipsum",
    colors: { background: "green-500" },
    date: { start: addDays(new Date(), 1), end: addDays(new Date(), 1) },
    price: {
      value: 100.0,
      currency: "BRL",
    },
  },
  {
    title: "Jane Smith",
    details: "lorem ipsum",
    colors: { background: "green-500" },
    date: { start: addDays(new Date(), 1), end: addDays(new Date(), 1) },
    price: {
      value: 100.0,
      currency: "BRL",
    },
  },
  {
    title: "Alice Johnson",
    details: "lorem ipsum",
    colors: { background: "green-500" },
    date: { start: addDays(new Date(), 1), end: addDays(new Date(), 1) },
    price: {
      value: 100.0,
      currency: "BRL",
    },
  },
  {
    title: "Bob Brown",
    details: "lorem ipsum",
    colors: { background: "red-500" },
    date: {
      start: parse("16/11/2024", "dd/MM/yyyy", new Date()),
      end: parse("17/11/2024", "dd/MM/yyyy", new Date()),
    },
  },
  {
    title: "Charlie Davis",
    details: "lorem ipsum",
    colors: { background: "red-500" },
    date: {
      start: parse("14/11/2024", "dd/MM/yyyy", new Date()),
      end: parse("15/11/2024", "dd/MM/yyyy", new Date()),
    },
  },
  {
    title: "Eve White",
    details: "lorem ipsum",
    colors: { background: "pink-600" },
    date: {
      start: parse("14/11/2024 19:00", "dd/MM/yyyy HH:mm", new Date()),
      end: parse("15/11/2024 07:00", "dd/MM/yyyy HH:mm", new Date()),
    },
  },
  {
    title: "Frank Green",
    details: "lorem ipsum",
    colors: { background: "blue-500" },
    date: {
      start: parse("20/11/2024", "dd/MM/yyyy", new Date()),
      end: parse("25/11/2024", "dd/MM/yyyy", new Date()),
    },
  },
];
