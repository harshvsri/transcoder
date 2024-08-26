import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs/promises";

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
  return filePath;
};

export const removeBlob = (blobPath) => fs.unlink(blobPath);

export const uploadBlobs = async (blobFilePath) => {
  const uploadBlob = async (blobName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const localFilePath = `./uploads/${blobName}`;
    await blockBlobClient.uploadFile(localFilePath);
    console.log(`${blobName} uploaded successfully`);
  };

  const files = await fs.readdir(blobFilePath);
  for (const file of files) {
    if (file === ".gitkeep") continue;
    await uploadBlob(file);
    await removeBlob(file);
  }
};
