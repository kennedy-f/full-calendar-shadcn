import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  lastDayOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from "lucide-react";
import {
  type ReactElement,
  createContext,
  forwardRef,
  memo,
  useContext,
  useMemo,
  useState,
} from "react";
import TWColors from "tailwindcss/colors";

type A = "inherit" | "current" | "transparent" | "black" | "white";

type B = keyof Omit<typeof TWColors, A>;

// type Color = `${B}-${keyof (typeof TWColors)[B]}` | `${A}`;
type BackgroundColor = `bg-${B}-${keyof (typeof TWColors)[B]}` | `${A}`;

export type FullCalendarColor = BackgroundColor;

export interface FullCalendarEvent {
  title: string;
  details?: string;
  person?: [
    {
      name: string;
      role: string;
    },
  ];
  date: { start: Date; end: Date };
  price?: {
    value: number;
    currency: string;
  };
  colors: {
    background: BackgroundColor;
  };
}

interface CalendarContextProps {
  currentMonth: Date;
  selectMonth: (date: Date) => void;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  events: FullCalendarEvent[];
  onClickEvent: (event: FullCalendarEvent) => void;
  addEvent: (day: Date) => void;
  monthStart: Date;
}

const CalendarContext = createContext({} as CalendarContextProps);

interface FullCalendarProviderProps {
  children: ReactElement[];
  events: FullCalendarEvent[];
  handleClickAddEvent: (selectedDay: Date) => void;
  onClickEvent: (event: FullCalendarEvent) => void;
}

export function FullCalendarProvider({
  children,
  events: _events,
  handleClickAddEvent,
  onClickEvent,
}: FullCalendarProviderProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleClickAdd = (day: Date) => {
    handleClickAddEvent(day);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelectMonth = (date: Date) => {
    setCurrentMonth(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        currentMonth,
        selectMonth: handleSelectMonth,
        selectDate: handleSelectDate,
        events: _events,
        selectedDate,
        addEvent: handleClickAdd,
        monthStart: startOfMonth(currentMonth),
        onClickEvent,
      }}
    >
      <div className={"w-full"}>{children}</div>
    </CalendarContext.Provider>
  );
}

const useCalendar = () => useContext(CalendarContext);

export function FullCalendarHeader() {
  const { selectMonth, currentMonth } = useCalendar();
  const dateFormat = "MMMM yyyy";
  return (
    <div className="flex justify-between items-center p-4">
      <div
        className="cursor-pointer"
        onClick={() => selectMonth(subMonths(currentMonth, 1))}
      >
        <ChevronLeftIcon />
      </div>
      <div>
        <span>{format(currentMonth, dateFormat, { locale: ptBR })}</span>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => selectMonth(addMonths(currentMonth, 1))}
      >
        <ChevronRightIcon />
      </div>
    </div>
  );
}

export function FullCalendarHeaderDays() {
  const { currentMonth } = useCalendar();
  const dateFormat = "EEEE";
  const startDate = startOfWeek(currentMonth);

  const days = useMemo(() => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < 7; i++) {
      elements.push(
        <div className="flex-1 text-center" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>,
      );
    }
    return elements;
  }, []);

  return <div className="flex gap-1">{days}</div>;
}

export function FullCalendarDaysCells() {
  const { currentMonth } = useCalendar();

  const { endDate, startDate } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return {
      monthStart,
      monthEnd,
      startDate,
      endDate,
    };
  }, [currentMonth]);

  const rows = useMemo(() => {
    let days = [];
    let day = startDate;
    const innerRows: ReactElement[] = [];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(<DayCell day={day} key={`day-${day.toString()}`} />);
        day = addDays(day, 1);
      }
      innerRows.push(
        <div className="grid grid-cols-7 " key={`day-cell-${day.toString()}`}>
          {days}
        </div>,
      );
      days = [];
    }
    return innerRows;
  }, [startDate]);

  return <div>{rows}</div>;
}

