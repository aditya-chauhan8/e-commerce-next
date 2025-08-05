import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// Update Vendor

export async function PUT(req: Response, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const data = await req.json();


    try {
        await prisma.accounts.update({
            where: { id },
            data: {
                email: data.email,
                status: data.status,
                account_profiles: {
                    update: {
                        where: { account_id: id },
                        data: {
                            full_name: data.full_name,
                            phone: data.phone,
                        }
                    }
                }
            }
        });
        return NextResponse.json({ message: "Vendor updated successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error fetching vendors:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

// DELETE vendor

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    try {

        await prisma.account_profiles.delete({ where: { account_id: id } });
        await prisma.accounts.delete({ where: { id } });
        return NextResponse.json({ message: "Vender deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting vendor:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}