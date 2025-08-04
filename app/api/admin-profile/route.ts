import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";


// Handle GET request – fetch admin profile details
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
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const profile = await prisma.account_profiles.findFirst({
        where: { account_id: accountId },
    });

    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
}

// Handle POST request – update admin profile
export async function POST(req: Request) {
    console.log("Entered here.........");
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];

    if (!token) {
        console.log("returned from here");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let accountId;
    try {
        const payload = await verifyToken(token) as { id: number };
        accountId = payload.id;
    } catch (err) {
        console.log("returned from here 22", err);

        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();

    const profile = await prisma.account_profiles.findFirst({ where: { account_id: accountId } });

    if (!profile) {
        console.log("returned from here333");

        return NextResponse.json({ error: "Profile not found" }, { status: 400 });
    }

    if (!data.full_name || !data.phone || !data.address || !data.country || !data.state || !data.city || !data.postal_code) {
        console.log("returned from here444");

        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    console.log("no issues till here.....");

    await prisma.account_profiles.update({
        where: { id: profile.id },
        data: {
            full_name: data.full_name,
            phone: data.phone,
            address: data.address,
            country: data.country,
            state: data.state,
            city: data.city,
            postal_code: data.postal_code,
            profile_image: data.profile_image,
        },
    });

    return NextResponse.json({ success: true });
}

