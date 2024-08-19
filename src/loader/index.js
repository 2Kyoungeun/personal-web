import mongoose from "mongoose";
import config from "../config/index.js";

// MongoDB 연결 함수
const connectMongoDB = async () => {
  console.log("Mongoose가 MongoDB 서버에 연결중입니다!");
  try {
    await mongoose.connect(config.mongoDBUri);
    console.log("Mongoose가 MongoDB에 정상적으로 연결되었습니다.");
  } catch (error) {
    console.error(`Mongoose에서 연결 중 에러가 발생하였습니다: ${error}`);
    throw error;
  }
};

// MongoDB 연결 해제 함수
const disconnectMongoDB = async () => {
  console.log("Mongoose가 MongoDB와의 연결을 끊고 있습니다!");
  try {
    await mongoose.disconnect();
    console.log("Mongoose가 MongoDB와의 연결을 정상적으로 끊었습니다.");
  } catch (error) {
    console.error(`Mongoose에서 연결종료 중 에러가 발생하였습니다: ${error}`)
  }
};

export {
  connectMongoDB,
  disconnectMongoDB,
};