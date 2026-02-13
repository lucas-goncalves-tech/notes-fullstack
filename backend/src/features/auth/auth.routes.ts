import { Router } from "express";
import { validate } from "../../shared/middleware/validation.middleware";
import { registerUserSchema } from "./dtos/register-user.dto";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";
import { loginUserSchema } from "./dtos/login-user.dto";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import {
  authLimiter,
  protectedLimiter,
} from "../../shared/middleware/rate-limiter.middleware";

const authController = container.resolve(AuthController);
const authRouter = Router();

authRouter.use(["/login", "/register"], authLimiter);
authRouter.use(["/me", "/logout"], protectedLimiter);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
authRouter.post(
  "/register",
  validate({ body: registerUserSchema }),
  authController.register,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *           example:
 *             email: "teste@teste.com"
 *             password: "12345678"
 *     responses:
 *       200:
 *         description: User logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
authRouter.post(
  "/login",
  validate({ body: loginUserSchema }),
  authController.login,
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user data
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: User autheticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
authRouter.get("/me", authMiddleware, authController.me);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
authRouter.get("/logout", authMiddleware, authController.logout);

export default authRouter;
