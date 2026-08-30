"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Flame,
  Truck,
  Trees,
  ShieldAlert,
  Building2,
  Radio,
  RotateCw,
  X,
  Phone,
  CloudAlert,
  ShieldCheck,
} from "lucide-react";
import { OfficialUpdateCard, type OfficialUpdateItem } from "@/components/shared/official-update-card";
import { EmptyState } from "@/components/shared/empty-state";

const authorityFilters = [
  { id: "all", label: "جميع المصادر", icon: Radio },
  { id: "protection_civile_jijel", label: "الحماية المدنية (جيجل)", icon: Flame },
  { id: "protection_civile", label: "الحماية المدنية (الوطنية)", icon: Flame },
  { id: "gendarmerie", label: "الدرك الوطني / طريقي", icon: Truck },
  { id: "forets", label: "محافظة الغابات", icon: Trees },
  { id: "police", label: "الأمن الوطني", icon: ShieldAlert },
  { id: "wilaya", label: "خلية الأزمة والأرصاد", icon: Building2 },
];

const categoryFilters = [
  { id: "all", label: "الكل" },
  { id: "fire_alert", label: "حرائق وإخماد" },
  { id: "road_status", label: "حالة الطرقات" },
  { id: "weather_warning", label: "نشرات الطقس" },
  { id: "safety_guidelines", label: "إرشادات وإجلاء" },
];

export function OfficialInfoClient({ initialUpdates }: { initialUpdates: OfficialUpdateItem[] }) {
  const [updates, setUpdates] = useState<OfficialUpdateItem[]>(initialUpdates);
  const [search, setSearch] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/news/sync", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        if (json.items && json.items.length > 0) {
          setUpdates(json.items);
        }
      }
    } catch {
      // Keep existing
    } finally {
      setIsSyncing(false);
    }
  };

  // Stat computations
  const stats = useMemo(() => {
    const fireAlerts = updates.filter((u) => u.update_type === "fire_alert" || u.title.includes("حريق")).length;
    const roadAlerts = updates.filter((u) => u.update_type === "road_status" || u.title.includes("طريق")).length;
    const weatherAlerts = updates.filter((u) => u.update_type === "weather_warning" || u.title.includes("جوية")).length;
    return { fireAlerts, roadAlerts, weatherAlerts, total: updates.length };
  }, [updates]);

  const filtered = useMemo(() => {
    return updates.filter((u) => {
      // 1. Search filter
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesTitle = u.title.toLowerCase().includes(q);
        const matchesBody = u.body?.toLowerCase().includes(q) ?? false;
        const matchesSource = u.source.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBody && !matchesSource) return false;
      }

      // 2. Authority filter
      if (selectedAuthority !== "all") {
        const s = `${u.source} ${u.title}`.toLowerCase();
        if (selectedAuthority === "protection_civile_jijel" && (!s.includes("0018") && !s.includes("جيجل") && !s.includes("عوانة"))) return false;
        if (selectedAuthority === "protection_civile" && !s.includes("حماية")) return false;
        if (selectedAuthority === "gendarmerie" && !s.includes("درك") && !s.includes("طريقي")) return false;
        if (selectedAuthority === "forets" && !s.includes("غابات")) return false;
        if (selectedAuthority === "police" && !s.includes("أمن")) return false;
        if (selectedAuthority === "wilaya" && !s.includes("ولاية") && !s.includes("أزمة") && !s.includes("أرصاد")) return false;
      }

      // 3. Category filter
      if (selectedCategory !== "all") {
        if (u.update_type !== selectedCategory) return false;
      }

      return true;
    });
  }, [updates, search, selectedAuthority, selectedCategory]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Live Emergency Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="flex items-center gap-3 rounded-2xl border border-priority-critical/30 bg-priority-critical/5 p-3.5 sm:p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-priority-critical/15 text-priority-critical shrink-0">
            <Flame className="size-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black tabular-nums text-priority-critical">{stats.fireAlerts}</p>
            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground">بلاغات حرائق نشطة</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-3.5 sm:p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0">
            <Truck className="size-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black tabular-nums text-blue-600 dark:text-blue-400">{stats.roadAlerts}</p>
            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground">حالة الطرقات والمعابر</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 sm:p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
            <CloudAlert className="size-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black tabular-nums text-amber-600 dark:text-amber-400">{stats.weatherAlerts}</p>
            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground">نشرات جوية خاصة</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-algeria-green/30 bg-algeria-green/5 p-3.5 sm:p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-algeria-green/15 text-algeria-green shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black tabular-nums text-algeria-green">{stats.total}</p>
            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground">إجمالي البيانات الموثقة</p>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Strip on Official Page */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3 sm:px-5 text-xs">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Phone className="size-4 text-priority-critical animate-pulse shrink-0" />
          <span>أرقام النجدة المباشرة في حالة الخطر:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:14"
            className="inline-flex items-center gap-1 rounded-lg bg-priority-critical/10 px-3 py-1 font-bold text-priority-critical hover:bg-priority-critical/20"
          >
            14 الحماية المدنية
          </a>
          <a
            href="tel:1021"
            className="inline-flex items-center gap-1 rounded-lg bg-green-600/10 px-3 py-1 font-bold text-green-700 dark:text-green-300 hover:bg-green-600/20"
          >
            1021 الغابات
          </a>
          <a
            href="tel:1055"
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/10 px-3 py-1 font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20"
          >
            1055 الدرك الوطني
          </a>
          <a
            href="tel:1548"
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600/10 px-3 py-1 font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-600/20"
          >
            1548 الشرطة
          </a>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في البيانات، حالة الطرقات، البؤر، والولايات..."
            className="w-full rounded-xl border border-border bg-card pr-10 pl-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary transition-colors disabled:opacity-60 shrink-0 shadow-xs cursor-pointer"
        >
          <RotateCw className={`size-4 text-algeria-green ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "جارٍ المزامنة..." : "تحديث المصادر الرسمية"}</span>
        </button>
      </div>

      {/* Authority Filter Tabs */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-2.5">
          <Filter className="size-3.5" />
          <span>تصفية حسب الجهة الرسمية المصدرة:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {authorityFilters.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedAuthority === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedAuthority(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
        <span className="text-xs text-muted-foreground font-medium">النوع:</span>
        {categoryFilters.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? "bg-secondary text-foreground font-bold border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {c.label}
            </button>
          );
        })}
        {(selectedAuthority !== "all" || selectedCategory !== "all" || search) && (
          <button
            type="button"
            onClick={() => {
              setSelectedAuthority("all");
              setSelectedCategory("all");
              setSearch("");
            }}
            className="text-xs text-priority-critical hover:underline font-bold mr-auto cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>

      {/* Cards Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد بيانات مطابقة لخيارات البحث"
          description="جرّب تغيير كلمات البحث أو إعادة تعيين فلاتر الجهات الرسمية."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {filtered.map((u, i) => (
            <div key={u.id || `upd-${i}`} className="h-full flex flex-col">
              <OfficialUpdateCard update={u} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
