import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, User } from "lucide-react";
import { getPostBySlug } from "@/lib/data/public";
import { decodeSlug } from "@/lib/url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decodeSlug(slug));
  if (!post) return { title: "الخبر غير موجود" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, type: "article" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeSlug(slug));
  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Intl.DateTimeFormat("ar-DZ", { dateStyle: "long" }).format(new Date(post.published_at))
    : null;

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> كل الأخبار
      </Link>

      <h1 className="text-3xl font-extrabold leading-tight">{post.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {publishedDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" /> {publishedDate}
          </span>
        )}
        {post.author_name && (
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" /> {post.author_name}
          </span>
        )}
      </div>

      {post.excerpt && (
        <p className="mt-5 border-s-4 border-algeria-green/40 ps-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      )}

      {/* النص يُعرض كفقرات نصية عادية — لا HTML من المستخدم، تفاديًا لأي XSS */}
      <div className="mt-6 space-y-4 leading-relaxed">
        {post.body
          .split(/\n{2,}/)
          .map((para, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {para}
            </p>
          ))}
      </div>
    </article>
  );
}
