import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs/promises";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_VIDEO_CONTAINER_NAME
);

export const downloadBlob = async (blobName) => {
  const blobClient = containerClient.getBlobClient(blobName);
  const filePath = `./downloads/${blobName}`;
  await blobClient.downloadToFile(filePath);
  console.log(`${GREEN}Downloaded ${blobName}${RESET}`);
  return filePath;
};

export const removeBlob = async (blobPath) => {
  await fs.unlink(blobPath);
  console.log(`${RED}Removed ${blobPath}${RESET}`);
};

export const removeBlobs = async (blobFilePath) => {
  const files = await fs.readdir(blobFilePath);
  for (const file of files) {
    if (file === ".gitkeep") continue;
    await removeBlob(`${blobFilePath}${file}`);
  }
};

export const uploadBlobs = async (blobFilePath, blobDirID) => {
  const uploadBlob = async (blobName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${blobDirID}/${blobName}`
    );
    const localFilePath = `./uploads/${blobName}`;
    await blockBlobClient.uploadFile(localFilePath);
    console.log(`${GREEN}Uploaded ${blobName} uploaded successfully${RESET}`);
  };

  const files = await fs.readdir(blobFilePath);
  for (const file of files) {
    if (file === ".gitkeep") continue;
    await uploadBlob(file);
  }
};
