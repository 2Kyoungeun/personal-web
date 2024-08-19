import http from 'http';
import express from 'express';
import { connectMongoDB, disconnectMongoDB } from './loader/index.js';
import config from './config/index.js';
import AppError from './misc/AppError.js';
import commonErrors from './misc/commonErrors.js';
import apiRouter from './router/index.js';

const create = async () => {
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
    next(new AppError(commonErrors.resourceNotFoundError, 404, "Resource not found"));
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
      return new Promise((resolve, reject) => {
        server.listen(3000, (err) => { // config.port를 3000으로 하드코딩
          if (err) {
            console.error('서버 시작 중 오류 발생:', err);
            reject(err);
          } else {
            console.log(`🚀 서버가 포트 3000에서 운영중입니다.`);
            resolve();
          }
        });
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
          // await disconnectMongoDB(); // DB 연결 종료 코드 주석 처리
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
};

// 서버 실행
const runServer = async () => {
  try {
    const app = await create();
    await app.start(); // 서버 시작
    console.log("서버가 정상적으로 시작되었습니다.");
  } catch (error) {
    console.error("서버 초기화 중 오류 발생:", error);
  }
};

runServer();