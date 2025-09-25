import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // ต้องมีไฟล์นี้

export async function POST(req) {
  try {
    const chats = await req.json(); // array [{userId, sender, message}, ...]

    const { data, error } = await supabase
      .from("chat_messages")
      .insert(chats);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
