import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from '../schemas/auth.schema';
import { AppError } from '../middleware/error.middleware';
import { sendPasswordResetEmail } from '../lib/mailer';
import { env } from '../config/env';

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  profilePhoto: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class AuthService {
  async register(data: RegisterInput) {
    const normalizedEmail = data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        passwordHash,
      },
      select: safeUserSelect,
    });

    return user;
  }

  async login(data: LoginInput) {
    const normalizedEmail = data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { token, user: safeUser };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const normalizedEmail = data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour validity

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires,
        },
      });

      try {
        await sendPasswordResetEmail(normalizedEmail, resetToken);
      } catch (emailErr) {
        console.error(`[AUTH MAIL ERROR] Failed to send email to ${normalizedEmail}:`, emailErr);
      }
    }

    return {
      message: 'If this email is registered, a password reset link has been sent.',
    };
  }

  async resetPassword(data: ResetPasswordInput) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return {
      message: 'Password reset successful. You can now log in with your new password.',
    };
  }
}

export const authService = new AuthService();
