import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pdf = await prisma.pdfFile.findUnique({ where: { id } });
    if (!pdf) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Server fetches from Cloudinary — bypasses browser-level 401 restrictions
    const cloudinaryRes = await fetch(pdf.url);

    if (!cloudinaryRes.ok) {
      console.error("[proxy] Cloudinary fetch failed:", cloudinaryRes.status, pdf.url);
      return new NextResponse(`Upstream error: ${cloudinaryRes.status}`, {
        status: 502,
      });
    }

    // Stream the PDF bytes directly to the browser
    return new NextResponse(cloudinaryRes.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${pdf.filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("[proxy] error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}