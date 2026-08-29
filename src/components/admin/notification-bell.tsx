"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";
import { relativeTimeAr } from "@/lib/constants";
import { markAllNotificationsRead, markNotificationRead } from "@/actions/notifications";
import type { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

const POLL_INTERVAL_MS = 45_000;
const LIST_LIMIT = 15;

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const [{ data: list }, { count }] = await Promise.all([
      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(LIST_LIMIT),
      supabase.from("notifications").select("id", { count: "exact", head: true }).eq("is_read", false),
    ]);
    setNotifications(list ?? []);
    setUnreadCount(count ?? 0);
  }, []);

  useEffect(() => {
    // Polling an external system (Supabase) on an interval; the initial call
    // just primes the same subscription the interval keeps refreshing.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleItemClick = async (n: Notification) => {
    if (!n.is_read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      await markNotificationRead(n.id);
    }
  };

  const handleMarkAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  };

  return (
    <Popover onOpenChange={(open) => open && refresh()}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="الإشعارات" className="relative">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -end-1 h-4 min-w-4 justify-center px-1 text-[10px]"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-80 p-0" align="end">
        <PopoverHeader className="flex-row items-center justify-between px-3 pt-2.5">
          <PopoverTitle>الإشعارات</PopoverTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="xs" onClick={handleMarkAll}>
              <CheckCheck className="size-3.5" /> تحديد الكل كمقروء
            </Button>
          )}
        </PopoverHeader>

        {notifications.length === 0 ? (
          <p className="px-3 pb-3 text-center text-sm text-muted-foreground">لا توجد إشعارات بعد</p>
        ) : (
          <ScrollArea className="h-80">
            <div className="flex flex-col gap-1 px-1 pb-1">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link ?? "#"}
                  onClick={() => handleItemClick(n)}
                  className="flex flex-col gap-0.5 rounded-md px-2 py-2 text-sm hover:bg-muted"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    {!n.is_read && <span className="size-1.5 shrink-0 rounded-full bg-algeria-green" />}
                    {n.title}
                  </span>
                  {n.body && <span className="text-xs text-muted-foreground">{n.body}</span>}
                  <span className="text-[11px] text-muted-foreground">{relativeTimeAr(n.created_at)}</span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
