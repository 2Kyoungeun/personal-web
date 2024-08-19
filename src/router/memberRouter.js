import express from "express";
import { memberController } from "../controller/index.js";
import { memberMiddleware } from "../middleware/index.js";
import path from 'path';
import { fileURLToPath } from 'url';

const memberRouter = express.Router();
const metaUrl = fileURLToPath(import.meta.url);
const thisPath = path.dirname(metaUrl);

// 페이지 접근
memberRouter.get('/sign-up', (req, res) => {
  const loginPagePath = path.join(thisPath, '../views/login.html');
  res.status(200).sendFile(loginPagePath);
  console.log("로그인 페이지 접근");
});

// 회원가입
memberRouter.post(
  "/sign-up",
  memberMiddleware.checkCompleteSignUpForm("body"),
  memberController.postSignUp
);

// 로그인
memberRouter.post(
  "/log-in",
  memberMiddleware.checkCompleteLoginForm("body"),
  memberController.postLogin
);

// 마이페이지 - 조회
memberRouter.get(
  "/mypage",
  memberController.checkLogin,
  memberController.getMember
);

// 마이페이지 - 수정
memberRouter.put(
  "/mypage/update",
  memberController.checkLogin,
  memberController.putMember
);

// 마이페이지 - 삭제
memberRouter.delete(
  memberController.checkLogin,
  memberController.deleteMember
);
  
export default memberRouter;