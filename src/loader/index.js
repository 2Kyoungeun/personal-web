import mongoose from "mongoose";
import config from "../config.js";

// MongoDB 연결 함수
const connectMongoDB = async () => {
  mongoose.connection.on("connecting", () => {
    console.log("Mongoose가 MongoDB 서버에 연결중입니다!");
  });
  mongoose.connection.on("connected", () => {
    console.log("Mongoose가 MongoDB에 정상적으로 연결되었습니다.");
  });
  mongoose.connection.on("disconnecting", () => {
    console.log("Mongoose가 MongoDB와의 연결을 끊고 있습니다!");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose가 MongoDB와의 연결을 정상적으로 끊었습니다.");
  });
  mongoose.connection.on("error", (error) => {
    console.log(`Mongoose에서 에러가 발생하였습니다: ${error}`);
  });

  await mongoose.connect(config.mongoDBUri, {
    minPoolSize: 4,
    maxPoolSize: 20,
  });
};

// MongoDB 연결 해제 함수
const disconnectMongoDB = async () => {
  await mongoose.disconnect();
};

export {
  connectMongoDB,
  disconnectMongoDB,
};