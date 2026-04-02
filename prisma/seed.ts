import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123!", 12);
  const userPasswordHash = await bcrypt.hash("User@123!", 12);

  // upsert always refreshes the hash so re-seeding after migrate reset is idempotent
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { passwordHash: adminPasswordHash, isEmailVerified: true, isActive: true },
    create: {
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isEmailVerified: true,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: { passwordHash: userPasswordHash, isEmailVerified: true, isActive: true },
    create: {
      email: "user@example.com",
      passwordHash: userPasswordHash,
      role: "USER",
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log("Seed completed.");
  console.log("  Admin → admin@example.com / Admin@123!");
  console.log("  User  → user@example.com  / User@123!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
