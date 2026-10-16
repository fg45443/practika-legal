import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CLIENT_TYPES, CASE_STATUSES, CASE_TYPES, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      cases: {
        orderBy: { updatedAt: "desc" },
        include: { lawyer: true },
      },
    },
  });

  if (!client) notFound();

  return (
    <div>
      <Link
        href="/clients"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Назад к клиентам
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{client.fullName}</h1>
        <p className="text-gray-500">
          {CLIENT_TYPES[client.type] || client.type}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Телефон</p>
          <p className="font-medium">{client.phone || "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Email</p>
          <p className="font-medium">{client.email || "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Добавлен</p>
          <p className="font-medium">{formatDate(client.createdAt)}</p>
        </div>
      </div>

      {client.notes && (
        <div className="card mb-8 p-5">
          <p className="text-xs text-gray-500 mb-1">Заметки</p>
          <p className="text-sm">{client.notes}</p>
        </div>
      )}

      <div className="card">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold">Дела клиента ({client.cases.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {client.cases.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Нет дел</p>
          )}
          {client.cases.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{c.title}</p>
                <p className="text-xs text-gray-500">
                  {CASE_TYPES[c.type]} · {c.lawyer?.name || "Без юриста"}
                </p>
              </div>
              <span className={`badge ${CASE_STATUSES[c.status]?.color}`}>
                {CASE_STATUSES[c.status]?.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
