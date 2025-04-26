import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const { email, password } = await request.json();

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user?.email) {
      return NextResponse.json({ error: 'No user exists with this credentials' }, { status: 400 });
    }

    const isPasswordMatch = await bcrypt.compareSync(String(password), user?.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = jwt.sign({ id: user?.id, email: user?.email }, process.env.AUTH_SECRET!, {
      expiresIn: '1h',
    });

    return NextResponse.json({
      status: 200,
      data: { id: user.id, name: user?.name, email: user?.email, image: user?.imageUrl, token },
    });
  });
}
