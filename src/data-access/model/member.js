import mongoose from "mongoose";
import memberSchema from "../schema";

const Member = mongoose.model("Member", memberSchema);

export default Member;
