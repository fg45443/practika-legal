import { NextRequest, NextResponse } from "next/server";
import { getSessionOrFirstUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const hearing = await prisma.hearing.create({
    data: {
      date: new Date(body.date),
      court: body.court,
      result: body.result || "pending",
      caseId: body.caseId,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(hearing, { status: 201 });
}
