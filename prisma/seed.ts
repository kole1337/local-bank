import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "Password123!";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function placeholderIdImage(label: string, sublabel: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
    <rect width="640" height="400" rx="16" fill="#eef2ef"/>
    <rect x="16" y="16" width="608" height="368" rx="12" fill="#ffffff" stroke="#dfe6e1" stroke-width="2"/>
    <rect x="40" y="40" width="140" height="170" rx="8" fill="#e4f5ec"/>
    <circle cx="110" cy="105" r="34" fill="#0f7a4c" opacity="0.25"/>
    <rect x="76" y="150" width="68" height="10" rx="5" fill="#0f7a4c" opacity="0.25"/>
    <text x="40" y="240" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#142019">${label}</text>
    <text x="40" y="268" font-family="Arial, sans-serif" font-size="15" fill="#64766c">${sublabel}</text>
    <text x="40" y="300" font-family="Arial, sans-serif" font-size="13" fill="#64766c">VERDANT BANK · SPECIMEN DOCUMENT</text>
    <rect x="40" y="330" width="560" height="2" fill="#dfe6e1"/>
    <text x="40" y="360" font-family="monospace" font-size="13" fill="#64766c">DOC# ${Math.random().toString(36).slice(2, 12).toUpperCase()}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function accountNumber(): string {
  let digits = "";
  for (let i = 0; i < 10; i++) digits += Math.floor(Math.random() * 10).toString();
  return `VB${digits}`;
}

async function main() {
  console.log("Seeding database...");

  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.identityDocument.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: "Morgan Reyes",
      email: "employee@verdant.bank",
      passwordHash,
      role: "EMPLOYEE",
      dateOfBirth: new Date("1985-03-12"),
      address: "1 Verdant Plaza, Charlotte, NC",
      status: "APPROVED",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jordan Alvarez",
      email: "jordan@example.com",
      passwordHash,
      role: "CUSTOMER",
      status: "APPROVED",
      dateOfBirth: new Date("1990-05-14"),
      address: "482 Birchwood Lane, Austin, TX",
      document: {
        create: {
          imageData: placeholderIdImage("Jordan Alvarez", "National ID · Austin, TX"),
          type: "NATIONAL_ID",
          placeOfBirth: "Austin, TX",
          placeOfIssue: "Austin, TX",
          expiryDate: new Date("2029-05-14"),
          status: "VERIFIED",
        },
      },
      account: {
        create: {
          accountNumber: accountNumber(),
          balanceCents: 458000,
          transactions: {
            create: [
              { type: "DEPOSIT", amountCents: 320000, description: "Payroll deposit", counterparty: "Acme Corp", createdAt: daysAgo(38) },
              { type: "PAYMENT", amountCents: -145000, description: "Rent payment", counterparty: "Birchwood Apartments", createdAt: daysAgo(35) },
              { type: "WITHDRAWAL", amountCents: -12000, description: "ATM withdrawal", createdAt: daysAgo(30) },
              { type: "PAYMENT", amountCents: -8999, description: "Streaming subscription", counterparty: "StreamPlus", createdAt: daysAgo(24) },
              { type: "TRANSFER_IN", amountCents: 25000, description: "Transfer from savings", counterparty: "Jordan Alvarez (Savings)", createdAt: daysAgo(18) },
              { type: "PAYMENT", amountCents: -6200, description: "Grocery store", counterparty: "Fresh Market", createdAt: daysAgo(12) },
              { type: "TRANSFER_OUT", amountCents: -20000, description: "Transfer to Priya N.", counterparty: "Priya Natarajan", createdAt: daysAgo(7) },
              { type: "DEPOSIT", amountCents: 320000, description: "Payroll deposit", counterparty: "Acme Corp", createdAt: daysAgo(3) },
            ],
          },
        },
      },
      notifications: {
        create: [
          {
            type: "APPROVAL",
            message: "Great news — your Verdant Bank account has been approved. Welcome aboard!",
            read: true,
            createdAt: daysAgo(40),
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Priya Natarajan",
      email: "priya@example.com",
      passwordHash,
      role: "CUSTOMER",
      status: "APPROVED",
      dateOfBirth: new Date("1988-11-02"),
      address: "77 Cedar Court, Seattle, WA",
      document: {
        create: {
          imageData: placeholderIdImage("Priya Natarajan", "Passport · Seattle, WA"),
          type: "PASSPORT",
          placeOfBirth: "Seattle, WA",
          placeOfIssue: "Seattle, WA",
          expiryDate: new Date("2031-11-02"),
          status: "VERIFIED",
        },
      },
      account: {
        create: {
          accountNumber: accountNumber(),
          balanceCents: 1284550,
          transactions: {
            create: [
              { type: "DEPOSIT", amountCents: 500000, description: "Client invoice payment", counterparty: "Northwind Studio", createdAt: daysAgo(50) },
              { type: "PAYMENT", amountCents: -220000, description: "Mortgage payment", counterparty: "Cascade Home Loans", createdAt: daysAgo(45) },
              { type: "TRANSFER_IN", amountCents: 20000, description: "Transfer from Jordan A.", counterparty: "Jordan Alvarez", createdAt: daysAgo(7) },
              { type: "PAYMENT", amountCents: -15000, description: "Utilities", counterparty: "Seattle City Light", createdAt: daysAgo(20) },
              { type: "WITHDRAWAL", amountCents: -30000, description: "ATM withdrawal", createdAt: daysAgo(15) },
              { type: "DEPOSIT", amountCents: 500000, description: "Client invoice payment", counterparty: "Northwind Studio", createdAt: daysAgo(5) },
            ],
          },
        },
      },
      notifications: {
        create: [
          {
            type: "APPROVAL",
            message: "Great news — your Verdant Bank account has been approved. Welcome aboard!",
            read: true,
            createdAt: daysAgo(52),
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Sam Whitfield",
      email: "sam@example.com",
      passwordHash,
      role: "CUSTOMER",
      status: "PENDING",
      dateOfBirth: new Date("1995-02-20"),
      address: "19 Maple Ave, Denver, CO",
      document: {
        create: {
          imageData: placeholderIdImage("Sam Whitfield", "Driver's License · Denver, CO"),
          status: "PENDING",
        },
      },
      account: {
        create: {
          accountNumber: accountNumber(),
          balanceCents: 0,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Alex Kim",
      email: "alex@example.com",
      passwordHash,
      role: "CUSTOMER",
      status: "DECLINED",
      declineReason: "The submitted ID document could not be verified. Please reapply with a clearer photo.",
      dateOfBirth: new Date("1998-07-09"),
      address: "305 Willow St, Portland, OR",
      document: {
        create: {
          imageData: placeholderIdImage("Alex Kim", "National ID · Portland, OR"),
          status: "RESUBMISSION_REQUESTED",
        },
      },
      account: {
        create: {
          accountNumber: accountNumber(),
          balanceCents: 0,
        },
      },
      notifications: {
        create: [
          {
            type: "DECLINE",
            message:
              "Your application was declined. Reason: The submitted ID document could not be verified. Please reapply with a clearer photo.",
            read: false,
            createdAt: daysAgo(2),
          },
        ],
      },
    },
  });

  console.log("Seed complete.");
  console.log(`All demo accounts use the password: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
