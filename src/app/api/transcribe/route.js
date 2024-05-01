import { NextResponse } from "next/server";
import { SpeechClient } from "@google-cloud/speech";
import path from "path";
import wav from "node-wav";


const pathToCredentials = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain
};

const speechClient = new SpeechClient({
  credentials: pathToCredentials,
});


export async function POST(req, res) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioContent = Buffer.from(audioBuffer).toString("base64");

    const audioConfig = {
      content: audioContent,
    };

    const config = {
      // encoding: "LINEAR16",
      enable_automatic_punctuation: true,
      model: "default",
      enable_word_time_offsets: true,
      sampleRateHertz: "48000",
      languageCode: "en-US",
    };

    try {
      const [response] = await speechClient.recognize({
        audio: audioConfig,
        config,
      });

      const transcript = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      return NextResponse.json({ transcript }, { status: 200 });
    } catch (error) {
      console.error("Error processing speech-to-text:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
