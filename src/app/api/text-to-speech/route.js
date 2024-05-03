import textToSpeechHelper from "./helper";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
    return;
  }

  const { text, lang } = await req.json();

  try {
    const data = await textToSpeechHelper(text, lang);
    const responseData = data?.data;
    return NextResponse.json(
      {
        data,
        responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Text-to-speech conversion failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
