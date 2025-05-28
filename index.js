import express from "express";
import bodyParser from "body-parser";
import archiver from "archiver";
import { PassThrough } from "stream";
import { Buffer } from "buffer";

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/generate-zip", async (req, res) => {
  const { fileName = "file.txt", zipName = "hdl.zip", content = "Sample content" } = req.body;

  try {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const streamBuffer = new PassThrough();

    const chunks = [];

    streamBuffer.on("data", (chunk) => {
      chunks.push(chunk);
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(streamBuffer);
    archive.append(content, { name: fileName });
    archive.finalize();

    streamBuffer.on("end", () => {
      const zipBuffer = Buffer.concat(chunks);
      const base64Zip = zipBuffer.toString("base64");

      res.json({
        fileName,
        zipName,
        zipBase64: base64Zip,
      });
    });

  } catch (err) {
    console.error("ZIP generation failed:", err);
    res.status(500).json({ error: "Failed to generate ZIP" });
  }
});

app.listen(port, () => {
  console.log(`ZIP API running on port ${port}`);
});
