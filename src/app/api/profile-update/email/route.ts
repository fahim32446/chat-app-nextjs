import { auth } from '@/auth';
import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface IBody {
  email: string;
  password: string;
}

export const PUT = auth(async (req: NextRequest & { auth: Session | null }) =>
  handleRequest(async () => {
    const userId = req?.auth?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { email, password } = (await req.json()) as IBody;

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing Email or Password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'No user found with this email' }, { status: 400 });
    }

    const isPasswordCorrect = bcrypt.compareSync(String(password), user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Wrong password' }, { status: 400 });
    }

    const isEmailSame = user.email === email;

    if (isEmailSame) {
      await prisma.user.update({
        where: { id: userId },
        data: { email },
      });
    }

    return NextResponse.json({ message: 'Email has been changed', status: 201 }, { status: 201 });
  })
);
