import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig, ResponseType } from "axios";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    const options: AxiosRequestConfig = {
      method: "POST",
      url: "https://api.remove.bg/v1.0/removebg",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
        "Content-Type": "application/json",
      },
      data: {
        image_url: imageUrl,
        size: "auto",
      },
      responseType: "arraybuffer" as ResponseType,
    };

    const response = await axios.request(options);

    // Convert the image buffer to base64
    const imageBase64 = Buffer.from(response.data, "binary").toString("base64");
    const imageUrlWithBgRemoved = `data:image/png;base64,${imageBase64}`;

    return NextResponse.json({ success: true, image: imageUrlWithBgRemoved });
  } catch (error) {
    console.error("Error removing background:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
