import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import {
  CASE_STATUSES,
  CASE_TYPES,
  DOC_TYPES,
  HEARING_RESULTS,
  formatDate,
  formatDateTime,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await prisma.case.findUnique({
    where: { id },
    include: {
      client: true,
      lawyer: true,
      documents: { orderBy: { createdAt: "desc" } },
      hearings: { orderBy: { date: "desc" } },
    },
  });

  if (!c) notFound();

  return (
    <div>
      <Link
        href="/cases"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Назад к делам
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{c.title}</h1>
          <p className="mt-1 text-gray-500">{c.description || "Без описания"}</p>
        </div>
        <span className={`badge text-sm ${CASE_STATUSES[c.status]?.color}`}>
          {CASE_STATUSES[c.status]?.label}
        </span>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Клиент</p>
          <p className="font-medium">{c.client.fullName}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Тип дела</p>
          <p className="font-medium">{CASE_TYPES[c.type] || c.type}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Юрист</p>
          <p className="font-medium">{c.lawyer?.name || "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Дата открытия</p>
          <p className="font-medium">{formatDate(c.openedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Documents */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" /> Документы ({c.documents.length})
            </h2>
            <Link href={`/documents/new?caseId=${c.id}`} className="text-sm text-primary-600 hover:underline">
              + Добавить
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {c.documents.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-gray-400">Нет документов</p>
            )}
            {c.documents.map((d) => (
              <div key={d.id} className="px-5 py-3">
                <p className="text-sm font-medium">{d.title}</p>
                <p className="text-xs text-gray-500">
                  {DOC_TYPES[d.type] || d.type} · {formatDate(d.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hearings */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Заседания ({c.hearings.length})
            </h2>
            <Link href={`/hearings/new?caseId=${c.id}`} className="text-sm text-primary-600 hover:underline">
              + Добавить
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {c.hearings.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-gray-400">Нет заседаний</p>
            )}
            {c.hearings.map((h) => (
              <div key={h.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{formatDateTime(h.date)}</p>
                  <span className={`badge ${HEARING_RESULTS[h.result || "pending"]?.color}`}>
                    {HEARING_RESULTS[h.result || "pending"]?.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{h.court}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
