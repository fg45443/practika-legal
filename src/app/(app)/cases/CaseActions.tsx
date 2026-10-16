"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function CaseActions({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Удалить дело и все связанные документы/заседания?")) return;
    await fetch(`/api/cases/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
      title="Удалить"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
