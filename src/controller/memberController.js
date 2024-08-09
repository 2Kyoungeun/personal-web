import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import memberService from '../service';
import AppError from '../misc/AppError.js';
import commonErrors from '../misc/commonErrors.js';
import util from '../misc/util.js';
import config from '../config';

const { jwtSecret: secret } = config;

// 회원가입
const postSignUp = async (req, res, next) => {
  try {
    const { email, pwd, name, phone } = req.body;

    // DB 중복 이메일 여부 체크
    const dbMember = await memberService.checkMember(email);
    if (dbMember !== null) {
      next(new AppError(commonErrors.inputError, 400, '이미 가입된 이메일입니다.'));
      return;
    }

    // 비밀번호 해쉬화
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // 회원정보 DB 저장
    const member = await memberService.createMember({
      email,
      pwd: hashedPwd,
      name,
      phone
    });

    // 토큰 생성
    const token = jwt.sign(
      { mid: member._id, rol: member.role },
      secret,
      { expiresIn: '1h' }
    );

    res.status(201).json(util.buildResponse(token));
  } catch (err) {
    next(err);
  }
};

// 로그인
const postLogin = async (req, res, next) => {
  try {
    const { email, pwd } = req.body;
    const dbMember = await memberService.checkMember(email);

    // DB 이메일 체크
    if (dbMember === null) {
      next(new AppError(commonErrors.inputError, 400, '이메일 또는 패스워드가 일치하지 않습니다.'));
      return;
    }

    // DB 비밀번호 체크
    const isValid = await bcrypt.compare(pwd, dbMember.pwd);

    if (!isValid) {
      next(new AppError(commonErrors.inputError, 400, '이메일 또는 패스워드가 일치하지 않습니다.'));
      return;
    }

    // 토큰 생성
    const token = jwt.sign(
      { mid: dbMember._id, rol: dbMember.role },
      secret,
      { expiresIn: '1h' }
    );

    res.set({ authorization: `Bearer ${token}` });
    res.status(201).json(util.buildResponse(token));
  } catch (err) {
    next(err);
  }
};

// 로그인 여부 확인
const checkLogin = (req, res, next) => {
  if (!req.headers['authorization']) {
    next(new AppError(commonErrors.authorizationError, 403, '로그인이 되어있지 않습니다. 로그인 해주세요.'));
    return;
  }

  // Authorization: Bearer <token>
  const token = req.headers['authorization'].slice(7);
  const memberInfo = jwt.verify(token, secret); // return payload or throw err

  res.locals.member = memberInfo;
  next();
};

// 관리자 체크
const checkAdmin = async (req, res, next) => {
  try {
    const { member } = res.locals;
    if (member.rol !== 'admin') {
      next(new AppError(commonErrors.authorizationError, 403, '접근 권한이 없습니다. 관리자로 로그인 해주세요.'));
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

// 사용자 정보 조회(마이페이지)
const getMember = async (req, res, next) => {
  try {
    const { member } = res.locals;
    const dbMember = await memberService.getMember(member.mid);
    res.json(util.buildResponse(dbMember));
  } catch (err) {
    next(err);
  }
};

// 사용자 정보 수정
const putMember = async (req, res, next) => {
  try {
    const { member } = res.locals;
    const { email, name, phone } = req.body;
    const updatedMember = await memberService.updateMember(member.mid, {
      email,
      name,
      phone
    });
    res.json(util.buildResponse(updatedMember));
  } catch (err) {
    next(err);
  }
};

// 사용자 정보 삭제
const deleteMember = async (req, res, next) => {
  try {
    const { member } = res.locals;
    const deletedMember = await memberService.deleteMember(member.mid);
    res.json(util.buildResponse(deletedMember));
  } catch (err) {
    next(err);
  }
};

// 관리자를 위한 계정 관련 작업
const memberController = {
  postSignUp,
  postLogin,
  checkLogin,
  checkAdmin,
  getMember,
  putMember,
  deleteMember,
};

export default memberController;