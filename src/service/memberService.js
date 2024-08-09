import memberDAO from "../data-access/memberDAO";

// 회원가입, 사용자 정보 저장
const createMember = async ({ email, pwd, name, phone }) => {
  const createMember = await memberDAO.create({
    email,
    pwd,
    name,
    phone,
  });

  return createMember;
};

// 회원가입, 로그인 시 이메일 체크
const checkMember = async (email) => {
  const member = await memberDAO.findOne({ email });
  return member;
};

// 사용자 정보 가져오기
const getMember = async (id) => {
  const member = await memberDAO.findOneById(id);
  return member;
};

// 사용자 정보 수정
const updateMember = async (id, { email, pwd, name, phone }) => {
  const updatedMember = await memberDAO.updateOne(id, {
    email,
    name,
    phone,
  });

  return updatedMember;
};

// 사용자 정보 삭제
const deleteMember = async (id) => {
  const deletedMember = await memberDAO.deleteOne(id);
  return deletedMember;
};

// 관리자 계정
const memberService = {
  createMember,
  checkMember,
  getMember,
  updateMember,
  deleteMember,
};

export default memberService;