import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  await prisma.company.createMany({
    data: [
      {
        businessName: 'Apple',
        companyRegistrationNumber: '123456789',
        email: 'apple@test.paperware.kr',
        phoneNo: '010-1234-5678',
        faxNo: '02-1234-5678',
      },
      {
        businessName: 'Google',
        companyRegistrationNumber: '987654321',
        email: 'google@test.paperware.kr',
        phoneNo: '010-1234-5678',
        faxNo: '02-1234-5678',
      },
      {
        businessName: 'Microsoft',
        companyRegistrationNumber: '123456788',
        email: 'microsoft@test.paperware.kr',
        phoneNo: '010-1234-5678',
        faxNo: '02-1234-5678',
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        username: 'apple',
        password: '0000',
        email: 'steve.apple@test.paperware.kr',
        name: 'Steve Jobs',
        companyId: 1,
      },
      {
        username: 'google',
        password: '0000',
        email: 'sundar.google@test.paperware.kr',
        name: 'Sundar Pichai',
        companyId: 2,
      },
      {
        username: 'microsoft',
        password: '0000',
        email: 'bill.microsoft@test.paperware.kr',
        name: 'Bill Gates',
        companyId: 3,
      },
    ],
  });

  await prisma.paperDomain.createMany({
    data: [
      {
        name: '인쇄용지',
      },
      {
        name: '산업용지',
      },
      {
        name: '복사용지',
      },
    ],
  });

  await prisma.manufacturer.createMany({
    data: [
      {
        name: '한솔제지',
      },
      {
        name: '깨끗한나라',
      },
    ],
  });

  await prisma.paperGroup.createMany({
    data: [
      {
        name: 'SC',
      },
      {
        name: 'ABC',
      },
      {
        name: 'XYZ',
      },
    ],
  });

  await prisma.paperType.createMany({
    data: [
      {
        name: 'SC-Manilla',
      },
      {
        name: 'SC-Latte',
      },
      {
        name: 'ABC-Mart',
      },
      {
        name: 'XYZ-Crimson',
      },
    ],
  });

  await prisma.paperColorGroup.createMany({
    data: [
      {
        name: '백색',
      },
      {
        name: '회색',
      },
      {
        name: '갈색',
      },
    ],
  });

  await prisma.paperColor.createMany({
    data: [
      {
        name: '화이트',
      },
      {
        name: '아이보리',
      },
      {
        name: '그레이',
      },
      {
        name: '블랙',
      },
      {
        name: '베이지',
      },
    ],
  });

  await prisma.paperCert.createMany({
    data: [
      {
        name: 'FSC',
      },
      {
        name: 'PEFC',
      },
      {
        name: 'ISO14001',
      },
      {
        name: 'ISO9001',
      },
      {
        name: 'ISO27001',
      },
    ],
  });

  await prisma.packaging.createMany({
    data: [
      {
        name: 'SKID',
        type: 'SKID',
        packA: 0,
        packB: 0,
      },
      {
        name: 'REAM 100',
        type: 'REAM',
        packA: 100,
        packB: 0,
      },
      {
        name: 'REAM 500',
        type: 'REAM',
        packA: 500,
        packB: 0,
      },
      {
        name: 'BOX 100*30',
        type: 'BOX',
        packA: 100,
        packB: 30,
      },
      {
        name: 'BOX 150*25',
        type: 'BOX',
        packA: 150,
        packB: 25,
      },
      {
        name: 'BOX 200*20',
        type: 'BOX',
        packA: 200,
        packB: 20,
      },
      {
        name: 'BOX 250*15',
        type: 'BOX',
        packA: 250,
        packB: 15,
      },
      {
        name: 'ROLL 7inch',
        type: 'ROLL',
        packA: 7,
        packB: 0,
      },
      {
        name: 'ROLL 10inch',
        type: 'ROLL',
        packA: 10,
        packB: 0,
      },
      {
        name: 'ROLL 15cm',
        type: 'ROLL',
        packA: 15,
        packB: 1,
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        paperDomainId: 1,
        manufacturerId: 1,
        paperGroupId: 1,
        paperTypeId: 1,
      },
      {
        paperDomainId: 1,
        manufacturerId: 2,
        paperGroupId: 2,
        paperTypeId: 3,
      },
      {
        paperDomainId: 1,
        manufacturerId: 1,
        paperGroupId: 3,
        paperTypeId: 4,
      },
      {
        paperDomainId: 2,
        manufacturerId: 1,
        paperGroupId: 1,
        paperTypeId: 1,
      },
      {
        paperDomainId: 2,
        manufacturerId: 2,
        paperGroupId: 2,
        paperTypeId: 3,
      },
      {
        paperDomainId: 2,
        manufacturerId: 1,
        paperGroupId: 3,
        paperTypeId: 4,
      },
      {
        paperDomainId: 3,
        manufacturerId: 1,
        paperGroupId: 1,
        paperTypeId: 1,
      },
      {
        paperDomainId: 3,
        manufacturerId: 2,
        paperGroupId: 2,
        paperTypeId: 3,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
