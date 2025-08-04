import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.accounts.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = await generateToken({ id: user.id, role: user.role }); // Await the token

  // Role-based redirection path
  const redirectMap: Record<string, string> = {
    admin: '/admin',
    vendor: '/vendor',
    buyer: '/dashboard', 
  };

  const redirectUrl = redirectMap[user.role.toLowerCase()] || '/login';

  const res = NextResponse.json({ success: true, redirect: redirectUrl });

  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
  });

  return res;
}