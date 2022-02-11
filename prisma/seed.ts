import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

enum BloodType {
    aPlus = 'aPlus',
    aMinus = 'aMinus',
    bPlus = 'bPlus',
    bMinus = 'bMinus',
    oPlus = 'oPlus',
    oMinus = 'oMinus',
    abPlus = 'abPlus',
    abMinus = 'abMinus'
}

enum DonationPostType {
    offer = 'offer',
    request = 'request',
}


function randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return randomEnumValue;
}

async function main() {
    let userIds: string[] = [];

    // Seeding Users
    for (let i: number = 1; i <= 50; i++) {
        const name: string = faker.name.findName();
        const phoneNumber: string = faker.phone.phoneNumber('+############');
        const fakeUser = await prisma.user.create({ data: { name, phoneNumber } });
        userIds[i] = (fakeUser.id);
    }
    // Seeding Donation Posts
    for (let i: number = 1; i <= 50; i++) {
        const userId: string = userIds[i];
        const content: string = faker.lorem.sentences(5);
        const address: string = faker.address.streetAddress();
        // const bloodType: string = randomEnum(BloodType).toString();
        // const type: string = randomEnum(DonationPostType).toString();
        const bloodType: string = BloodType.aMinus;
        const type: string = DonationPostType.request;
        await prisma.donationPost.create({ data: { User: { connect: { id: userId } }, content, address, bloodType, type } });
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })