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
  console.log(`⬇️ Downloaded ${blobName}`);
  return filePath;
};

export const removeBlob = (blobPath) => fs.unlink(blobPath);

export const removeBlobs = async (blobFilePath) => {
  const files = await fs.readdir(blobFilePath);
  for (const file of files) {
    if (file === ".gitkeep") continue;
    await removeBlob(`${blobFilePath}${file}`);
    console.log(`🗑️ Removed ${file}`);
  }
};

export const uploadBlobs = async (blobFilePath, blobDirID) => {
  const uploadBlob = async (blobName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${blobDirID}/${blobName}`
    );
    const localFilePath = `./uploads/${blobName}`;
    await blockBlobClient.uploadFile(localFilePath);
    console.log(`✅ Uploaded ${blobName} uploaded successfully`);
  };

  const files = await fs.readdir(blobFilePath);
  for (const file of files) {
    if (file === ".gitkeep") continue;
    await uploadBlob(file);
  }
};
