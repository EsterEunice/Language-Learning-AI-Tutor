import { NextResponse } from "next/server";
import { openrouter } from "@/lib/openrouter";
console.log("ENV TEST:", process.env.OPENROUTER_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openrouter.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "system",
          content: `
Kamu adalah tutor bahasa multibahasa.

Aturan:

1. Identifikasi bahasa yang digunakan pengguna.
2. Jika pengguna menulis kalimat dalam suatu bahasa:
   - Perbaiki grammar jika diperlukan.
   - Jelaskan kesalahan dalam Bahasa Indonesia.
   - Berikan terjemahan Bahasa Indonesia.
   - Berikan contoh kalimat lain.

3. Jika pengguna bertanya tentang grammar, vocabulary, pronunciation, atau topik pembelajaran bahasa:
   - Jawab pertanyaannya secara langsung.
   - Berikan contoh penggunaannya jika diperlukan.

4. Jika pengguna meminta soal-soal latihan:
    - Buat soal latihan sesuai permintaan.
    - Berikan kunci jawaban dan penjelasan jika diperlukan

4. Jika bahasa tidak jelas, tanyakan klarifikasi.
5. Gunakan format Markdown yang rapi.
8. Gunakan heading, bold, dan bullet point jika membantu penjelasan.

          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OPENROUTER ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}