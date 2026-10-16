import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DOC_TYPES, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { case: { include: { client: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Документы</h1>
          <p className="text-gray-500">Все документы по делам</p>
        </div>
        <Link href="/documents/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Добавить документ
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Название</th>
              <th className="px-5 py-3 font-medium">Тип</th>
              <th className="px-5 py-3 font-medium">Дело</th>
              <th className="px-5 py-3 font-medium">Клиент</th>
              <th className="px-5 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                  Документов пока нет
                </td>
              </tr>
            )}
            {documents.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{d.title}</td>
                <td className="px-5 py-3">
                  <span className="badge bg-gray-100 text-gray-700">
                    {DOC_TYPES[d.type] || d.type}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/cases/${d.caseId}`} className="text-primary-600 hover:underline">
                    {d.case.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-600">{d.case.client.fullName}</td>
                <td className="px-5 py-3 text-gray-500">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
