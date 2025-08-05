import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET all vendors
export async function GET(req: Request) {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let accountId;
    try {
        const payload = await verifyToken(token) as { id: number };
        accountId = payload.id;
    } catch (err) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    try {
        const vendors = await prisma.accounts.findMany({
            where: { role: "vendor" },
            include: {
                account_profiles: true,
            },
            orderBy: { created_at: "desc" },
        });
        return NextResponse.json( vendors , { status: 200 });

    } catch (err) {
        console.error("Error fetching vendors:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

