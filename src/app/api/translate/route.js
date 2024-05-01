import {NextResponse} from "next/server"
import path from "path";



const { Translate } = require("@google-cloud/translate").v2;


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


const translate = new Translate({
  credentials: pathToCredentials,
});

export async function POST(req, res) {

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed. Use POST." }, {status: 405});
  }


  const { text, targetLang } = await req.json();

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Text and target language are required." }, {status: 400});
  }

  try {

    const [translatedText] = await translate.translate(text, targetLang);


    return NextResponse.json({ translatedText }, {status: 200});
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json({ error: "An error occurred while translating the text." }, {status: 500});
  }
}
