// /api/create-chat

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_Key, file_name } = body;

    await loadS3IntoPinecone(file_Key);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_Key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_Key),
        userId,
      })
      .returning({
        insertingId: chats.id,
      });

    return NextResponse.json({
      chat_id: chat_id[0].insertingId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
