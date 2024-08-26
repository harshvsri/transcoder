import { Router } from "express";
import { uploadBlobs, downloadBlob, removeBlob } from "../utils/azureBlob";
import { exec } from "child_process";
import { getFfmpegCmd } from "../utils/ffmpeg";
import path from "path";
import fs from "fs/promises";

const transcodeRouter = Router();

transcodeRouter.get("/:blobName", async (req, res) => {
  const { blobName } = req.params;
  const blobDirID = path.parse(blobName).name;

  const blobPath = await downloadBlob(blobName);
  // Transcoded blob path
  const outputPath = `./uploads`;

  console.log(`🔥 Transcoding started...`);
  exec(getFfmpegCmd(blobPath, outputPath), async (err, stdout, stderr) => {
    if (err) {
      console.error(`Ffmpeg err: ${err}`);
      console.error(stderr);

      await removeBlob(blobPath);
      return res.status(500).json({ error: "Failed to process video" });
    }

    console.log(stdout);
    await removeBlob(blobPath);

    console.log("⬆️ Uploading transcoded blobs...");
    const blobFilePath = "./uploads/";
    await uploadBlobs(blobFilePath, blobDirID);

    res.status(200).json({ message: "Video processed successfully" });

    const files = await fs.readdir(blobFilePath);
    for (const file of files) {
      if (file === ".gitkeep") continue;
      await removeBlob(`${blobFilePath}${file}`);
      console.log(`🗑️ Removed ${file}`);
    }
  });
});

export default transcodeRouter;
