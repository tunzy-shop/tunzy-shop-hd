import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File upload error" });

    const { scale } = fields;
    const file = files.image;

    // For demo, we just return the same file
    const data = fs.readFileSync(file.filepath);

    // In your real implementation, call your HD enhancement API:
    // Example:
    // const enhancedData = await callHDAPI(data, scale);

    res.setHeader("Content-Type", "image/jpeg");
    res.send(data);
  });
}
