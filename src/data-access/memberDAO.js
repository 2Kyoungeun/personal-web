import Member from "./model";
import { sanitizeObject } from "../misc/util.js";

// 회원 생성 함수
const create = async ({ email, pwd, name, phone }) => {
  const member = new Member({ email, pwd, name, phone,});
  await member.save();
  return member.toObject();
};

// 회원 ID로 찾기
const findOneById = async (id) => {
  const member = await Member.findById(id).lean();
  return member;
};

// 회원 찾기
const findOne = async (data) => {
  const member = await Member.findOne(data).lean();
  return member;
};

// 회원 업데이트
const updateOne = async (id, member) => {
  const sanitizedMember = sanitizeObject({
    email: member.email,
    name: member.name,
    phone: member.phone,
  });

  const updateMember = await Member.findByIdAndUpdate(id, sanitizedMember, {
    runValidators: true,
    new: true,
  }).lean();
  return updateMember;
};

// 회원 삭제
const deleteOne = async (id) => {
  const deletedMember = await Member.findByIdAndDelete(id).lean();
  return deletedMember;
};

const memberDAO = {
  create,
  findOneById,
  findOne,
  updateOne,
  deleteOne,
};

export default memberDAO;