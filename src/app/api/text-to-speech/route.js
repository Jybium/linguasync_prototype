import { NextResponse } from "next/server";
import textToSpeechHelper from "../helpers/texttospeech";

export async function POST(req, res) {
  const {text} = (await req.json()) || "Hello, world!";
  const outputFilename = `./public/audio/${Date.now()}.mp3`;

  try {
    await textToSpeechHelper(text, NextResponse);
    return NextResponse.json(
      {
        message: "Text-to-speech conversion successful",
        audioFile: outputFilename,
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
