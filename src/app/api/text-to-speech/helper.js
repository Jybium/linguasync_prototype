const textToSpeech = require("@google-cloud/text-to-speech");

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

const client = new textToSpeech.TextToSpeechClient({
  credentials: pathToCredentials,
});

const textToSpeechHelper = async (text, lang) => {
  const request = {
    input: { text },
    voice: { languageCode: lang || "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);

  return response.audioContent;
};

module.exports = textToSpeechHelper;
