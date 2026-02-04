
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPasswords() {
    console.log('--- Hashing Existing Passwords in Neon ---');

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);

    for (const user of users) {
        // Check if password already looks like a bcrypt hash (usually starts with $2a$ or $2b$)
        if (user.password.startsWith('$2')) {
            console.log(`User ${user.email} already has a hashed password. Skipping.`);
            continue;
        }

        console.log(`Hashing password for ${user.email}...`);
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
    }

    console.log('--- Finished Hashing ---');
}

hashPasswords()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
