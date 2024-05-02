import { SpeechClient } from "@google-cloud/speech";
import { PassThrough } from "stream";



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
  universe_domain: process.env.universe_domain,
};
    


export async function POST(req, res) {
  // Create a new SpeechClient
  const client = new SpeechClient({
    credentials: pathToCredentials,
  });

  // Configure the request for streaming recognition
  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
    interimResults: true, // Set to true for interim results
  };

  // Create a recognize stream
  const recognizeStream = client
    .streamingRecognize(request)
    .on("error", (err) => {
      console.error("Recognition error:", err);
      res.status(500).json({ error: "Recognition error" });
    })
    .on("data", (data) => {
      const transcript = data.results[0]?.alternatives[0]?.transcript;
      if (transcript) {
        // Send the transcript back to the client
        res.write(JSON.stringify({ transcript }));
      }
    })
    .on("end", () => {
      res.end();
    });

  // Create a PassThrough stream to receive the incoming audio data
  const audioStream = new PassThrough();

  // Pipe the incoming audio data to the recognize stream
  req.pipe(audioStream).pipe(recognizeStream);

  // Handle end of the request stream
  req.on("end", () => {
    recognizeStream.end();
  });

  console.log("Listening for audio...");
}
