import { saltAndHashPassword } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'TEST',
        email: 'test@gmail.com',
        password: '123456',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await saltAndHashPassword(password),
      },
    });

    return NextResponse.json({ data: { name: user.name, email: user.email }, status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
