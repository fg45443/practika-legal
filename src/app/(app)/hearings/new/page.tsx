"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function NewHearingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCase = searchParams.get("caseId") || "";

  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<{ id: string; title: string }[]>([]);
  const [form, setForm] = useState({
    date: "",
    court: "",
    result: "pending",
    caseId: preselectedCase,
    notes: "",
  });

  useEffect(() => {
    fetch("/api/cases")
      .then((r) => r.json())
      .then(setCases)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/hearings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push(form.caseId ? `/cases/${form.caseId}` : "/hearings");
      router.refresh();
    } else {
      alert("Ошибка");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <Link href="/hearings" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Новое заседание</h1>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Дело *</label>
          <select
            className="input"
            required
            value={form.caseId}
            onChange={(e) => setForm({ ...form, caseId: e.target.value })}
          >
            <option value="">Выберите дело</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Дата и время *</label>
          <input
            type="datetime-local"
            className="input"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Суд *</label>
          <input
            className="input"
            required
            placeholder="Например: Арбитражный суд г. Москвы"
            value={form.court}
            onChange={(e) => setForm({ ...form, court: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Результат</label>
          <select
            className="input"
            value={form.result}
            onChange={(e) => setForm({ ...form, result: e.target.value })}
          >
            <option value="pending">Ожидается</option>
            <option value="won">Выиграно</option>
            <option value="lost">Проиграно</option>
            <option value="postponed">Отложено</option>
            <option value="settled">Мировое соглашение</option>
          </select>
        </div>
        <div>
          <label className="label">Заметки</label>
          <textarea
            className="input"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Сохранение..." : "Добавить"}
          </button>
          <Link href="/hearings" className="btn-secondary">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function NewHearingPage() {
  return (
    <Suspense>
      <NewHearingForm />
    </Suspense>
  );
}
