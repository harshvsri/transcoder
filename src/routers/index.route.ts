import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.status(200).json({
    name: "Video Transcoding Service",
    description:
      "A service that handles video transcoding operations. It downloads videos from Azure Blob Storage, processes them using FFmpeg, and uploads the processed videos back to Azure Blob Storage.",
    version: "1.0.0",
    baseUrl: "http://localhost:3001",
    routes: [
      {
        path: "/transcode",
        method: "GET",
        description:
          "Initiates the video transcoding process for a specified video blob.",
        parameters: [
          {
            name: "blobName",
            in: "path",
            required: true,
            description: "The name of the video blob to be transcoded.",
          },
        ],
        responses: {
          "200": {
            description: "Video processed successfully",
          },
          "500": {
            description: "Failed to process video",
          },
        },
      },
    ],
  });
});

export default indexRouter;
