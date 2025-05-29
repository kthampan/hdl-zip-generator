import express from "express";
import archiver from "archiver";
import bodyParser from "body-parser";
import stream from "stream";

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/generate-zip", async (req, res) => {
  const { fileName = "file.txt", zipName = "hdl.zip", content = "Sample content" } = req.query;

  try {
    const bufferStream = new stream.PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    const chunks = [];

    // Capture data chunks as they are streamed
    bufferStream.on("data", (chunk) => chunks.push(chunk));
    bufferStream.on("end", () => {
      const zipBuffer = Buffer.concat(chunks);
      const zipBase64 = zipBuffer.toString("base64");
      res.json({
        zipName,
        zipBase64,
        message: "ZIP file created and base64 encoded successfully"
      });
    });

    archive.pipe(bufferStream);
    archive.append(content, { name: fileName });
    archive.finalize();
  } catch (error) {
    console.error("ZIP error:", error);
    res.status(500).json({ error: "Failed to generate ZIP file" });
  }
});

app.listen(port, () => {
  console.log(`ZIP API running on port ${port}`);
});
