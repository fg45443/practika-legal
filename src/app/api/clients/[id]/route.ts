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
  const client = await prisma.client.findUnique({
    where: { id },
    include: { cases: { include: { lawyer: true } } },
  });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
