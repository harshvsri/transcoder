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
import util from "util";

const transcodeRouter = Router();
const execAsync = util.promisify(exec);

transcodeRouter.get("/:blobName", async (req, res) => {
  const { blobName } = req.params;
  const blobDirID = path.parse(blobName).name;

  try {
    const blobPath = await downloadBlob(blobName);
    const outputPath = `./uploads`;

    console.log(`🔥 Transcoding started...`);
    const { stdout, stderr } = await execAsync(
      getFfmpegCmd(blobPath, outputPath)
    );
    // Remove the downloaded blob
    await removeBlob(blobPath);
    if (stderr) {
      console.error(`Ffmpeg stderr: ${stderr}`);
      if (stderr.includes("error")) {
        throw new Error("Transcoding error occurred");
      }
    }

    console.log("⬆️ Uploading transcoded blobs...");
    const blobFilePath = "./uploads/";
    await uploadBlobs(blobFilePath, blobDirID);

    const videoURL = `${process.env.CONTAINER_CLIENT_URL}/${blobDirID}/index.m3u8`;
    res.status(200).json({ message: "Video processed successfully", videoURL });
    await removeBlobs(blobFilePath);
  } catch (error) {
    console.error(error);

    // Clean up the transcoded blobs if an error occurs
    const blobFilePath = "./uploads/";
    await removeBlobs(blobFilePath);
    return res.status(500).json({ message: "Failed to process video", error });
  }
});

export default transcodeRouter;
