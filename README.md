# هبة الجزائر

منصة جزائرية لتنسيق المساعدات والإغاثة، تربط بين المتبرعين ونقاط التجميع ووسائل النقل ومراكز الاستقبال والأسر المتضررة — لا لجمع التبرعات المالية، بل لتنظيم المساعدات العينية ومنع الفوضى والتكرار والهدر.

**الفكرة الأساسية:** اعرف ما هو مطلوب فعليًا، ثم وجّه مساعدتك إليه.

الحملة النشطة حاليًا داخل المنصة: **حرائق الشمال الشرقي 2026** — تغطي ولايات **جيجل، بجاية، ميلة، سكيكدة**. تصميم قاعدة البيانات مبني حول مفهوم "حملة" (`campaigns`) بحيث يمكن لاحقًا إضافة حملات أخرى (ولايات أخرى، فيضانات، زلازل...) دون تغيير البنية.

> A Next.js + Supabase platform for coordinating in-kind disaster relief (not fundraising) — matching donors, transporters, collection points, relief hubs, and affected families for the 2026 north-east Algeria wildfires (Jijel, Béjaïa, Mila, Skikda). The schema is campaign-agnostic so future disasters/regions can be added without restructuring.

---

## المحتويات

- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [البنية المعمارية](#البنية-المعمارية)
- [التشغيل محليًا](#التشغيل-محليًا)
- [إعداد Supabase](#إعداد-supabase)
- [Migrations وقاعدة البيانات](#migrations-وقاعدة-البيانات)
- [البيانات التجريبية (Seed)](#البيانات-التجريبية-seed)
- [إنشاء أول حساب أدمن](#إنشاء-أول-حساب-أدمن)
- [متغيرات البيئة](#متغيرات-البيئة)
- [الأمان و RLS](#الأمان-و-rls)
- [النشر (Deployment)](#النشر-deployment)
- [ما تم تنفيذه](#ما-تم-تنفيذه) و [ما تبقى](#ما-تبقى)

---

## التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| الإطار | Next.js 16 (App Router) + TypeScript |
| قاعدة البيانات | Supabase (PostgreSQL + Auth + Storage + RLS) |
| التصميم | Tailwind CSS v4 + shadcn/ui |
| الخط | Vazirmatn (عربي بالكامل، RTL) |
| النماذج | React Hook Form + Zod |
| الخريطة | MapLibre GL + OpenStreetMap (بدون أي مفتاح API مدفوع) |
| الأيقونات | Lucide |

لا يوجد backend منفصل: كل شيء Next.js (Server Components + Server Actions) يتحدث مباشرة مع Supabase.

## البنية المعمارية

```
src/
  app/
    (site)/          الصفحات العامة (الرئيسية، الاحتياجات، التبرع، النقل، المساعدة، الخريطة...)
    admin/
      login/          تسجيل دخول فرق التنسيق
      (dashboard)/    لوحة الإدارة الكاملة (محمية بـ middleware + فحص الدور)
  actions/            Server Actions (كل الكتابة إلى قاعدة البيانات تمر من هنا)
  components/
    ui/               مكوّنات shadcn/ui الأساسية
    shared/            بطاقات، شارات حالة/أولوية/تحقق، مكوّنات عامة
    layout/            Header, Footer, Sidebar, Mobile Nav
    map/               مكوّن الخريطة (MapLibre)
    admin/             مكوّنات لوحة التحكم (InlineSelect وغيره)
  lib/
    supabase/          عملاء Supabase (browser, server, middleware, admin/service-role)
    data/               دوال قراءة البيانات (public.ts للعامة، admin.ts للوحة التحكم)
    constants.ts        كل الترجمات العربية للـ enums (حالات، أولويات...)
    wilayas.ts          قائمة الولايات الـ58 + حساب مسافة تقريبية (Haversine)
  services/            منطق العمل: matching, inventory, distributions, verification, priority
  schemas/             Zod schemas لكل نموذج عام
  config/site.ts        اسم المنصة والشعار — التغيير من هنا فقط
  types/database.ts     أنواع TypeScript مولَّدة من قاعدة البيانات (Supabase CLI)
supabase/
  migrations/           كل تغييرات قاعدة البيانات (DDL) بالترتيب الزمني
  seed_demo_data.sql          بيانات تجريبية للتطوير فقط (قابلة للحذف بالكامل)
  seed_demo_data_cleanup.sql  سكربت حذف البيانات التجريبية
scripts/
  create-admin.mjs             إنشاء أول حساب أدمن
  import-affected-areas.mjs    استيراد قائمة المناطق المتضررة
  affected-areas.json          البيانات المصدر للمناطق المتضررة
```

### قرارات تصميم مهمة

- **RLS هي خط الدفاع الحقيقي**، وليس فقط منطق التطبيق. كل جدول حساس (`beneficiary_requests`, `donations`, `transport_offers`...) مقفل بالكامل أمام `anon`/`authenticated` عدا سياسات إدخال محددة بدقة للنماذج العامة (`insert`-only, بدون أي صلاحية قراءة).
- **النماذج العامة لا تحتاج مفتاح خدمة (service role)**: التسجيل العام (متبرع، متضرر، سائق) يتم عبر `anon key` + سياسة RLS تسمح بـ `INSERT` فقط دون `SELECT`. مفتاح الخدمة (`SUPABASE_SERVICE_ROLE_KEY`) لا يُستخدم إلا في سكربت إنشاء الأدمن المحلي.
- **العرض العام للنقاط الحساسة** (نقاط التجميع، مراكز الاستقبال) يمر عبر دوال RPC مخصصة (`get_public_collection_points`, `get_public_relief_hubs`) تُخفي رقم الهاتف إن لم يُسمح بعرضه، بدل كشف الجدول الأصلي.
- **المخزون سجل حركات، وليس رقمًا يُعدَّل مباشرة**: كل تغيير في الكمية (وارد/صادر/تسوية/نقل) هو صف في `inventory_transactions`، و trigger في قاعدة البيانات يحدّث `inventory_items` تلقائيًا. هذا يعطي تتبعًا كاملاً لتاريخ كل مادة في كل مركز.
- **الاحتياج التلقائي**: عندما تنخفض كمية مادة في مركز استقبال تحت حدها الأدنى (`min_threshold`)، يُنشئ trigger صفًا في `needs` تلقائيًا (معلَّم بـ `is_auto_generated`)، ويُغلق تلقائيًا عند عودة الكمية لمستوى آمن.
- **المطابقة (Matching) منطق صريح في TypeScript**، وليس ذكاءً اصطناعيًا: `findMatchingNeedsForDonation`, `suggestDeliveryPoint`, `findMatchingDonationsForTransport` في `src/services/matching.ts`.

## التشغيل محليًا

```bash
npm install
cp .env.example .env.local   # ثم املأ القيم — راجع قسم "متغيرات البيئة"
npm run dev
```

افتح http://localhost:3000

## إعداد Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com) (أو استخدم مشروعًا موجودًا).
2. من `Project Settings → API` انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (سري، لا تكشفه أبدًا)
3. إذا كنت تستخدم Supabase CLI محليًا:
   ```bash
   supabase link --project-ref <project-ref>
   ```

## Migrations وقاعدة البيانات

كل تغييرات قاعدة البيانات موجودة كملفات SQL مرقّمة في `supabase/migrations/`. لا يوجد أي جدول أُنشئ يدويًا خارج هذه الملفات.

لتطبيقها على مشروع Supabase جديد:

```bash
# باستخدام Supabase CLI (الطريقة الموصى بها)
supabase db push

# أو تطبيق كل ملف يدويًا بالترتيب عبر SQL Editor في لوحة Supabase
```

الترتيب مهم (الملفات مرقّمة `0001` إلى `0019`): الإضافات والأنواع، ثم الجداول المرجعية، ثم الجداول التشغيلية، ثم RLS، ثم Views/RPC العامة، ثم بيانات مرجعية أساسية (الحملة، الفئات، الولايات — **وهذه ليست بيانات تجريبية**، بل بيانات تشغيلية ضرورية).

## البيانات التجريبية (Seed)

`supabase/seed_demo_data.sql` يحتوي على بيانات **تجريبية بالكامل** (أسماء، أرقام هواتف، كميات وهمية) لتجربة شكل المنصة أثناء التطوير فقط. كل صف فيها معلَّم بوضوح بعبارة "بيانات تجريبية".

```bash
# تطبيقها (اختياري، للتطوير فقط)
psql "$DATABASE_URL" -f supabase/seed_demo_data.sql

# حذفها بالكامل عند الانتقال إلى بيانات حقيقية
psql "$DATABASE_URL" -f supabase/seed_demo_data_cleanup.sql
```

**لا تُدخل بيانات ميدانية حقيقية (نقاط إيواء، أرقام هواتف، كميات) إلا بعد التحقق منها من مصدر موثوق.**

## إنشاء أول حساب أدمن

```bash
node scripts/create-admin.mjs admin@example.com "كلمة-مرور-قوية" "اسم المسؤول"
```

يتطلب `NEXT_PUBLIC_SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` في `.env.local`. بعدها سجّل الدخول من `/admin/login`.

لترقية مستخدم موجود إلى أدمن يدويًا عبر SQL:

```sql
update public.profiles set role = 'admin' where id = '<user-id>';
```

## متغيرات البيئة

راجع `.env.example`. الملخص:

| المتغير | مطلوب | الوصف |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | نعم | رابط مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | نعم | المفتاح العام (anon/publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | للسكربتات فقط | مفتاح الخدمة — لا يُستخدم في تشغيل الموقع العام، فقط في `scripts/create-admin.mjs` |
| `NEXT_PUBLIC_SITE_NAME` | لا | اسم المنصة المعروض (افتراضيًا "هبة الجزائر") |
| `NEXT_PUBLIC_SITE_URL` | لا | الرابط العام للمنصة (لِـ SEO/Open Graph) |
| `NEXT_PUBLIC_GA_ID` | لا | معرّف Google Analytics 4 (`G-XXXXXXXXXX`). بدونه لا يُحمَّل أي سكربت تتبّع. |

## الأمان و RLS

- كل الجداول عليها Row Level Security مفعّل.
- دوال مساعدة `is_staff()`, `is_manager()`, `is_admin()` تُستخدم داخل السياسات لتفادي التكرار وتفادي infinite recursion على جدول `profiles`.
- العامة (`anon`) يمكنهم فقط: قراءة الاحتياجات النشطة، النقاط عبر RPC آمن، الفئات/الولايات، الإحصائيات المجمَّعة، المعلومات الرسمية — و**الإدخال فقط** (بدون قراءة) في `beneficiary_requests`, `donations`, `donation_items`, `transport_offers`.
- لا يمكن للعامة أبدًا: قراءة بيانات الأسر، تعديل المخزون، تعديل/حذف مساعدات أو توزيعات، الوصول إلى أي بيانات إدارية.
- لاختبار RLS يدويًا: استخدم `anon key` في طرفية منفصلة (بدون تسجيل دخول) وحاول `select * from beneficiary_requests` — يجب أن يعيد صفًا فارغًا.

## النشر (Deployment)

المنصة جاهزة للنشر على **Vercel** مباشرة (بدون أي خادم إضافي):

1. اربط المستودع بمشروع Vercel جديد.
2. أضف متغيرات البيئة نفسها (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` إن احتجته لسكربتات لاحقة) في إعدادات المشروع على Vercel.
3. Deploy.

قاعدة البيانات (Supabase) مستضافة بشكل مستقل ولا تحتاج أي إعداد إضافي عند النشر.

## ما تم تنفيذه

- ✅ P0 كاملة: الصفحة الرئيسية، الاحتياجات، تسجيل المساعدات مع مطابقة تلقائية واقتراح نقطة تسليم، نقاط التجميع، مراكز الاستقبال، الخريطة التفاعلية، طلبات المتضررين، لوحة إدارة كاملة، المخزون بسجل حركات، التحقق، RLS.
- ✅ P1: النقل مع مطابقة المسارات، الإشعارات (جدول + RLS جاهزان)، الشفافية.
- ✅ Realtime غير مفعّل افتراضيًا (غير ضروري للـ MVP) لكن الجداول جاهزة لتفعيله لاحقًا بسهولة (`supabase.channel(...)`).

## ما تبقى

- **P2**: تكامل SMS/WhatsApp، جمعيات موثقة (`organizations`) بواجهة إدارة مخصصة (الجدول والـ RLS جاهزان، الواجهة غير مبنية بعد)، تحليلات متقدمة، route optimization حقيقي للنقل.
- **إشعارات فعلية داخل الواجهة**: جدول `notifications` و RLS جاهزان، لكن لا يوجد بعد مركز إشعارات (bell icon) في الواجهة — القيمة المضافة الآن محدودة لأن أغلب التنسيق يحدث عبر لوحة التحكم مباشرة.
- **بلديات جيجل كقائمة منسدلة**: تُركت البلدية كحقل نصي حر بدل قائمة منسدلة مُسبقة القيد، لتفادي أي قائمة غير دقيقة أو ناقصة قد تعطّل تسجيل بيانات حقيقية أثناء الطوارئ.
- **اختبارات آلية (unit/e2e)**: لم تُضف بعد؛ التحقق تم يدويًا (build, typecheck, lint, واختبار كل مسار في المتصفح).

---

مبادرة رقمية مستقلة لتنسيق التضامن — غير حكومية وغير تابعة لأي جهة رسمية.
