import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@legal.ru" },
    update: {},
    create: {
      email: "admin@legal.ru",
      name: "Администратор",
      password: hashedPassword,
      role: "admin",
    },
  });

  const lawyer = await prisma.user.upsert({
    where: { email: "lawyer@legal.ru" },
    update: {},
    create: {
      email: "lawyer@legal.ru",
      name: "Иванов Иван Иванович",
      password: hashedPassword,
      role: "lawyer",
    },
  });

  // Clients
  const client1 = await prisma.client.create({
    data: {
      fullName: "Петров Сергей Николаевич",
      phone: "+7 (999) 123-45-67",
      email: "petrov@mail.ru",
      type: "individual",
      notes: "Постоянный клиент",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      fullName: "ООО «СтройИнвест»",
      phone: "+7 (495) 111-22-33",
      email: "info@stroyinvest.ru",
      type: "company",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      fullName: "Сидорова Анна Викторовна",
      phone: "+7 (916) 555-44-33",
      email: "sidorova@yandex.ru",
      type: "individual",
    },
  });

  // Cases
  const case1 = await prisma.case.create({
    data: {
      title: "Взыскание задолженности по договору поставки",
      description: "Иск о взыскании 2 500 000 руб. за неоплаченный товар",
      status: "in_progress",
      type: "civil",
      clientId: client2.id,
      lawyerId: lawyer.id,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: "Расторжение брака и раздел имущества",
      description: "Семейный спор, раздел квартиры и автомобиля",
      status: "open",
      type: "family",
      clientId: client3.id,
      lawyerId: lawyer.id,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: "Защита по уголовному делу (ст. 159 УК РФ)",
      description: "Мошенничество, сумма 450 000 руб.",
      status: "in_progress",
      type: "criminal",
      clientId: client1.id,
      lawyerId: lawyer.id,
    },
  });

  // Documents
  await prisma.document.createMany({
    data: [
      {
        title: "Договор поставки №45/2024",
        type: "contract",
        caseId: case1.id,
        notes: "Основной договор",
      },
      {
        title: "Исковое заявление",
        type: "claim",
        caseId: case1.id,
      },
      {
        title: "Свидетельство о браке",
        type: "evidence",
        caseId: case2.id,
      },
      {
        title: "Постановление о возбуждении дела",
        type: "decision",
        caseId: case3.id,
      },
    ],
  });

  // Hearings
  await prisma.hearing.createMany({
    data: [
      {
        date: new Date("2026-10-25T10:00:00"),
        court: "Арбитражный суд г. Москвы",
        result: "pending",
        notes: "Предварительное заседание",
        caseId: case1.id,
      },
      {
        date: new Date("2026-11-05T14:30:00"),
        court: "Тверской районный суд г. Москвы",
        result: "pending",
        caseId: case2.id,
      },
      {
        date: new Date("2026-09-15T11:00:00"),
        court: "Басманный районный суд г. Москвы",
        result: "postponed",
        notes: "Перенесено по ходатайству стороны",
        caseId: case3.id,
      },
    ],
  });

  console.log("✅ Seed completed!");
  console.log("Login: admin@legal.ru / admin123");
  console.log("Login: lawyer@legal.ru / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
