import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/**
 * Возвращает реальную сессию NextAuth.
 * Если пользователь не залогинен — подставляет первого пользователя из базы.
 * Если база недоступна — отдаёт фиктивную сессию, чтобы сайт не падал.
 */
export async function getSessionOrFirstUser() {
  try {
    const session = await getServerSession(authOptions);
    if (session) return session;

    const user = await prisma.user.findFirst();
    if (user) {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      } as any;
    }
  } catch (e) {
    console.error("getSessionOrFirstUser error:", e);
  }

  return {
    user: {
      id: "demo",
      email: "demo@legal.ru",
      name: "Демо-пользователь",
      role: "lawyer",
    },
  } as any;
}