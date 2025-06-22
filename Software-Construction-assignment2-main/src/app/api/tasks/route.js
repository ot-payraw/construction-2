import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const tasks = await prisma.task.findMany();
  return Response.json(tasks);
}

export async function POST(req) {
  const data = await req.json();
  const { title, description, dueDate, userId } = data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      userId
    }
  });

  return Response.json(task);
}