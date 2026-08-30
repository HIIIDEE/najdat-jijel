"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Newspaper,
  ExternalLink,
  RotateCw,
  Radio,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr } from "@/lib/constants";
import { createPost, deletePost, togglePostPublished } from "@/actions/posts";
import { OFFICIAL_ALGERIAN_SOURCES } from "@/config/news-sources";
import type { Database } from "@/types/database";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export function NewsManager({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [publish, setPublish] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [, startTransition] = useTransition();

  async function submit() {
    setSubmitting(true);
    const res = await createPost({ title, excerpt, body, is_published: publish });
    setSubmitting(false);
    if (!res.success) {
      toast.error(res.error ?? "حدث خطأ");
      return;
    }
    toast.success(publish ? "تم نشر الخبر" : "تم حفظ المسودة");
    setTitle(""); setExcerpt(""); setBody(""); setPublish(true);
    setOpen(false);
  }

  async function triggerOfficialSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/news/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(`تمت مزامنة ${data.syncedCount} بيان وبلاغ رسمي بنجاح`);
        setSyncResult(`آخر مزامنة ناجحة: ${new Date().toLocaleTimeString("ar-DZ")} (${data.syncedCount} بلاغ تم التحقق منه)`);
      } else {
        toast.error(data.error ?? "فشلت المزامنة");
      }
    } catch {
      toast.error("تعذر الاتصال بخدمة المزامنة");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Official Ingestion Deck */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-algeria-green/30 bg-algeria-green/10 px-3 py-0.5 text-xs font-bold text-algeria-green mb-1.5">
              <Radio className="size-3.5 animate-pulse" />
              <span>نظام التغذية الآلية للمعلومات الرسمية</span>
            </div>
            <h2 className="text-lg font-bold">المصادر الرسمية المعتمدة (الحماية، الدرك، الغابات، الأمن)</h2>
            <p className="text-xs text-muted-foreground">
              سحب وتوثيق البلاغات الميدانية من الصفحات والمواقع الرسمية تلقائياً ونشرها في قسم المعلومات الرسمية.
            </p>
          </div>

          <Button
            onClick={() => void triggerOfficialSync()}
            disabled={syncing}
            className="shrink-0 bg-algeria-green hover:bg-algeria-green/90 text-white font-bold"
          >
            <RotateCw className={`size-4 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "جارٍ سحب البيانات..." : "مزامنة المصادر الرسمية الآن"}</span>
          </Button>
        </div>

        {syncResult && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-algeria-green/10 p-2.5 text-xs font-semibold text-algeria-green">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{syncResult}</span>
          </div>
        )}

        {/* Source Channels Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_ALGERIAN_SOURCES.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="size-4 text-algeria-green shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-foreground truncate">{source.badgeNameAr}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{source.name}</p>
                </div>
              </div>
              <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                نشط
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Posts Management Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold">منشورات وتقارير الميدان</h2>
          <p className="text-xs text-muted-foreground">
            مقالات وتقارير تفصيلية ينشرها فريق التنسيق للمنصة.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm"><Plus className="size-4" /> خبر جديد</Button>} />
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>نشر خبر جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5">العنوان</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
              </div>
              <div>
                <Label className="mb-1.5">مقدمة قصيرة (اختياري)</Label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={400}
                  rows={2}
                />
              </div>
              <div>
                <Label className="mb-1.5">نص الخبر</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={9}
                  placeholder="اترك سطرًا فارغًا بين كل فقرة وأخرى."
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={publish} onCheckedChange={(v) => setPublish(Boolean(v))} />
                نشر مباشرة (أزل التحديد لحفظه كمسودة)
              </label>
              <DialogFooter>
                <Button onClick={() => void submit()} disabled={submitting} className="w-full">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {publish ? "نشر" : "حفظ كمسودة"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="لا توجد أخبار بعد" description="انشر أول خبر للمنصة." />
      ) : (
        <div className="space-y-2.5">
          {posts.map((p) => (
            <Card key={p.id} className={p.is_published ? "" : "opacity-70"}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-tight">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.is_published ? "منشور" : "مسودة"}
                    {p.published_at ? ` · ${relativeTimeAr(p.published_at)}` : ""}
                    {p.author_name ? ` · ${p.author_name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {p.is_published && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="عرض"
                      render={<Link href={`/news/${p.slug}`} target="_blank" />}
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={p.is_published ? "إلغاء النشر" : "نشر"}
                    onClick={() =>
                      startTransition(async () => {
                        const res = await togglePostPublished(p.id, !p.is_published);
                        if (!res.success) toast.error(res.error ?? "حدث خطأ");
                      })
                    }
                  >
                    {p.is_published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="حذف"
                    onClick={() => setPendingDelete(p)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الخبر؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيُحذف &quot;{pendingDelete?.title}&quot; نهائيًا. لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const target = pendingDelete;
                setPendingDelete(null);
                if (!target) return;
                startTransition(async () => {
                  const res = await deletePost(target.id);
                  if (!res.success) toast.error(res.error ?? "حدث خطأ");
                  else toast.success("تم الحذف");
                });
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
