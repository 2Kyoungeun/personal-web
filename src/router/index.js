import express from "express";
import memberRouter from "./memberRouter.js";

const v1Router = express.Router();

v1Router.use("/auth", memberRouter);

export default {
  v1: v1Router,
};