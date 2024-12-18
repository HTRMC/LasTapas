// File: prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dishes = [
    {
        name: 'Paella Valenciana',
        image: '/images/paella.avif',
        allergies: ['shellfish', 'gluten'],
        category: 'Main Courses'
    },
    {
        name: 'Gazpacho',
        image: '/images/gazpacho.avif',
        allergies: [],
        category: 'Appetizers'
    },
    {
        name: 'Tortilla Española',
        image: '/images/tortilla.avif',
        allergies: ['eggs'],
        category: 'Appetizers'
    }, 
    {
        name: 'Patatas Bravas',
        image: '/images/patatas-bravas.avif',
        allergies: ['eggs'],
        category: 'Side Dishes'
    }, 
    {
        name: 'Gambas al Ajillo',
        image: '/images/gambas.avif',
        allergies: ['shellfish'],
        category: 'Appetizers'
    }, 
    {
        name: 'Croquetas de Jamón',
        image: '/images/croquetas.avif',
        allergies: ['gluten', 'dairy'],
        category: 'Appetizers'
    },
    {
        name: 'Pulpo a la Gallega',
        image: '/images/pulpo.avif',
        allergies: ['shellfish'],
        category: 'Main Courses'
    },
    {
        name: 'Calamares a la Romana',
        image: '/images/calamares.avif',
        allergies: ['gluten', 'shellfish'],
        category: 'Appetizers'
    },
    {
        name: 'Churros con Chocolate',
        image: '/images/churros.avif',
        allergies: ['gluten', 'dairy'],
        category: 'Desserts'
    },
    {
        name: 'Sangria',
        image: '/images/sangria.avif',
        allergies: [],
        category: 'Drinks',
        subcategory: 'Alcoholic'
    },
    {
        name: 'Tinto de Verano',
        image: '/images/tinto-de-verano.avif',
        allergies: [],
        category: 'Drinks',
        subcategory: 'Alcoholic'
    },
    {
        name: 'Horchata',
        image: '/images/horchata.avif',
        allergies: ['nuts'],
        category: 'Drinks',
        subcategory: 'Non-Alcoholic'
    },
    {
        name: 'Café con Leche',
        image: '/images/cafe-con-leche.avif',
        allergies: ['dairy'],
        category: 'Drinks',
        subcategory: 'Hot Beverages'
    }
];

async function main() {
    console.log('Starting seeding...');
    
    for (const dish of dishes) {
        try {
            const existing = await prisma.dish.findFirst({
                where: {
                    name: dish.name
                }
            });

            if (existing) {
                const updated = await prisma.dish.update({
                    where: { id: existing.id },
                    data: dish
                });
                console.log(`Updated dish: ${updated.name} (ID: ${updated.id})`);
            } else {
                const created = await prisma.dish.create({
                    data: dish
                });
                console.log(`Created dish: ${created.name} (ID: ${created.id})`);
            }
        } catch (error) {
            console.error(`Error seeding dish ${dish.name}:`, error);
            continue;
        }
    }

    const totalDishes = await prisma.dish.count();
    console.log(`Seeding finished. Total dishes in database: ${totalDishes}`);
}

main()
    .catch((e) => {
        console.error('Fatal error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });