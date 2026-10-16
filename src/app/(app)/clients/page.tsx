import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { CLIENT_TYPES, formatDate } from "@/lib/utils";
import ClientActions from "./ClientActions";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { cases: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-gray-500">Управление клиентской базой</p>
        </div>
        <Link href="/clients/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Добавить клиента
        </Link>
      </div>

      <form className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Поиск по имени, email, телефону..."
            className="input pl-10"
          />
        </div>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">ФИО / Название</th>
              <th className="px-5 py-3 font-medium">Тип</th>
              <th className="px-5 py-3 font-medium">Контакты</th>
              <th className="px-5 py-3 font-medium">Дел</th>
              <th className="px-5 py-3 font-medium">Добавлен</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  Клиенты не найдены
                </td>
              </tr>
            )}
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <Link href={`/clients/${c.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                    {c.fullName}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <span className="badge bg-gray-100 text-gray-700">
                    {CLIENT_TYPES[c.type] || c.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  <div>{c.phone || "—"}</div>
                  <div className="text-xs text-gray-400">{c.email || ""}</div>
                </td>
                <td className="px-5 py-3 text-gray-600">{c._count.cases}</td>
                <td className="px-5 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
                <td className="px-5 py-3">
                  <ClientActions id={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
