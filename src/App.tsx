import {
  FullCalendarDaysCells,
  FullCalendarHeader,
  FullCalendarHeaderDays,
  FullCalendarProvider,
} from "@/components/calendar/full-calendar.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { EventsMock } from "@/events.mock.ts";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={"flex-col gap-2"}>
        <ModeToggle />
        <div className="w-full md:w-[1280px]">
          <FullCalendarProvider
            events={EventsMock}
            onClickEvent={() => null}
            handleClickAddEvent={() => null}
          >
            <FullCalendarHeader />
            <FullCalendarHeaderDays />
            <FullCalendarDaysCells />
          </FullCalendarProvider>
        </div>
      </div>
    </ThemeProvider>
  );
}
