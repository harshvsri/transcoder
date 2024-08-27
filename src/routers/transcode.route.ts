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
    console.log(`Downloading ${blobName}...`);
    const blobPath = await downloadBlob(blobName);
    const outputPath = `./uploads`;

    console.log(`Transcoding started...`);
    const { stdout, stderr } = await execAsync(
      getFfmpegCmd(blobPath, outputPath)
    );

    if (stderr) {
      console.info(`Ffmpeg stderr: ${stderr}`);
      if (stderr.includes("error")) {
        throw new Error("Transcoding error occurred");
      }
    }

    console.log("Uploading transcoded blobs...");
    const blobFilePath = "./uploads/";
    await uploadBlobs(blobFilePath, blobDirID);

    const videoURL = `${process.env.CONTAINER_CLIENT_URL}/${blobDirID}/index.m3u8`;
    res.status(200).json({ message: "Video processed successfully", videoURL });
  } catch (error) {
    // If any error happens, log the error and return a 500 status code
    console.error(error);
    return res.status(500).json({ message: "Failed to process video", error });
  } finally {
    // CleanUp: Remove the downloaded blob and transcoded blobs
    await removeBlob(`./downloads/${blobName}`);
    const blobFilePath = "./uploads/";
    await removeBlobs(blobFilePath);
  }
});

export default transcodeRouter;
