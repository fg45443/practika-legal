import { NextRequest, NextResponse } from "next/server";
import { getSessionOrFirstUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cases = await prisma.case.findMany({
    orderBy: { updatedAt: "desc" },
    include: { client: true, lawyer: true },
  });
  return NextResponse.json(cases);
}

export async function POST(req: NextRequest) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const newCase = await prisma.case.create({
    data: {
      title: body.title,
      description: body.description || null,
      type: body.type || "civil",
      status: body.status || "open",
      clientId: body.clientId,
      lawyerId: (session.user as any).id,
    },
  });
  return NextResponse.json(newCase, { status: 201 });
}
