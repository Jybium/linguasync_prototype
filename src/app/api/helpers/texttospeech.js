import textToSpeech from "@google-cloud/text-to-speech";
import path from "path";
import { PassThrough } from "stream";

const pathToCredentials = path.resolve("linguasync", "../credential.json");

console.log("Path to credentials:", pathToCredentials);

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: pathToCredentials,
});

const textToSpeechHelper = async (text, res) => {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  // Make the Text-to-Speech API request
  const [response] = await client.synthesizeSpeech(request);

  // Create a readable stream from the audio content
  const audioStream = new PassThrough();
  audioStream.end(Buffer.from(response.audioContent, "binary"));

  // Set the response headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Content-Type", "audio/mpeg");
    requestHeaders.set(
      "Content-Disposition",
      "attachment; filename=speech.mp3"
    );

  // Stream the audio content to the response
  audioStream.pipe(res);
};

export default textToSpeechHelper;
