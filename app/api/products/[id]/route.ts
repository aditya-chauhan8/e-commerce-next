// Get a single product by ID

import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get a product by ID

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.products.findUnique({
            where: { id: Number(params.id) },
            include: {
                product_images: true,
                categories: true,
                accounts: {
                    select: {
                        id: true,
                        role: true,
                        account_profiles: { select: { full_name: true } },
                    }
                }
            }
        });
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json(product, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// Edit a product by ID

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    let user;
    try {
        user = await getAuthUser(req);
    } catch (err) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 })
    }

    const productId = Number(params.id);
    const body = await req.json();

    try {
        const existingProduct = await prisma.products.findUnique({ where: { id: productId } });
        if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 })

        if (user.role !== 'admin' && user.id !== existingProduct.vendor_id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.products.update({
            where: { id: productId },
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                stock: body.stock,
                status: body.status,
                category_id: body.category_id,
                updated_at: new Date(),
            },
        });
        return NextResponse.json(updated, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// Delete a product by ID

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    let user;
    try {
        user = await getAuthUser(req);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }

    const productId = Number(params.id);

    try {
        const existingProduct = await prisma.products.findUnique({ where: { id: productId } });
        if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        if (user.role !== "admin" && user.id !== existingProduct.vendor_id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.products.delete({ where: { id: productId } });
        return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting product:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}