# Video Transcoder

This project implements a video transcoding service that receives a video ID, transcodes the video, and returns the URL of the transcoded video.

## Architecture Overview

The following diagram illustrates the network calls and the overall flow of the transcoding process:

[![Screenshot-125.png](https://i.postimg.cc/W1tCSQyB/Screenshot-125.png)](https://postimg.cc/ZWtw5D4H)

## API Endpoint

- **GET /transcode**
  - Query Parameter: `id` (video ID)
  - Description: Initiates the transcoding process for the specified video
  - Returns: URL of the transcoded video

## Process Flow

1. The client sends a GET request to `/transcode` with the video ID.
2. The server retrieves the raw video data from the video storage using the provided ID.
3. The server sends the video data to the transcoder for processing.
4. The transcoder processes the video and pushes the transcoded version to the transcoded storage.
5. The transcoded storage returns the URL of the newly transcoded video.
6. The server receives the transcoded video URL and returns it to the client.

## Future Improvements

- Implement more robust error handling.
- Add support for different video formats and resolutions.
- Optimize the transcoding process for better performance.


