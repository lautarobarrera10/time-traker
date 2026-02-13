import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

  const category = await prisma.category.updateMany({
    where: { id: parseInt(id), userId },
    data: { name: name.trim() },
  });

  if (category.count === 0) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  return NextResponse.json({ success: true });
}
