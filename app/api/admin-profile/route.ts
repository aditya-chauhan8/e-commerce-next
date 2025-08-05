import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";


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
        include: {
            accounts: {
                select: {
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...profile,
        email: profile.accounts?.email,
        role: profile.accounts?.role,
    });
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

    const formData = await req.formData();

    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get('address') as string;
    const country = formData.get('country') as string;
    const state = formData.get('state') as string;
    const city = formData.get('city') as string;
    const postal_code = formData.get('postal_code') as string;
    const file = formData.get('profile_image') as File | null;

    if (!full_name || !phone || !address || !country || !state || !city || !postal_code) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }


    const profile = await prisma.account_profiles.findFirst({ where: { account_id: accountId } });

    if (!profile) {
        console.log("returned from here333");

        return NextResponse.json({ error: "Profile not found" }, { status: 400 });
    }

    // if (!data.full_name || !data.phone || !data.address || !data.country || !data.state || !data.city || !data.postal_code) {
    //     console.log("returned from here444");

    //     return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    // }

    let imageFileName = profile.profile_image || "";


    if (file && typeof file.name === "string") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // ✅ Check and create folder if not exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = file.name.split('.').pop();
        imageFileName = `profile-${Date.now()}.${ext}`;
        const uploadPath = path.join(uploadDir, imageFileName);

        await writeFile(uploadPath, buffer);
    }

    console.log("no issues till here.....");

    await prisma.account_profiles.update({
        where: { id: profile.id },
        data: {
            full_name,
            phone,
            address,
            country,
            state,
            city,
            postal_code,
            profile_image: imageFileName,
        },
    });

    return NextResponse.json({ success: true });
}

