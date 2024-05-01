import {NextResponse} from "next/server"


const { Translate } = require("@google-cloud/translate").v2;


const translate = new Translate({
  keyFilename:
    "C:/Users/HP/Desktop/James's document/linear-cinema-421509-f854cb7e0b77.json", 
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
