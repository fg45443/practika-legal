import { prisma } from "@/lib/prisma";
import { formatDate, CASE_STATUSES, HEARING_RESULTS } from "@/lib/utils";
import { Users, Briefcase, FileText, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clientsCount, casesCount, docsCount, hearingsCount, recentCases, upcomingHearings] =
    await Promise.all([
      prisma.client.count(),
      prisma.case.count(),
      prisma.document.count(),
      prisma.hearing.count(),
      prisma.case.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { client: true },
      }),
      prisma.hearing.findMany({
        where: { date: { gte: new Date() } },
        take: 5,
        orderBy: { date: "asc" },
        include: { case: true },
      }),
    ]);

  const stats = [
    { label: "Клиенты", value: clientsCount, icon: Users, href: "/clients", color: "bg-blue-500" },
    { label: "Дела", value: casesCount, icon: Briefcase, href: "/cases", color: "bg-indigo-500" },
    { label: "Документы", value: docsCount, icon: FileText, href: "/documents", color: "bg-emerald-500" },
    { label: "Заседания", value: hearingsCount, icon: Calendar, href: "/hearings", color: "bg-amber-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-500">Обзор системы юридической фирмы</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent cases */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Последние дела
            </h2>
            <Link href="/cases" className="text-sm text-primary-600 hover:underline">
              Все дела →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCases.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Нет дел</p>
            )}
            {recentCases.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.client.fullName}</p>
                </div>
                <span className={`badge ml-3 shrink-0 ${CASE_STATUSES[c.status]?.color || ""}`}>
                  {CASE_STATUSES[c.status]?.label || c.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming hearings */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Ближайшие заседания
            </h2>
            <Link href="/hearings" className="text-sm text-primary-600 hover:underline">
              Все →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingHearings.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Нет предстоящих заседаний</p>
            )}
            {upcomingHearings.map((h) => (
              <div key={h.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{h.case.title}</p>
                  <span className={`badge ${HEARING_RESULTS[h.result || "pending"]?.color}`}>
                    {HEARING_RESULTS[h.result || "pending"]?.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {formatDate(h.date)} · {h.court}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
