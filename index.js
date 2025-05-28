import express from "express";
import bodyParser from "body-parser";
import archiver from "archiver";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/generate-zip", (req, res) => {
  const { fileName = "file.txt", zipName = "hdl.zip", content = "Sample content" } = req.body;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);
  archive.append(content, { name: fileName });
  archive.finalize();
});

app.listen(port, () => {
  console.log(`ZIP API running on port ${port}`);
});
