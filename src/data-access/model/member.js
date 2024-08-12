import mongoose from "mongoose";
import memberSchema from "../schema/index.js";

const Member = mongoose.model("Member", memberSchema);

export default Member;
