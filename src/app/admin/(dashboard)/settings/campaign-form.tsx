"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateCampaign } from "@/actions/campaign";
import type { Database } from "@/types/database";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

export function CampaignForm({ campaign }: { campaign: Campaign }) {
  const [name, setName] = useState(campaign.name);
  const [description, setDescription] = useState(campaign.description ?? "");
  const [isActive, setIsActive] = useState(campaign.is_active);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateCampaign({ id: campaign.id, name, description, is_active: isActive });
    setSubmitting(false);
    if (!res.success) toast.error(res.error ?? "حدث خطأ");
    else toast.success("تم حفظ إعدادات الحملة");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label className="mb-1.5">اسم الحملة</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label className="mb-1.5">الوصف</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
        الحملة نشطة حاليًا
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        حفظ
      </Button>
    </form>
  );
}
