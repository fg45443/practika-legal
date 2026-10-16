import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CASE_STATUSES, CASE_TYPES, formatDate } from "@/lib/utils";
import CaseActions from "./CaseActions";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const cases = await prisma.case.findMany({
    orderBy: { updatedAt: "desc" },
    include: { client: true, lawyer: true, _count: { select: { documents: true, hearings: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дела</h1>
          <p className="text-gray-500">Все судебные и досудебные дела</p>
        </div>
        <Link href="/cases/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Новое дело
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Название</th>
              <th className="px-5 py-3 font-medium">Клиент</th>
              <th className="px-5 py-3 font-medium">Тип</th>
              <th className="px-5 py-3 font-medium">Статус</th>
              <th className="px-5 py-3 font-medium">Юрист</th>
              <th className="px-5 py-3 font-medium">Открыто</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cases.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                  Дел пока нет
                </td>
              </tr>
            )}
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <Link href={`/cases/${c.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                    {c.title}
                  </Link>
                  <div className="text-xs text-gray-400">
                    {c._count.documents} док. · {c._count.hearings} засед.
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{c.client.fullName}</td>
                <td className="px-5 py-3 text-gray-600">{CASE_TYPES[c.type] || c.type}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${CASE_STATUSES[c.status]?.color || ""}`}>
                    {CASE_STATUSES[c.status]?.label || c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{c.lawyer?.name || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{formatDate(c.openedAt)}</td>
                <td className="px-5 py-3">
                  <CaseActions id={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
