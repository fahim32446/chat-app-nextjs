import { auth } from '@/auth';
import { handleRequest, saltAndHashPassword } from '@/lib/helper';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

interface IBody {
  newPassword: string;
  currentPassword: string;
}

export const PUT = async (req: NextRequest) =>
  handleRequest(async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let body: IBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing current or new password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
    }

    const hashedNewPassword = await saltAndHashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({
      message: 'Password has been updated successfully',
      status: 200,
    });
  });
