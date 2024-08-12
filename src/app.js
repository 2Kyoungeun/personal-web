import http from "http";
import express from "express";
import { connectMongoDB, disconnectMongoDB } from "./loader/index.js";
import config from "./config/index.js";
import AppError from "./misc/AppError.js";
import commonErrors from "./misc/commonErrors.js";
import apiRouter from "./router/index.js";

async function create() {
  // MongoDB에 연결
  await connectMongoDB();

  console.log("express application을 초기화합니다.");
  const expressApp = express();

  // JSON 데이터와 URL-encoded 데이터를 파싱
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));

  // 정적 경로 설정
  expressApp.use("/static", express.static("uploads"));

  // version 1의 api router를 등록
  expressApp.use("/api/v1", apiRouter.v1);

  // 해당되는 URL이 없을 때를 대비한 미들웨어
  expressApp.use((req, res, next) => {
    next(
      new AppError(
        commonErrors.resourceNotFoundError,
        404,
        "Resource not found"
      )
    );
  });

  // 에러 핸들러 등록
  expressApp.use((error, req, res, next) => {
    console.log(error);
    res.statusCode = error.httpCode ?? 500;
    res.json({
      data: null,
      error: error.message,
    });
  });
  console.log("express application 준비가 완료되었습니다.");

  // express와 http.Server을 분리해서 관리하기 위함.
  const server = http.createServer(expressApp);

  const app = {
    start() {
      server.listen(config.port);
      server.on("listening", () => {
        console.log(`🚀 서버가 포트 ${config.port}에서 운영중입니다.`);
      });
    },
    stop() {
      console.log("🔥 서버를 중지 작업을 시작합니다.");
      this.isShuttingDown = true;
      return new Promise((resolve, reject) => {
        server.close(async (error) => {
          if (error !== undefined) {
            console.log(`- HTTP 서버 중지를 실패하였습니다: ${error.message}`);
            reject(error);
          }
          console.log("- 들어오는 커넥션을 더 이상 받지 않도록 하였습니다.");
          await disconnectMongoDB();
          console.log("- DB 커넥션을 정상적으로 끊었습니다.");
          console.log("🟢 서버 중지 작업을 성공적으로 마쳤습니다.");
          this.isShuttingDown = false;
          resolve();
        });
      });
    },
    isShuttingDown: false,
    _app: expressApp,
  };

  return app;
}

export default create;