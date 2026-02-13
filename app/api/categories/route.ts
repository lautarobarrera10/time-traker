import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { userId },
    include: { tasks: { select: { id: true, name: true } } },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

  const category = await prisma.category.create({
    data: { name: name.trim(), userId },
    include: { tasks: { select: { id: true, name: true } } },
  });

  return NextResponse.json(category, { status: 201 });
}
