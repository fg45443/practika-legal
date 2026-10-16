import { redirect } from "next/navigation";
import { getSessionOrFirstUser } from "@/lib/session";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionOrFirstUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
