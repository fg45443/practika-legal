"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; fullName: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "civil",
    status: "open",
    clientId: "",
  });

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/cases");
      router.refresh();
    } else {
      alert("Ошибка");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <Link href="/cases" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Назад к делам
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Новое дело</h1>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Название *</label>
          <input
            className="input"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Описание</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Клиент *</label>
          <select
            className="input"
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          >
            <option value="">Выберите клиента</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Тип</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="civil">Гражданское</option>
              <option value="criminal">Уголовное</option>
              <option value="administrative">Административное</option>
              <option value="family">Семейное</option>
              <option value="labor">Трудовое</option>
            </select>
          </div>
          <div>
            <label className="label">Статус</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="open">Открыто</option>
              <option value="in_progress">В работе</option>
              <option value="closed">Закрыто</option>
              <option value="won">Выиграно</option>
              <option value="lost">Проиграно</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Создание..." : "Создать дело"}
          </button>
          <Link href="/cases" className="btn-secondary">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
