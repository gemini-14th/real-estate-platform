
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    console.log('--- Starting Migration from JSON to Neon ---');

    // 1. Migrate Properties
    const propertiesPath = path.join(process.cwd(), 'data.json');
    if (fs.existsSync(propertiesPath)) {
        const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));
        console.log(`Found ${properties.length} properties. Migrating...`);

        for (const p of properties) {
            try {
                await prisma.property.upsert({
                    where: { id: p.id },
                    update: {},
                    create: {
                        id: p.id,
                        title: p.title,
                        price: Number(p.price),
                        location: p.location,
                        videoUrl: p.videoUrl,
                        thumbnailUrl: p.thumbnailUrl,
                        description: p.description,
                        beds: Number(p.beds),
                        baths: Number(p.baths),
                        sqft: Number(p.sqft),
                        type: p.type,
                        tags: JSON.stringify(p.tags),
                        agentName: p.agent?.name,
                        agentAvatar: p.agent?.avatar,
                    }
                });
            } catch (e) {
                console.error(`Failed to migrate property ${p.id}:`, e.message);
            }
        }
        console.log('Properties migrated.');
    }

    // 2. Migrate Users
    const usersPath = path.join(process.cwd(), 'users.json');
    if (fs.existsSync(usersPath)) {
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        console.log(`Found ${users.length} users. Migrating...`);

        for (const u of users) {
            try {
                await prisma.user.upsert({
                    where: { email: u.email },
                    update: {},
                    create: {
                        id: u.id,
                        email: u.email,
                        password: u.password,
                        name: u.name,
                        createdAt: new Date(u.createdAt || Date.now())
                    }
                });
            } catch (e) {
                console.error(`Failed to migrate user ${u.email}:`, e.message);
            }
        }
        console.log('Users migrated.');
    }

    console.log('--- Migration Finished ---');
}

migrate()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
