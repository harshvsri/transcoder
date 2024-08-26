export const getFfmpegCmd = (videoPath, outputPath) => {
  return `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${outputPath}/index.m3u8`;
};
