import { NextRequest, NextResponse } from "next/server";
import { getSessionOrFirstUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { cases: true } } },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      fullName: body.fullName,
      phone: body.phone || null,
      email: body.email || null,
      type: body.type || "individual",
      notes: body.notes || null,
    },
  });
  return NextResponse.json(client, { status: 201 });
}
