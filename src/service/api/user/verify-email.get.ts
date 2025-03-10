import { Logger } from "../../../singleton/logger";
const log = Logger.getLogger().child({ from: "user/verify-email" });

import { Request, Response } from "express";
const { body } = require("express-validator");

import UserModel from "../../../model/mongo/user";
import verificationCodeModel from "../../../model/mongo/verification-code";
import { errorMessages, statusCodes } from "../../../utils/http-status";
import { ErrorResponse, SuccessResponse } from "../../../utils/response";

export const GET_VerifyEmailValidator = [body("code").exists().isString()];

const GET_VerifyEmail = async (req: Request, res: Response) => {
  try {
    const code: string = req.query.code as string;
    const dbCode = await verificationCodeModel.findOne({ code }).exec();

    if (!dbCode) {
      return res.status(statusCodes.clientInputError).json(new ErrorResponse(errorMessages.clientInputError));
    }

    await UserModel.updateOne({ _id: dbCode.belongsTo }, { $set: { emailVerified: true } });

    verificationCodeModel.deleteOne({ code }).exec();
    return res
      .status(statusCodes.success)
      .json(new SuccessResponse("Your email has been verified successfully. You can now login."));
  } catch (err) {
    log.error(err);
    return res.status(statusCodes.internalError).json(new ErrorResponse(errorMessages.internalError));
  }
};

export default GET_VerifyEmail;
