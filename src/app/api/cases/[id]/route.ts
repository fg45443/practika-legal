import { NextRequest, NextResponse } from "next/server";
import { getSessionOrFirstUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const c = await prisma.case.findUnique({
    where: { id },
    include: {
      client: true,
      lawyer: true,
      documents: { orderBy: { createdAt: "desc" } },
      hearings: { orderBy: { date: "desc" } },
    },
  });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.case.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
