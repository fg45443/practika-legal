import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/**
 * Возвращает реальную сессию NextAuth.
 * Если пользователь не залогинен — подставляет первого пользователя
 * из базы, чтобы сайт открывался без ввода логина и пароля.
 */
export async function getSessionOrFirstUser() {
  const session = await getServerSession(authOptions);
  if (session) return session;

  const user = await prisma.user.findFirst();
  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  } as any;
}
