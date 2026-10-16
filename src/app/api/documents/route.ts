import { NextRequest, NextResponse } from "next/server";
import { getSessionOrFirstUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSessionOrFirstUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const doc = await prisma.document.create({
    data: {
      title: body.title,
      type: body.type || "other",
      caseId: body.caseId,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(doc, { status: 201 });
}
