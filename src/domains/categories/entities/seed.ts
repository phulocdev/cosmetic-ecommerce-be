// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Seeding database with sample categories...');

//   // Create root categories
//   const electronics = await prisma.category.create({
//     data: {
//       name: 'Electronics',
//       slug: 'electronics',
//       description: 'All electronic devices and accessories',
//       path: '/',
//       depth: 0,
//       isActive: true,
//       metaTitle: 'Shop Electronics Online | Best Prices',
//       metaDescription: 'Browse our wide selection of electronics with free shipping',
//     },
//   });

//   const fashion = await prisma.category.create({
//     data: {
//       name: 'Fashion',
//       slug: 'fashion',
//       description: 'Clothing, shoes, and accessories',
//       path: '/',
//       depth: 0,
//       isActive: true,
//       metaTitle: 'Fashion & Clothing | Latest Trends',
//       metaDescription: 'Discover the latest fashion trends',
//     },
//   });

//   // Create second-level categories under Electronics
//   const computers = await prisma.category.create({
//     data: {
//       name: 'Computers',
//       slug: 'computers',
//       description: 'Laptops, desktops, and computer accessories',
//       parentId: electronics.id,
//       path: `/${electronics.id}/`,
//       depth: 1,
//       isActive: true,
//     },
//   });

//   const phones = await prisma.category.create({
//     data: {
//       name: 'Phones & Tablets',
//       slug: 'phones-tablets',
//       description: 'Smartphones, tablets, and mobile accessories',
//       parentId: electronics.id,
//       path: `/${electronics.id}/`,
//       depth: 1,
//       isActive: true,
//     },
//   });

//   const audio = await prisma.category.create({
//     data: {
//       name: 'Audio',
//       slug: 'audio',
//       description: 'Headphones, speakers, and audio equipment',
//       parentId: electronics.id,
//       path: `/${electronics.id}/`,
//       depth: 1,
//       isActive: true,
//     },
//   });

//   // Create third-level categories under Computers
//   const laptops = await prisma.category.create({
//     data: {
//       name: 'Laptops',
//       slug: 'laptops',
//       description: 'All types of laptops',
//       parentId: computers.id,
//       path: `/${electronics.id}/${computers.id}/`,
//       depth: 2,
//       isActive: true,
//       metaTitle: 'Buy Laptops Online | Best Deals',
//       metaDescription: 'Shop the latest laptops from top brands',
//     },
//   });

//   const desktops = await prisma.category.create({
//     data: {
//       name: 'Desktops',
//       slug: 'desktops',
//       description: 'Desktop computers and workstations',
//       parentId: computers.id,
//       path: `/${electronics.id}/${computers.id}/`,
//       depth: 2,
//       isActive: true,
//     },
//   });

//   const components = await prisma.category.create({
//     data: {
//       name: 'Computer Components',
//       slug: 'computer-components',
//       description: 'CPUs, GPUs, RAM, and other components',
//       parentId: computers.id,
//       path: `/${electronics.id}/${computers.id}/`,
//       depth: 2,
//       isActive: true,
//     },
//   });

//   // Create fourth-level categories under Laptops
//   const gamingLaptops = await prisma.category.create({
//     data: {
//       name: 'Gaming Laptops',
//       slug: 'gaming-laptops',
//       description: 'High-performance gaming laptops',
//       parentId: laptops.id,
//       path: `/${electronics.id}/${computers.id}/${laptops.id}/`,
//       depth: 3,
//       isActive: true,
//       metaTitle: 'Gaming Laptops | Top Performance',
//       metaDescription: 'Powerful gaming laptops for serious gamers',
//     },
//   });

//   const businessLaptops = await prisma.category.create({
//     data: {
//       name: 'Business Laptops',
//       slug: 'business-laptops',
//       description: 'Professional laptops for work',
//       parentId: laptops.id,
//       path: `/${electronics.id}/${computers.id}/${laptops.id}/`,
//       depth: 3,
//       isActive: true,
//     },
//   });

//   const ultrabooks = await prisma.category.create({
//     data: {
//       name: 'Ultrabooks',
//       slug: 'ultrabooks',
//       description: 'Thin and light ultrabooks',
//       parentId: laptops.id,
//       path: `/${electronics.id}/${computers.id}/${laptops.id}/`,
//       depth: 3,
//       isActive: true,
//     },
//   });

//   // Create categories under Fashion
//   const mensClothing = await prisma.category.create({
//     data: {
//       name: "Men's Clothing",
//       slug: 'mens-clothing',
//       description: 'Clothing for men',
//       parentId: fashion.id,
//       path: `/${fashion.id}/`,
//       depth: 1,
//       isActive: true,
//     },
//   });

