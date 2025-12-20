import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EntryDialog } from './EntryDialog';

interface JournalCalendarProps {
    journalId: string;
    currentUserId: string | null;
    entryDates: Record<string, string[]>; // "YYYY-MM-DD": [userId1, userId2]
    userColors: Record<string, string>;
    journalCreatedAt?: string;
}

export function JournalCalendar({ journalId, currentUserId, entryDates, userColors, journalCreatedAt }: JournalCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const days = [];
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentDate]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getCellStyle = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const userIds = entryDates[dateStr];

        if (!userIds || userIds.length === 0) return {};

        const colors = userIds.map((id: string) => userColors[id] || "#cbd5e1");

        if (colors.length === 1) {
            return { backgroundColor: colors[0] };
        }

        return { background: `linear-gradient(135deg, ${colors.join(', ')})` };
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center sm:justify-start gap-4">

                <div className="flex items-center justify-center sm:justify-start gap-4 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm sm:w-fit w-full">
                    <Button variant="ghost" size="icon" className="rounded-lg" onClick={prevMonth}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-bold min-w-[160px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <Button variant="ghost" size="icon" className="rounded-lg" onClick={nextMonth}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 md:p-10">
                <div className="grid grid-cols-7 mb-8">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-zinc-400">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-3 md:gap-5">
                    {calendarDays.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="aspect-square rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10" />;
                        }

                        const style = getCellStyle(date);
                        const dateStr = date.toISOString().split('T')[0];
                        const hasAnyEntry = entryDates[dateStr]?.length > 0;

                        return (
                            <EntryDialog
                                key={date.toISOString()}
                                date={date}
                                journalId={journalId}
                                currentUserId={currentUserId}
                                journalCreatedAt={journalCreatedAt}
                            >
                                <div
                                    style={style}
                                    className={cn(
                                        "aspect-square rounded-2xl md:rounded-3xl flex items-center justify-center relative cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm overflow-hidden group",
                                        !hasAnyEntry && "bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    <span className={cn(
                                        "text-lg md:text-2xl font-bold transition-colors",
                                        hasAnyEntry ? "text-white drop-shadow-sm" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200"
                                    )}>
                                        {date.getDate()}
                                    </span>

                                    {/* Subtle hover effect light overlay */}
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                                </div>
                            </EntryDialog>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
