import { Router } from "express";
import { uploadBlobs, downloadBlob, removeBlob } from "../utils/azureBlob";
import { exec } from "child_process";
import { getFfmpegCmd } from "../utils/ffmpeg";

const transcodeRouter = Router();

transcodeRouter.get("/:blobName", async (req, res) => {
  const { blobName } = req.params;

  const blobPath = await downloadBlob(blobName);
  // Transcoded blob path
  const outputPath = `./uploads`;

  exec(getFfmpegCmd(blobPath, outputPath), async (err, stdout, stderr) => {
    if (err) {
      console.error(`Ffmpeg err: ${err}`);
      console.error(stderr);

      await removeBlob(blobPath);
      return res.status(500).json({ error: "Failed to process video" });
    }

    console.log(stdout);
    await removeBlob(blobPath);

    const blobFilePath = "./uploads/";
    await uploadBlobs(blobFilePath);

    res.status(200).json({ message: "Video processed successfully" });
  });
});

export default transcodeRouter;
