import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string || file.name;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "allianz-pdfs",
          public_id: `pdf_${nanoid(10)}.pdf`,   // include .pdf so raw URL has the extension
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Save metadata to Prisma
    const pdfFile = await prisma.pdfFile.create({
      data: {
        title: title,
        filename: file.name,
        url: uploadResult.secure_url,
        size: file.size,
        publicId: uploadResult.public_id,
      },
    });

    return NextResponse.json(pdfFile);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
