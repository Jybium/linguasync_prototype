import textToSpeech from "@google-cloud/text-to-speech";
import path from "path";
import { PassThrough } from "stream";

const pathToCredentials = JSON.parse(process.env.credentials);


const client = new textToSpeech.TextToSpeechClient({
  credentials: pathToCredentials,
});

const textToSpeechHelper = async (text, res) => {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

 
  const [response] = await client.synthesizeSpeech(request);


  const audioStream = new PassThrough();
  audioStream.end(Buffer.from(response.audioContent, "binary"));


    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Content-Type", "audio/mpeg");
    requestHeaders.set(
      "Content-Disposition",
      "attachment; filename=speech.mp3"
    );


  audioStream.pipe(res);
};

export default textToSpeechHelper;
