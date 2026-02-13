import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const logs = await prisma.timeLog.findMany({
    where: { userId },
    select: {
      id: true,
      hours: true,
      date: true,
      categoryId: true,
      taskId: true,
      category: { select: { name: true } },
      task: { select: { name: true } },
    },
    orderBy: { id: "desc" },
    take: 50,
  });

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { hours, categoryId, taskId } = await req.json();
  if (hours == null || !categoryId || !taskId) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Verificar pertenencia
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });

  const log = await prisma.timeLog.create({
    data: {
      hours: parseFloat(hours.toFixed(2)),
      userId,
      categoryId,
      taskId,
    },
    include: {
      category: { select: { name: true } },
      task: { select: { name: true } },
    },
  });

  return NextResponse.json(log, { status: 201 });
}
