import { Router } from "express";
import {
  uploadBlobs,
  downloadBlob,
  removeBlob,
  removeBlobs,
} from "../utils/azureBlob";
import { exec } from "child_process";
import { getFfmpegCmd } from "../utils/ffmpeg";
import path from "path";

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
      return res.status(500).json({ message: "Failed to process video" });
    }

    console.log(stdout);
    await removeBlob(blobPath);

    console.log("⬆️ Uploading transcoded blobs...");
    const blobFilePath = "./uploads/";
    await uploadBlobs(blobFilePath, blobDirID);

    const videoURL = `${process.env.CONTAINER_CLIENT_URL}/${blobDirID}/index.m3u8`;
    res.status(200).json({ message: "Video processed successfully", videoURL });

    await removeBlobs(blobFilePath);
  });
});

export default transcodeRouter;
