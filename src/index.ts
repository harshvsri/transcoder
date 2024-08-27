import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import transcodeRouter from "./routers/transcode.route";
import indexRouter from "./routers/index.route";
import { error404Handler, errorHandler } from "./utils/error";
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.use("/", indexRouter);
app.use("/transcode", transcodeRouter);

app.listen(PORT, () => {
  console.log(
    `Server is listening at http://localhost:${PORT} (internal Docker port)`
  );
});

app.use(error404Handler);
app.use(errorHandler);