function EventTooltipData({ event }: { event: FullCalendarEvent }) {
  // todo remover hardcoded
  return (
    <>
      <p className={"font-bold"}>{event.title} </p>
      {event.person &&
        event.person.length > 0 &&
        event.person.map((person) => (
          <div key={`${person.name}`}>
            <p className={"font-semibold"}>
              {person.name} - <span> {person.role}</span>{" "}
            </p>
          </div>
        ))}
      {event.details && <p className={"pb-2"}>{event.details}</p>}

      <p>
        <span className={"font-semibold"}>Inicio:</span>{" "}
        {format(event.date.start, "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </p>
      <p className={"pb-2"}>
        <span className={"font-semibold"}>Fim:</span>{" "}
        {format(event.date.end, "dd/MM/yyyy HH:mm", { locale: ptBR })}{" "}
      </p>
      {event.price && (
        <p>
          Valor:{" "}
          {event?.price?.value?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}{" "}
        </p>
      )}
    </>
  );
}

interface EventChipProps {
  event: FullCalendarEvent;
  day: Date;
}

const EventChip = forwardRef<HTMLButtonElement, EventChipProps>(
  function EventChip({ event, day }, ref) {
    const { onClickEvent } = useCalendar();
    const eventStartOnThisDay = isSameDay(event.date.start, day);
    const eventEndsOnThisDay = isSameDay(event.date.end, day);

    const isLastDayOfWeek = isSameDay(lastDayOfWeek(day), day);
    const isFirstDayOfWeek = isSameDay(startOfWeek(day), day);

    const eventContinuityClasses = `${
      !eventStartOnThisDay ? "rounded-l-none" : "rounded-l"
    } ${!eventEndsOnThisDay ? "rounded-r-none -mr-2" : "rounded-r"} ${
      isLastDayOfWeek && !eventEndsOnThisDay ? "border-r mr-0" : ""
    }`;

    const bgColor = `${event.colors.background}`;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                `button z-10 p-0 ${eventContinuityClasses} ${bgColor} rounded overflow-hidden flex flex-col`,
              )}
              ref={ref}
              onClick={() => onClickEvent(event)}
            >
              <div className={"flex flex-row"}>
                <div className={"flex flex-col"}>
                  <span
                    className={
                      "text-sm whitespace-nowrap p-1 flex-nowrap overflow-ellipsis h-7"
                    }
                  >
                    {(eventStartOnThisDay || isFirstDayOfWeek) && event.title}
                  </span>
                </div>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <EventTooltipData event={event} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

function EventsCell({
  events,
  day,
}: { events: FullCalendarEvent[]; day: Date }) {
  return (
    <TooltipProvider>
      <div className={"flex flex-col gap-1 align-middle mt-1 w-full"}>
        {events.map((event) => (
          <Tooltip key={event.title}>
            <TooltipTrigger asChild>
              <EventChip event={event} key={event.title} day={day} />
            </TooltipTrigger>
            <TooltipContent>
              <EventTooltipData event={event} />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

const DayCell = memo(
  ({
    day,
  }: {
    day: Date;
  }) => {
    const { selectDate, events, addEvent, monthStart } = useCalendar();

    const dayEvents = useMemo(() => {
      return events
        .filter(
          (event) =>
            isSameDay(event.date.start, day) ||
            (!isAfter(event.date.start, day) && !isBefore(event.date.end, day)),
        )
        .sort((a, b) => {
          if (isSameDay(a.date.start, b.date.start)) {
            return 0;
          }
          return isBefore(a.date.start, b.date.start) ? -1 : 1;
        });
    }, [events]);

    const handleClick = () => {
      addEvent(day);
    };

    return (
      <div
        className={`flex flex-col md:min-h-[180px] md:min-w-[137px] text-center align-center ${!isSameMonth(day, monthStart) && "text-gray-400"} border`}
        key={day.toString()}
      >
        <div className={"flex w-max flex-row justify-end p-1"}>
          <div
            className={`flex  justify-center items-center cursor-pointer w-7 h-7  ${isSameDay(day, new Date()) ? "bg-red-500 text-white rounded-full " : ""}`}
            onClick={() => selectDate(day)}
          >
            <label className={`cursor-pointer `}>
              {format(day, "d", { locale: ptBR })}
            </label>
          </div>
        </div>
        <EventsCell events={dayEvents} day={day} />
        <div className={"mt-auto p-1 ml-auto"}>
          <Button
            variant={"outline"}
            size={"icon"}
            aria-label={"Adicionar"}
            onClick={handleClick}
          >
            <PlusCircleIcon />
          </Button>
        </div>
      </div>
    );
  },
);
