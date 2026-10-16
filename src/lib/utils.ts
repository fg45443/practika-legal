import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd.MM.yyyy", { locale: ru });
}

export function formatDateTime(date: string | Date | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd.MM.yyyy HH:mm", { locale: ru });
}

export const CASE_STATUSES: Record<string, { label: string; color: string }> = {
  open: { label: "Открыто", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "В работе", color: "bg-yellow-100 text-yellow-800" },
  closed: { label: "Закрыто", color: "bg-gray-100 text-gray-800" },
  won: { label: "Выиграно", color: "bg-green-100 text-green-800" },
  lost: { label: "Проиграно", color: "bg-red-100 text-red-800" },
};

export const CASE_TYPES: Record<string, string> = {
  civil: "Гражданское",
  criminal: "Уголовное",
  administrative: "Административное",
  family: "Семейное",
  labor: "Трудовое",
};

export const DOC_TYPES: Record<string, string> = {
  contract: "Договор",
  claim: "Иск / Заявление",
  decision: "Решение / Постановление",
  evidence: "Доказательство",
  other: "Прочее",
};

export const HEARING_RESULTS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидается", color: "bg-blue-100 text-blue-800" },
  won: { label: "Выиграно", color: "bg-green-100 text-green-800" },
  lost: { label: "Проиграно", color: "bg-red-100 text-red-800" },
  postponed: { label: "Отложено", color: "bg-yellow-100 text-yellow-800" },
  settled: { label: "Мировое", color: "bg-purple-100 text-purple-800" },
};

export const CLIENT_TYPES: Record<string, string> = {
  individual: "Физ. лицо",
  company: "Юр. лицо",
};
