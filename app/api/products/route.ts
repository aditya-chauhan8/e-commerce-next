import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

//Create a new product

export async function POST(req: Request) {

    let user;
    try {
        user = await getAuthUser(req);
    } catch (err: any) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 })
    }

    if (user.role !== 'admin' && user.role !== "vendor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json();

    try {

        const product = await prisma.products.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                stock: body.stock,
                status: body.status || 'active',
                vendor_id: user.role === 'vendor' ? user.id : body.vendor_id ?? null,
                category_id: body.category_id,
                product_images: {
                    create: body.imageUrls?.map((url: string) => ({ image_url: url })) || [],
                },
            },
            include: {
                product_images: true
            },
        });
        return NextResponse.json(product, { status: 201 });

    } catch (err) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

}

// Get all products

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vendorIdParam = searchParams.get("vendor_id");
  const status = searchParams.get("status");

  let user;
  try {
    user = await getAuthUser(req);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }

  let whereClause: any = {
    ...(status && { status }),
  };

  if (user.role === "admin") {
    if (vendorIdParam) {
      whereClause.vendor_id = Number(vendorIdParam);
    }
  } else if (user.role === "vendor") {
    whereClause.vendor_id = user.id;
  } else if (user.role === "buyer") {
    whereClause.status = "active"; // only show public listings
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const products = await prisma.products.findMany({
      where: whereClause,
      include: {
        product_images: true,
        categories: true,
        accounts: {
          select: {
            id: true,
            role: true,
            account_profiles: {
              select: {
                full_name: true
              }
            }
          }
        }
      },
      orderBy: { created_at: "desc" }
    });
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


