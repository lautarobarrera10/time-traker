import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/session";

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, categoryId } = await req.json();
  if (!name?.trim() || !categoryId) {
    return NextResponse.json({ error: "Nombre y categoría requeridos" }, { status: 400 });
  }

  // Verificar que la categoría pertenece al usuario
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });

  const task = await prisma.task.create({
    data: { name: name.trim(), categoryId },
  });

  return NextResponse.json(task, { status: 201 });
}
