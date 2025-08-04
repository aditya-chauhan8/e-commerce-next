import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const allowedRoles = ["admin", "buyer", "vendor"];

export async function POST(req: Request) {
    try {
        console.log("📥 Incoming POST request");

        const data = await req.json();
        console.log("✅ Request body parsed:", data);

        // Validation
        if (!data.email || !data.password || !data.full_name) {
            console.log("❌ Missing required fields");
            return NextResponse.json({ error: "Required fields: email, password, full_name" }, { status: 400 });
        }

        if (!allowedRoles.includes(data.role)) {
            console.log("❌ Invalid role:", data.role);
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
            console.log("❌ Invalid email format:", data.email);
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        if (data.password.length < 6) {
            console.log("❌ Password too short");
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        console.log("🔍 Checking for existing user");
        const existing = await prisma.accounts.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            console.log("❌ Email already exists:", data.email);
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        console.log("🔐 Hashing password");
        const hashedPassword = await bcrypt.hash(data.password, 10);

        console.log("🧾 Creating account");
        const account = await prisma.accounts.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
                status: "active",
            },
        });

        console.log("👤 Creating account profile");
        await prisma.account_profiles.create({
            data: {
                account_id: account.id,
                full_name: data.full_name,
                phone: data.phone || "",
                address: data.address || "",
                country: data.country || "",
                state: data.state || "",
                city: data.city || "",
                postal_code: data.postal_code || "",
                profile_image: data.profile_image || "",
            },
        });

        console.log("✅ Account created successfully");
        return NextResponse.json({ message: "Account created successfully" }, { status: 201 });

    } catch (error) {
        console.error("💥 Internal server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
