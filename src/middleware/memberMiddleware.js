import AppError from "../misc/AppError.js";
import commonErrors from "../misc/commonErrors.js";

// 회원가입 폼 체크
const checkCompleteSignUpForm = (form) => (req, res, next) => {
  const { email, pwd, checkPwd, name, phone } = req[form];
  if (email === undefined) {
    next(
      new AppError(
        commonErrors.inputError,
        400,
        `${form}: 이메일을 입력하세요.`
      )
    );
    return;
  }
  if (pwd === undefined) {
    next(
      new AppError(
        commonErrors.inputError,
        400,
        `${form}: 비밀번호를 입력하세요.`
      )
    );
    return;
  }
  if (pwd !== checkPwd) {
    next(
      new AppError(
        commonErrors.inputError,
        400,
        `${form}: 비밀번호가 일치하지 않습니다.`
      )
    );
    return;
  }
  if (name === undefined) {
    next(
      new AppError(commonErrors.inputError, 400, `${form}: 이름을 입력하세요.`)
    );
    return;
  }
  if (phone === undefined) {
    next(
      new AppError(
        commonErrors.inputError,
        400,
        `${form}: 핸드폰 번호를 입력하세요.`
      )
    );
    return;
  }
  next();
};

// 로그인 폼 체크
const checkCompleteLoginForm = (form) => (req, res, next) => {
  const { email, pwd } = req[form];
  if (email === undefined) {
    next(
      new AppError(
        commonErrors.inputError,
        400,
        `${form}: 이메일을 입력하세요.`
      )
    );
    return;
  }
  if (pwd === undefined) {
    next(
      new AppError(
        commonErrors.inputError,
        400,
        `${form}: 비밀번호를 입력하세요`
      )
    );
    return;
  }
  next();
};

export { checkCompleteSignUpForm, checkCompleteLoginForm };