//   const womensClothing = await prisma.category.create({
//     data: {
//       name: "Women's Clothing",
//       slug: 'womens-clothing',
//       description: 'Clothing for women',
//       parentId: fashion.id,
//       path: `/${fashion.id}/`,
//       depth: 1,
//       isActive: true,
//     },
//   });

//   // Create some sample attributes
//   const brandAttr = await prisma.attribute.create({
//     data: {
//       name: 'Brand',
//       slug: 'brand',
//       type: 'TEXT',
//       isGlobalFilter: true,
//     },
//   });

//   const colorAttr = await prisma.attribute.create({
//     data: {
//       name: 'Color',
//       slug: 'color',
//       type: 'COLOR',
//       isGlobalFilter: true,
//     },
//   });

//   const ramAttr = await prisma.attribute.create({
//     data: {
//       name: 'RAM',
//       slug: 'ram',
//       type: 'NUMBER',
//       unit: 'GB',
//     },
//   });

//   const storageAttr = await prisma.attribute.create({
//     data: {
//       name: 'Storage',
//       slug: 'storage',
//       type: 'NUMBER',
//       unit: 'GB',
//     },
//   });

//   const processorAttr = await prisma.attribute.create({
//     data: {
//       name: 'Processor',
//       slug: 'processor',
//       type: 'TEXT',
//     },
//   });

//   const screenSizeAttr = await prisma.attribute.create({
//     data: {
//       name: 'Screen Size',
//       slug: 'screen-size',
//       type: 'NUMBER',
//       unit: 'inches',
//     },
//   });

//   // Associate attributes with Laptops category
//   await prisma.categoryAttribute.createMany({
//     data: [
//       {
//         categoryId: laptops.id,
//         attributeId: brandAttr.id,
//         displayName: 'Laptop Brand',
//         displayOrder: 1,
//         filterType: 'CHECKBOX',
//         isFilterable: true,
//         isRequired: true,
//         inheritToChildren: true,
//         filterGroup: 'Basic',
//       },
//       {
//         categoryId: laptops.id,
//         attributeId: processorAttr.id,
//         displayName: 'Processor',
//         displayOrder: 2,
//         filterType: 'CHECKBOX',
//         isFilterable: true,
//         isRequired: true,
//         inheritToChildren: true,
//         filterGroup: 'Specifications',
//       },
//       {
//         categoryId: laptops.id,
//         attributeId: ramAttr.id,
//         displayName: 'RAM Size',
//         displayOrder: 3,
//         filterType: 'SLIDER',
//         isFilterable: true,
//         isRequired: true,
//         inheritToChildren: true,
//         filterGroup: 'Specifications',
//       },
//       {
//         categoryId: laptops.id,
//         attributeId: storageAttr.id,
//         displayName: 'Storage Capacity',
//         displayOrder: 4,
//         filterType: 'CHECKBOX',
//         isFilterable: true,
//         isRequired: true,
//         inheritToChildren: true,
//         filterGroup: 'Specifications',
//       },
//       {
//         categoryId: laptops.id,
//         attributeId: screenSizeAttr.id,
//         displayName: 'Screen Size',
//         displayOrder: 5,
//         filterType: 'CHECKBOX',
//         isFilterable: true,
//         isRequired: false,
//         inheritToChildren: true,
//         filterGroup: 'Display',
//       },
//       {
//         categoryId: laptops.id,
//         attributeId: colorAttr.id,
//         displayName: 'Color',
//         displayOrder: 6,
//         filterType: 'SWATCH',
//         isFilterable: true,
//         isRequired: false,
//         inheritToChildren: true,
//         filterGroup: 'Appearance',
//       },
//     ],
//   });

//   // Add specific attribute for Gaming Laptops
//   const graphicsCardAttr = await prisma.attribute.create({
//     data: {
//       name: 'Graphics Card',
//       slug: 'graphics-card',
//       type: 'TEXT',
//     },
//   });

//   await prisma.categoryAttribute.create({
//     data: {
//       categoryId: gamingLaptops.id,
//       attributeId: graphicsCardAttr.id,
//       displayName: 'GPU',
//       displayOrder: 3,
//       filterType: 'CHECKBOX',
//       isFilterable: true,
//       isRequired: true,
//       inheritToChildren: false,
//       filterGroup: 'Gaming Specs',
//     },
//   });

//   console.log('✅ Seed completed successfully!');
//   console.log('
// Created categories:');
//   console.log('- Electronics');
//   console.log('  - Computers');
//   console.log('    - Laptops');
//   console.log('      - Gaming Laptops');
//   console.log('      - Business Laptops');
//   console.log('      - Ultrabooks');
//   console.log('    - Desktops');
//   console.log('    - Computer Components');
//   console.log('  - Phones & Tablets');
//   console.log('  - Audio');
//   console.log('- Fashion');
//   console.log("  - Men's Clothing");
//   console.log("  - Women's Clothing");
//   console.log('
// Created attributes and assigned to Laptops category');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
