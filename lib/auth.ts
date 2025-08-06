import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret');

export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}


export async function getAuthUser(req: Request): Promise<{ id: number, role: string }> {
  const cookie = req.headers.get("cookie");
  const token = cookie?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await verifyToken(token) as { id: number; role: string };
    return user;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
