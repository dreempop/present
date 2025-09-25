import { createClient } from '@supabase/supabase-js';

// ใช้ service role key สำหรับ server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const POST = async (req) => {
  try {
    // รับข้อมูลเป็น multipart/form-data
    // Next.js 13 (app directory) ยังไม่มี body parsing multipart โดยตรง
    // ต้องใช้ third-party เช่น 'formidable' หรือ 'busboy'
    // แต่ตัวอย่างนี้จะใช้ Blob + FormData สมมติส่ง base64 แทนเพื่อความง่าย (ใน production แนะนำใช้ middleware แยก)

    const formData = await req.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const date = formData.get('date');
    const file = formData.get('file'); // File object

    if (!title || !description || !date || !file) {
      return new Response(JSON.stringify({ error: 'ข้อมูลไม่ครบ' }), { status: 400 });
    }

    // สร้างชื่อไฟล์
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    // อ่านไฟล์เป็น ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // อัปโหลดไฟล์
    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    // สร้าง public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    // บันทึกข้อมูลลงตาราง gallery
    const { error: dbError } = await supabase
      .from('gallery')
      .insert({
        title,
        description,
        date,
        path: filePath,
        public_url: publicUrl,
      });

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'อัปโหลดสำเร็จ', publicUrl }), { status: 200 });

  } catch (error) {
    console.error('API upload error:', error);
    return new Response(JSON.stringify({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' }), { status: 500 });
  }
};
