import express from "express";

const memberRouter = express.Router();

// 회원가입
memberRouter.post(
    "/sign-up",
    memberMiddleware.checkCompleteSignUpForm("body"),

);

// 로그인
memberRouter.post(
    "/log-in",
    memberMiddleware.checkCompleteLoginForm("body"),

);

// 마이페이지 - 조회
memberRouter.get(
    "/mypage",

);

// 마이페이지 - 수정
memberRouter.put(
"/mypage/update",

);

// 마이페이지 - 삭제
memberRouter.delete(
    "/mypage/delete",

);
  
export default memberRouter;