import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pdfs = await prisma.pdfFile.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pdfs);
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}
