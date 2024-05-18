import { Request, ResponseToolkit } from "@hapi/hapi";
import { passwordStrength } from "check-password-strength";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import User from "../models/users";
import config from "../config";
import {
  createUserSchema,
  loginUserSchema,
  otpSchema,
  userUpdateSchema,
  getAllUserSchema,
  resendSchema,
  googleLoginUserSchema,
  resetPasswordSchema,
  resetPasswordPostSchema,
} from "../validation/user";

import {
  createUserSwagger,
  loginUserSwagger,
  otpSwagger,
  verifyEmailSwagger,
  currentUserSwagger,
  getAllUserSwawgger,
  getSingleUserSwagger,
  deleteSingleUserSwagger,
  resendEmailVerifySwagger,
  resendOTPVerifySwagger,
  resetPasswordSwagger,
} from "../swagger/user";

import { createCustomer } from "../utils/stripepayment";
import { UpdateUserPayload } from "../interfaces";

import GenerateOTP from "../utils/otp";
import sendMail from "../utils/sendMail";
import { getBalance } from "../utils/blockchain/musd";

const options = { abortEarly: false, stripUnknown: true };
export let userRoute = [
  {
    method: "POST",
    path: "/register",
    options: {
      description: "Register User",
      plugins: createUserSwagger,
      tags: ["api", "user"],
      validate: {
        payload: createUserSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      try {
        const email = request.payload["email"];
        const user = await User.findOne({ email });
        if (user) {
          return response
            .response([{ message: "Registration Failed.", path: ["email"] }])
            .code(400);
        }
        const password = request.payload["password"];
        const strength = passwordStrength(password).value;
        if (strength === "Too weak" || strength === "Weak") {
          return response
            .response({
              msg: "Password is weak. Should strength your password!",
            })
            .code(400);
        }

        console.log("user register request -->", request.payload);
        if (
          request.payload["role"] === "investor" ||
          request.payload["role"] === "prowner"
        ) {
          const newUser: any = new User(request.payload);
          const { password } = newUser;
          const hash = await bcrypt.hash(password, 10);
          newUser.password = hash;
          newUser.emailVerifyToken = crypto.randomBytes(30).toString("hex");
          newUser.emailVerifyExpire = Date.now() + 3 * 60 * 1000;
          const result = await newUser.save();

          const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
          console.log(baseUrl);
          const content = `
        <div style="text-align: center">
      <div>Hi 👋</div>
      <div><h3>Get started by verifying your account</h3></div>
      <div>
        <pre style="font-size: 16px">
        We are excited to have you at Marinex🚢. We need your confirmation that
        you will be using this email to access the platform
      </pre
        >
        <p>Verify the email by clicking the button below:</p>
        <a
          style="
            background-color: rgb(28, 108, 253);
            padding: 10px 20px;
            color: white;
            border: none;
            border-radius: 10px;
            text-decoration: none;
          "
          href="${baseUrl}/api/v1/user/verify-email/${result.emailVerifyToken}"
        >
          Verify Your Email Address
        </a>
      </div>
    </div>`;
          sendMail(result.email, content);
          return response
            .response({
              email: result.email,
              firstName: result.firstName,
              lastName: result.lastName,
            })
            .code(201);
        } else {
          return response.response({ msg: "Invalid Role" }).code(400);
        }
      } catch (error) {
        console.log(error);
        return response.response(error).code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/login",
    options: {
      description: "Login",
      plugins: loginUserSwagger,
      tags: ["api", "user"],
      validate: {
        payload: loginUserSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      console.log("login request -->", request.payload);
      const user = await User.findOne({ email: request.payload["email"] });
      if (user) {
        const hpass = await bcrypt.compare(
          request.payload["password"],
          user.password
        );
        console.log("login request user-->", user);
        try {
          if (hpass) {
            if (user.emailVerified) {
              const otp = GenerateOTP();
              user.otp = otp;
              const result = await user.save();
              const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your OTP code :</p><button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">${result.otp}</button></div>`;
              sendMail(result.email, content);
              console.log("otp send -->");
              return response.response({
                msg: "OTP Code has just sent to your email.",
              });
            } else {
              user.emailVerifyToken = crypto.randomBytes(30).toString("hex");
              user.emailVerifyExpire = Date.now() + 3 * 60 * 1000;
              await user.save();

              const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
              const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your email verification link. Please click the button below to verify your email:</p><a href="${baseUrl}/api/v1/user/verify-email/${user.emailVerifyToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">Verify Email</a></div>`;
              console.log("email send -->");
              sendMail(user.email, content);
              return response.response({
                msg: "Email verification has sent to your email",
              });
            }
          } else {
            console.log("password incorrect -->");
            return response
              .response([
                { message: "Password is incorrect", path: ["password"] },
              ])
              .code(400);
          }
        } catch (error) {
          console.log(error);
        }
      }
      return response
        .response([{ message: "User not found", path: ["email"] }])
        .code(404);
    },
  },
  {
    method: "POST",
    path: "/google/login",
    options: {
      description: "Login",
      plugins: loginUserSwagger,
      tags: ["api", "user"],
      validate: {
        payload: googleLoginUserSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      console.log("google login request -->", request.payload);
      const user = await User.findOne({ email: request.payload["email"] });
      if (user) {
        if (!user.emailVerified) user.emailVerified = true;
        const otp = GenerateOTP();
        user.otp = otp;
        const result = await user.save();
        const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your OTP code :</p><button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">${result.otp}</button></div>`;
        sendMail(result.email, content);
        console.log("otp send -->");
        return response.response({
          msg: "OTP Code has just sent to your email.",
        });
      }

      console.log("saving user");
      const customer = await createCustomer(
        request.payload["fullName"],
        request.payload["email"],
        "1234567890"
      );
      // user.cus_id = customer["id"];
      const newUser: any = new User({
        firstName: request.payload["fullName"],
        email: request.payload["email"],
        role: "investor",
        emailVerified: true,
        emailVerifyToken: crypto.randomBytes(30).toString("hex"),
        emailVerifyExpire: Date.now() + 3 * 60 * 1000,
        cus_id: customer["id"],
      });

      console.log("user make");
      const otp = GenerateOTP();
      newUser.otp = otp;

      try {
        console.log("saving new user");
        const result = await newUser.save();
        const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your OTP code :</p><button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">${result.otp}</button></div>`;
        sendMail(result.email, content);
        console.log("otp send -->");
        return response.response({
          msg: "OTP Code has just sent to your email.",
        });
      } catch (error) {
        console.log("error occured");
        console.log(error);
      }
    },
  },
  {
    method: "POST",
    path: "/re-send/email-verification",
    options: {
      description: "Resend Email Verification",
      plugins: resendEmailVerifySwagger,
      tags: ["api", "user"],
      validate: {
        payload: resendSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      const user = await User.findOne({ email: request.payload["email"] });
      if (user) {
        user.emailVerifyToken = crypto.randomBytes(30).toString("hex");
        user.emailVerifyExpire = Date.now() + 3 * 60 * 1000;
        await user.save();
        console.log("verify otp request-->", request.payload);
        const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
        const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your email verification link. Please click the button below to verify your email:</p><a href="${baseUrl}/api/v1/user/verify-email/${user.emailVerifyToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">Verify Email</a></div>`;
        sendMail(user.email, content);
        return response.response({
          msg: "Email verification has sent to your email",
        });
      }
      return response
        .response([{ message: "User not found", path: ["email"] }])
        .code(404);
    },
  },
  {
    method: "GET",
    path: "/reset-password",
    options: {
      description: "Resend OTP Verification Code",
      plugins: resetPasswordSwagger,
      tags: ["api", "user"],
      validate: {
        query: resetPasswordSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      const email = request.query["email"];
      const token = Jwt.sign({ email }, config.jwtSecret, {
        expiresIn: "3m",
      });
      // const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
      const frontEndURL = `https://marinex-frontend.vercel.app`;
      const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your reset-password verification link. Please click the button below to reset your password:</p><a href="${frontEndURL}/reset-password?token=${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">Reset Password</a></div>`;
      console.log(`send reset-password link to ${email}`);
      sendMail(email, content);
      return response.response({
        msg: "Reset password link has sent to your email",
      });
    },
  },
  {
    method: "POST",
    path: "/reset-password",
    options: {
      description: "Resend OTP Verification Code",
      plugins: resetPasswordSwagger,
      tags: ["api", "user"],
      validate: {
        payload: resetPasswordPostSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      const decoded = Jwt.decode(request.payload["token"]);
      if (decoded === null) {
        return response.response({ msg: "Reset password failed" }).code(400);
      }
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return response.response({ msg: "Reset password failed" }).code(400);
      }
      console.log("reset password request-->", decoded);
      const user = await User.findOne({ email: decoded.email });

      if (user) {
        const password = request.payload["password"];
        console.log(`---${password}---`);
        const hash = await bcrypt.hash(password, 10);
        user.password = hash;
        try {
          await user.save();
          console.log("password reset success");
          return response.response({ msg: "Reset password successfully" });
        } catch (error) {
          return response.response({ msg: "Reset password failed" }).code(400);
        }
      }
      return response
        .response({ msg: "No user found with that email" })
        .code(404);
    },
  },
  {
    method: "POST",
    path: "/re-send/otp-verification",
    options: {
      description: "Resend OTP Verification Code",
      plugins: resendOTPVerifySwagger,
      tags: ["api", "user"],
      validate: {
        payload: resendSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      const user = await User.findOne({ email: request.payload["email"] });
      if (user) {
        if (user.emailVerified) {
          const otp = GenerateOTP();
          user.otp = otp;
          const result = await user.save();
          const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your OTP code :</p><button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">${result.otp}</button></div>`;
          sendMail(result.email, content);
          return response.response({
            msg: "OTP Code has just sent to your email.",
          });
        } else {
          return response
            .response({ msg: "You need to verify email first" })
            .code(400);
        }
      }
      return response
        .response([{ message: "User not found", path: ["email"] }])
        .code(404);
    },
  },
  {
    method: "POST",
    path: "/verify-otp",
    options: {
      description: "Verify OTP",
      plugins: otpSwagger,
      tags: ["api", "user"],
      validate: {
        payload: otpSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
    },
    handler: async (request, response: ResponseToolkit) => {
      console.log("verify otp request in-->", request.payload);
      const user = await User.findOne({ email: request.payload["email"] });
      if (user) {
        if (user.otp === request.payload["otp"]) {
          const token = Jwt.sign(
            {
              userId: user._id,
              email: user.email,
            },
            config.jwtSecret,
            {
              expiresIn: "1h",
            }
          );
          const fullName = user.firstName + " " + user.lastName;
          return response
            .response({
              token,
              fullName,
              role: user.role,
              kycStatus: user.kycStatus,
              walletAddress: user.wallet.address,
              cus_id: user.cus_id,
              firstAction: user.firstAction,
            })
            .code(200);
        }
      }
      return response.response({ msg: "OTP Verification Failed." }).code(400);
    },
  },
  {
    method: "GET",
    path: "/verify-email/{token}",
    options: {
      description: "Verify Email",
      plugins: verifyEmailSwagger,
      tags: ["api", "user"],
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      const success = fs.readFileSync("./utils/emailVeriffSucess.txt");
      const failed = fs.readFileSync("./utils/emailVeriffFail.txt");

      const user = await User.findOne({
        emailVerifyToken: request.params.token,
      });
      if (user) {
        if (user.emailVerifyExpire > Date.now()) {
          console.log("verify email-->", user._id);
          user.emailVerified = true;
          const customer = await createCustomer(
            user.firstName + " " + user.lastName,
            user.email,
            user.phoneNumber
          );
          user.cus_id = customer["id"];
          await user.save();
          return success.toLocaleString();
        }
      }
      return failed.toLocaleString();
    },
  },
  {
    method: "GET",
    path: "/current",
    options: {
      auth: "jwt",
      description: "Get current user by token",
      plugins: currentUserSwagger,
      tags: ["api", "user"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const userId = request.auth.credentials.userId;
        const user = await User.findById(userId);
        if (user) {
          const fullName = user.firstName + " " + user.lastName;
          return response
            .response({
              fullName,
              role: user.role,
              kycStatus: user.kycStatus,
              walletAddress: user.wallet.address,
              cus_id: user.cus_id,
            })
            .code(200);
        }
        return response
          .response({
            msg: "User not found",
          })
          .code(404);
      },
    },
  },
  {
    method: "GET",
    path: "/balance",
    options: {
      auth: "jwt",
      description: "Get current balance",
      plugins: currentUserSwagger,
      tags: ["api", "user"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const userId = request.auth.credentials.userId;
        const user = await User.findById(userId);
        if (user) {
          const balance = await getBalance(user.wallet.address);
          console.log("get user current balance -->", balance);
          return response.response({
            walletAddress: user.wallet.address,
            balance: balance,
          });
        }
        return response
          .response({
            msg: "User not found",
          })
          .code(404);
      },
    },
  },
  {
    method: "GET",
    path: "/all",
    options: {
      auth: "jwt",
      description:
        "Get all user with pagination, firstName, middleName, lastName, email, referralCode, role, emailVerified",
      plugins: getAllUserSwawgger,
      tags: ["api", "kyc"],
      validate: {
        query: getAllUserSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
      handler: async (request: Request, response: ResponseToolkit) => {
        const userId = request.auth.credentials.userId;
        const user = await User.findById(userId);
        if (user.role === "admin") {
          let {
            id,
            firstName,
            lastName,
            middleName,
            email,
            emailVerified,
            role,
            kycStatus,
            page,
            status,
          } = request.query;
          const query = {};
          if (id) query["_id"] = id;
          if (firstName) query["firstName"] = firstName;
          if (lastName) query["lastName"] = lastName;
          if (middleName) query["middleName"] = middleName;
          if (email) query["email"] = email;
          if (emailVerified !== undefined)
            query["emailVerified"] = emailVerified;
          if (role) query["role"] = role;
          query["kycStatus"] = 0;
          const pendingCount = await User.countDocuments(query);
          query["kycStatus"] = 1;
          const approvedCount = await User.countDocuments(query);
          query["kycStatus"] = 2;
          const rejectCount = await User.countDocuments(query);
          delete query["kycStatus"];

          query["status"] = true;
          const activeCount = await User.countDocuments(query);
          query["status"] = false;
          const inactiveCount = await User.countDocuments(query);
          delete query["status"];

          if (kycStatus !== undefined) query["kycStatus"] = kycStatus;
          if (status !== undefined) query["status"] = status;
          const total = await User.countDocuments(query);
          if (!page) page = 1;

          const result = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * 25)
            .limit(25);
          console.log(result);
          return {
            total,
            pendingCount,
            approvedCount,
            rejectCount,
            activeCount,
            inactiveCount,
            data: result,
            offset: page * 25,
          };
        }
        return response
          .response({ msg: "You have no permission to access." })
          .code(403);
      },
    },
  },
  {
    method: "GET",
    path: "/{userId}",
    options: {
      auth: "jwt",
      description: "Get signle user's information",
      plugins: getSingleUserSwagger,
      tags: ["api", "user"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const userId = request.auth.credentials.userId;
        const authUser = await User.findById(userId);
        if (authUser.role === "admin") {
          const user = await User.findById(request.params.userId);
          if (user) return user;
          return response
            .response({ msg: "Cannot find the specific user's information." })
            .code(400);
        }
        return response
          .response({ msg: "You have no permission to access." })
          .code(403);
      },
    },
  },
  {
    method: "PUT",
    path: "/{userId}",
    options: {
      auth: "jwt",
      description: "Get single user's information",
      plugins: getSingleUserSwagger,
      tags: ["api", "user"],
      validate: {
        payload: userUpdateSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
      handler: async (request: Request, response: ResponseToolkit) => {
        const payload = request.payload as UpdateUserPayload;
        if (payload.password) {
          const hash = await bcrypt.hash(payload.password, 10);
          payload.password = hash;
        }
        const userId = request.auth.credentials.userId;
        const authUser = await User.findById(userId);
        if (authUser.role === "admin" || request.params.userId === userId) {
          const user = await User.findOneAndUpdate(
            { _id: request.params.userId },
            { $set: payload },
            { new: true }
          );
          return user;
        }
        return response.response({ msg: "Cannot update" }).code(400);
      },
    },
  },
  {
    method: "DELETE",
    path: "/{userId}",
    options: {
      auth: "jwt",
      description: "Delete single user",
      plugins: deleteSingleUserSwagger,
      tags: ["api", "user"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const userId = request.auth.credentials.userId;
        const authUser = await User.findById(userId);
        console.log(authUser.role);
        if (authUser.role === "admin" || request.params.userId === userId) {
          await User.findOneAndRemove({ _id: request.params.userId });
          return response.response({ msg: "User deleted successfully." });
        }
        return response.response({ msg: "Cannot delete user." }).code(400);
      },
    },
  },
  {
    method: "GET",
    path: "/milestone/:completeId",
    handler: (request: Request, response: ResponseToolkit) => {
      return "Handle milestone!";
    },
  },
];
