import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = params;
  const data = await req.json();
  const { title, description, dueDate, status } = data;

  const updatedTask = await prisma.task.update({
    where: { id: Number(id) },
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      status,
    },
  });

  return Response.json(updatedTask);
}

export async function DELETE(req, { params }) {
  const { id } = params;

  await prisma.task.delete({
    where: { id: Number(id) },
  });

  return new Response(null, { status: 204 });
}
