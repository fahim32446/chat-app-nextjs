import { handleRequest, saltAndHashPassword } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const { name, email, password } = await request.json();

    const isEmailExist = await prisma.user.findFirst({
      where: { email: email },
      select: { email: true },
    });

    if (isEmailExist?.email) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await saltAndHashPassword(password),
      },
    });

    return NextResponse.json({ data: { name: user.name, email: user.email }, status: 201 });
  });
}
