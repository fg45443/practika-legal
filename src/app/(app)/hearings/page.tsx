import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { HEARING_RESULTS, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HearingsPage() {
  const hearings = await prisma.hearing.findMany({
    orderBy: { date: "desc" },
    include: { case: { include: { client: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Судебные заседания</h1>
          <p className="text-gray-500">Календарь заседаний по делам</p>
        </div>
        <Link href="/hearings/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Добавить заседание
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Дата и время</th>
              <th className="px-5 py-3 font-medium">Суд</th>
              <th className="px-5 py-3 font-medium">Дело</th>
              <th className="px-5 py-3 font-medium">Клиент</th>
              <th className="px-5 py-3 font-medium">Результат</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {hearings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                  Заседаний пока нет
                </td>
              </tr>
            )}
            {hearings.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">
                  {formatDateTime(h.date)}
                </td>
                <td className="px-5 py-3 text-gray-600">{h.court}</td>
                <td className="px-5 py-3">
                  <Link href={`/cases/${h.caseId}`} className="text-primary-600 hover:underline">
                    {h.case.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-600">{h.case.client.fullName}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${HEARING_RESULTS[h.result || "pending"]?.color}`}>
                    {HEARING_RESULTS[h.result || "pending"]?.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
