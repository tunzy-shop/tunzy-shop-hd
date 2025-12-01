import formidable from "formidable";
import fs from "fs";
import sharp from "sharp";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const scale = Number(fields.scale); // 2, 4, 8
    const file = files.image;
    const buffer = fs.readFileSync(file.filepath);

    try {
      // Resize + sharpen
      let image = sharp(buffer);
      const metadata = await image.metadata();
      const width = metadata.width * scale;
      const height = metadata.height * scale;

      const enhanced = await image
        .resize(width, height)
        .sharpen()
        .toFormat("jpeg")
        .toBuffer();

      res.setHeader("Content-Type", "image/jpeg");
      res.send(enhanced);

    } catch (error) {
      res.status(500).json({ error: "Enhance failed", details: error });
    }
  });
}
