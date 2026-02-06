import { PrismaService } from 'database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { AttributeType, FilterDisplayType, ProductStatus } from 'enums'

@Injectable()
export class ProductSeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedProducts() {
    console.log({ prisma: this.prisma })
    console.log('🌱 Starting seed...')

    // Clean existing data (in reverse order of dependencies)
    console.log('🧹 Cleaning existing data...')
    await this.prisma.variantAttributeValue.deleteMany()
    await this.prisma.variantImage.deleteMany()
    await this.prisma.productAttribute.deleteMany()
    await this.prisma.categoryAttribute.deleteMany()
    await this.prisma.productImage.deleteMany()
    await this.prisma.productVariant.deleteMany()
    await this.prisma.productCategory.deleteMany()
    await this.prisma.attributeValue.deleteMany()
    await this.prisma.product.deleteMany()
    await this.prisma.attribute.deleteMany()
    await this.prisma.category.deleteMany()
    await this.prisma.brand.deleteMany()
    await this.prisma.countryOfOrigin.deleteMany()

    // 1. CREATE COUNTRIES OF ORIGIN
    console.log('🌍 Creating countries of origin...')
    const countries = await Promise.all([
      this.prisma.countryOfOrigin.create({ data: { name: 'United States' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'China' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Japan' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Germany' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Italy' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'France' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'United Kingdom' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'South Korea' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Vietnam' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Thailand' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Taiwan' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'India' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Mexico' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Canada' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Brazil' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Bangladesh' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Cambodia' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Malaysia' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Indonesia' } }),
      this.prisma.countryOfOrigin.create({ data: { name: 'Philippines' } })
    ])

    // 2. CREATE BRANDS
    console.log('🏷️ Creating brands...')
    const brands = await Promise.all([
      // Electronics brands
      this.prisma.brand.create({ data: { name: 'Apple', imageUrl: '/brands/apple.png' } }),
      this.prisma.brand.create({ data: { name: 'Samsung', imageUrl: '/brands/samsung.png' } }),
      this.prisma.brand.create({ data: { name: 'Sony', imageUrl: '/brands/sony.png' } }),
      this.prisma.brand.create({ data: { name: 'LG', imageUrl: '/brands/lg.png' } }),
      this.prisma.brand.create({ data: { name: 'Dell', imageUrl: '/brands/dell.png' } }),
      this.prisma.brand.create({ data: { name: 'HP', imageUrl: '/brands/hp.png' } }),
      this.prisma.brand.create({ data: { name: 'Lenovo', imageUrl: '/brands/lenovo.png' } }),
      this.prisma.brand.create({ data: { name: 'Microsoft', imageUrl: '/brands/microsoft.png' } }),
      this.prisma.brand.create({ data: { name: 'Asus', imageUrl: '/brands/asus.png' } }),
      this.prisma.brand.create({ data: { name: 'Acer', imageUrl: '/brands/acer.png' } }),
      this.prisma.brand.create({ data: { name: 'Google', imageUrl: '/brands/google.png' } }),
      this.prisma.brand.create({ data: { name: 'Huawei', imageUrl: '/brands/huawei.png' } }),
      this.prisma.brand.create({ data: { name: 'Xiaomi', imageUrl: '/brands/xiaomi.png' } }),
      this.prisma.brand.create({ data: { name: 'OnePlus', imageUrl: '/brands/oneplus.png' } }),
      this.prisma.brand.create({ data: { name: 'Motorola', imageUrl: '/brands/motorola.png' } }),

      // Fashion brands
      this.prisma.brand.create({ data: { name: 'Nike', imageUrl: '/brands/nike.png' } }),
      this.prisma.brand.create({ data: { name: 'Adidas', imageUrl: '/brands/adidas.png' } }),
      this.prisma.brand.create({ data: { name: 'Puma', imageUrl: '/brands/puma.png' } }),
      this.prisma.brand.create({ data: { name: 'Under Armour', imageUrl: '/brands/underarmour.png' } }),
      this.prisma.brand.create({ data: { name: "Levi's", imageUrl: '/brands/levis.png' } }),
      this.prisma.brand.create({ data: { name: 'Calvin Klein', imageUrl: '/brands/calvinklein.png' } }),
      this.prisma.brand.create({ data: { name: 'Tommy Hilfiger', imageUrl: '/brands/tommyhilfiger.png' } }),
      this.prisma.brand.create({ data: { name: 'Ralph Lauren', imageUrl: '/brands/ralphlauren.png' } }),
      this.prisma.brand.create({ data: { name: 'Zara', imageUrl: '/brands/zara.png' } }),
      this.prisma.brand.create({ data: { name: 'H&M', imageUrl: '/brands/hm.png' } }),
      this.prisma.brand.create({ data: { name: 'Gap', imageUrl: '/brands/gap.png' } }),
      this.prisma.brand.create({ data: { name: 'Uniqlo', imageUrl: '/brands/uniqlo.png' } }),
      this.prisma.brand.create({ data: { name: 'Forever 21', imageUrl: '/brands/forever21.png' } }),
      this.prisma.brand.create({ data: { name: 'Gucci', imageUrl: '/brands/gucci.png' } }),
      this.prisma.brand.create({ data: { name: 'Louis Vuitton', imageUrl: '/brands/lv.png' } }),

      // Home & Kitchen brands
      this.prisma.brand.create({ data: { name: 'IKEA', imageUrl: '/brands/ikea.png' } }),
      this.prisma.brand.create({ data: { name: 'KitchenAid', imageUrl: '/brands/kitchenaid.png' } }),
      this.prisma.brand.create({ data: { name: 'Cuisinart', imageUrl: '/brands/cuisinart.png' } }),
      this.prisma.brand.create({ data: { name: 'Dyson', imageUrl: '/brands/dyson.png' } }),
      this.prisma.brand.create({ data: { name: 'Philips', imageUrl: '/brands/philips.png' } }),
      this.prisma.brand.create({ data: { name: 'Ninja', imageUrl: '/brands/ninja.png' } }),
      this.prisma.brand.create({ data: { name: 'Instant Pot', imageUrl: '/brands/instantpot.png' } }),
      this.prisma.brand.create({ data: { name: 'Shark', imageUrl: '/brands/shark.png' } }),
      this.prisma.brand.create({ data: { name: 'Nespresso', imageUrl: '/brands/nespresso.png' } }),
      this.prisma.brand.create({ data: { name: 'Vitamix', imageUrl: '/brands/vitamix.png' } }),

      // Beauty & Personal Care
      this.prisma.brand.create({ data: { name: "L'Oréal", imageUrl: '/brands/loreal.png' } }),
      this.prisma.brand.create({ data: { name: 'Maybelline', imageUrl: '/brands/maybelline.png' } }),
      this.prisma.brand.create({ data: { name: 'Neutrogena', imageUrl: '/brands/neutrogena.png' } }),
      this.prisma.brand.create({ data: { name: 'Dove', imageUrl: '/brands/dove.png' } }),
      this.prisma.brand.create({ data: { name: 'Gillette', imageUrl: '/brands/gillette.png' } }),
      this.prisma.brand.create({ data: { name: 'Nivea', imageUrl: '/brands/nivea.png' } }),
      this.prisma.brand.create({ data: { name: 'CeraVe', imageUrl: '/brands/cerave.png' } }),
      this.prisma.brand.create({ data: { name: 'Estée Lauder', imageUrl: '/brands/esteelauder.png' } }),

      // Sports & Outdoors
      this.prisma.brand.create({ data: { name: 'Coleman', imageUrl: '/brands/coleman.png' } }),
      this.prisma.brand.create({ data: { name: 'The North Face', imageUrl: '/brands/northface.png' } }),
      this.prisma.brand.create({ data: { name: 'Columbia', imageUrl: '/brands/columbia.png' } }),
      this.prisma.brand.create({ data: { name: 'Patagonia', imageUrl: '/brands/patagonia.png' } }),
      this.prisma.brand.create({ data: { name: 'REI', imageUrl: '/brands/rei.png' } }),
      this.prisma.brand.create({ data: { name: 'Yeti', imageUrl: '/brands/yeti.png' } }),

      // Generic/Store brands
      this.prisma.brand.create({ data: { name: 'AmazonBasics', imageUrl: '/brands/amazonbasics.png' } }),
      this.prisma.brand.create({ data: { name: 'Generic', imageUrl: '/brands/generic.png' } })
    ])

    // 3. CREATE ATTRIBUTES
    console.log('🎨 Creating attributes...')

    // Color attribute
    const colorAttr = await this.prisma.attribute.create({
      data: {
        name: 'Color',
        slug: 'color',
        type: AttributeType.COLOR,
        isGlobalFilter: true,
        filterGroup: 'Style'
      }
    })

    const colorValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Black', hexColor: '#000000' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'White', hexColor: '#FFFFFF' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Red', hexColor: '#FF0000' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Blue', hexColor: '#0000FF' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Green', hexColor: '#00FF00' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Yellow', hexColor: '#FFFF00' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Gray', hexColor: '#808080' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Navy', hexColor: '#000080' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Pink', hexColor: '#FFC0CB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Purple', hexColor: '#800080' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Orange', hexColor: '#FFA500' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Brown', hexColor: '#A52A2A' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Beige', hexColor: '#F5F5DC' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Silver', hexColor: '#C0C0C0' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Gold', hexColor: '#FFD700' } }),
      this.prisma.attributeValue.create({
        data: { attributeId: colorAttr.id, value: 'Rose Gold', hexColor: '#B76E79' }
      }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Teal', hexColor: '#008080' } }),
      this.prisma.attributeValue.create({ data: { attributeId: colorAttr.id, value: 'Mint', hexColor: '#98FF98' } })
    ])

    // Size attribute
    const sizeAttr = await this.prisma.attribute.create({
      data: {
        name: 'Size',
        slug: 'size',
        type: AttributeType.SIZE,
        isGlobalFilter: true,
        filterGroup: 'Specifications'
      }
    })

    const sizeValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: 'XS' } }),
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: 'S' } }),
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: 'M' } }),
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: 'L' } }),
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: 'XL' } }),
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: 'XXL' } }),
      this.prisma.attributeValue.create({ data: { attributeId: sizeAttr.id, value: '3XL' } })
    ])

    // Storage attribute
    const storageAttr = await this.prisma.attribute.create({
      data: {
        name: 'Storage',
        slug: 'storage',
        type: AttributeType.TEXT,
        isGlobalFilter: true,
        filterGroup: 'Specifications',
        unit: 'GB'
      }
    })

    const storageValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: storageAttr.id, value: '64GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: storageAttr.id, value: '128GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: storageAttr.id, value: '256GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: storageAttr.id, value: '512GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: storageAttr.id, value: '1TB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: storageAttr.id, value: '2TB' } })
    ])

    // RAM attribute
    const ramAttr = await this.prisma.attribute.create({
      data: {
        name: 'RAM',
        slug: 'ram',
        type: AttributeType.TEXT,
        isGlobalFilter: true,
        filterGroup: 'Specifications',
        unit: 'GB'
      }
    })

    const ramValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: ramAttr.id, value: '4GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: ramAttr.id, value: '8GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: ramAttr.id, value: '16GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: ramAttr.id, value: '32GB' } }),
      this.prisma.attributeValue.create({ data: { attributeId: ramAttr.id, value: '64GB' } })
    ])

    // Material attribute
    const materialAttr = await this.prisma.attribute.create({
      data: {
        name: 'Material',
        slug: 'material',
        type: AttributeType.TEXT,
        isGlobalFilter: true,
        filterGroup: 'Features'
      }
    })

    const materialValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Cotton' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Polyester' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Leather' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Denim' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Wool' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Silk' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Nylon' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Plastic' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Metal' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Wood' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Glass' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Stainless Steel' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Aluminum' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Rubber' } }),
      this.prisma.attributeValue.create({ data: { attributeId: materialAttr.id, value: 'Canvas' } })
    ])

    // Screen Size attribute
    const screenSizeAttr = await this.prisma.attribute.create({
      data: {
        name: 'Screen Size',
        slug: 'screen-size',
        type: AttributeType.TEXT,
        isGlobalFilter: true,
        filterGroup: 'Specifications',
        unit: 'inches'
      }
    })

    const screenSizeValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '5.4"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '6.1"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '6.7"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '13"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '14"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '15.6"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '17"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '24"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '27"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '32"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '43"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '55"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '65"' } }),
      this.prisma.attributeValue.create({ data: { attributeId: screenSizeAttr.id, value: '75"' } })
    ])

    // Weight attribute
    const weightAttr = await this.prisma.attribute.create({
      data: {
        name: 'Weight',
        slug: 'weight',
        type: AttributeType.NUMBER,
        isGlobalFilter: false,
        filterGroup: 'Specifications',
        unit: 'kg'
      }
    })

    const weightValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: weightAttr.id, value: '0.5kg' } }),
      this.prisma.attributeValue.create({ data: { attributeId: weightAttr.id, value: '1kg' } }),
      this.prisma.attributeValue.create({ data: { attributeId: weightAttr.id, value: '1.5kg' } }),
      this.prisma.attributeValue.create({ data: { attributeId: weightAttr.id, value: '2kg' } }),
      this.prisma.attributeValue.create({ data: { attributeId: weightAttr.id, value: '3kg' } }),
      this.prisma.attributeValue.create({ data: { attributeId: weightAttr.id, value: '5kg' } })
    ])

    // Processor attribute
    const processorAttr = await this.prisma.attribute.create({
      data: {
        name: 'Processor',
        slug: 'processor',
        type: AttributeType.TEXT,
        isGlobalFilter: true,
        filterGroup: 'Specifications'
      }
    })

    const processorValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Intel Core i3' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Intel Core i5' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Intel Core i7' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Intel Core i9' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'AMD Ryzen 5' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'AMD Ryzen 7' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'AMD Ryzen 9' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Apple M1' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Apple M2' } }),
      this.prisma.attributeValue.create({ data: { attributeId: processorAttr.id, value: 'Apple M3' } })
    ])

    // Battery Life attribute
    const batteryAttr = await this.prisma.attribute.create({
      data: {
        name: 'Battery Life',
        slug: 'battery-life',
        type: AttributeType.TEXT,
        isGlobalFilter: false,
        filterGroup: 'Specifications',
        unit: 'hours'
      }
    })

    const batteryValues = await Promise.all([
      this.prisma.attributeValue.create({ data: { attributeId: batteryAttr.id, value: '8 hours' } }),
      this.prisma.attributeValue.create({ data: { attributeId: batteryAttr.id, value: '10 hours' } }),
      this.prisma.attributeValue.create({ data: { attributeId: batteryAttr.id, value: '12 hours' } }),
      this.prisma.attributeValue.create({ data: { attributeId: batteryAttr.id, value: '15 hours' } }),
      this.prisma.attributeValue.create({ data: { attributeId: batteryAttr.id, value: '18 hours' } }),
      this.prisma.attributeValue.create({ data: { attributeId: batteryAttr.id, value: '20 hours' } })
    ])

    // 4. CREATE CATEGORY HIERARCHY
    console.log('📁 Creating categories...')

    // Root categories
    const electronics = await this.prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'All electronic devices and accessories',
        path: '/electronics/',
        depth: 0,
        isActive: true,
        metaTitle: 'Shop Electronics Online',
        metaDescription: 'Browse our wide selection of electronics including computers, phones, and accessories'
      }
    })

    const fashion = await this.prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
        path: '/fashion/',
        depth: 0,
        isActive: true,
        metaTitle: 'Fashion & Clothing Online',
        metaDescription: 'Discover the latest trends in fashion, clothing, and accessories'
      }
    })

    const homeKitchen = await this.prisma.category.create({
      data: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Everything for your home and kitchen',
        path: '/home-kitchen/',
        depth: 0,
        isActive: true
      }
    })

    const beautyHealth = await this.prisma.category.create({
      data: {
        name: 'Beauty & Health',
        slug: 'beauty-health',
        description: 'Beauty products and health essentials',
        path: '/beauty-health/',
        depth: 0,
        isActive: true
      }
    })

    const sportsOutdoors = await this.prisma.category.create({
      data: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        path: '/sports-outdoors/',
        depth: 0,
        isActive: true
      }
    })

    // Electronics subcategories (level 1)
    const computers = await this.prisma.category.create({
      data: {
        name: 'Computers & Laptops',
        slug: 'computers-laptops',
        description: 'Desktop computers and laptops',
        parentId: electronics.id,
        path: '/electronics/computers-laptops/',
        depth: 1,
        isActive: true
      }
    })

    const smartphones = await this.prisma.category.create({
      data: {
        name: 'Smartphones & Tablets',
        slug: 'smartphones-tablets',
        description: 'Mobile phones and tablets',
        parentId: electronics.id,
        path: '/electronics/smartphones-tablets/',
        depth: 1,
        isActive: true
      }
    })

    const tvAudio = await this.prisma.category.create({
      data: {
        name: 'TV & Audio',
        slug: 'tv-audio',
        description: 'Televisions and audio equipment',
        parentId: electronics.id,
        path: '/electronics/tv-audio/',
        depth: 1,
        isActive: true
      }
    })

    const cameras = await this.prisma.category.create({
      data: {
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        description: 'Cameras and photography equipment',
        parentId: electronics.id,
        path: '/electronics/cameras-photography/',
        depth: 1,
        isActive: true
      }
    })

    const accessories = await this.prisma.category.create({
      data: {
        name: 'Accessories',
        slug: 'electronics-accessories',
        description: 'Electronic accessories and peripherals',
        parentId: electronics.id,
        path: '/electronics/accessories/',
        depth: 1,
        isActive: true
      }
    })

    const gaming = await this.prisma.category.create({
      data: {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming consoles and accessories',
        parentId: electronics.id,
        path: '/electronics/gaming/',
        depth: 1,
        isActive: true
      }
    })

    const wearables = await this.prisma.category.create({
      data: {
        name: 'Wearables',
        slug: 'wearables',
        description: 'Smartwatches and fitness trackers',
        parentId: electronics.id,
        path: '/electronics/wearables/',
        depth: 1,
        isActive: true
      }
    })

    // Computers subcategories (level 2)
    const laptops = await this.prisma.category.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computers',
        parentId: computers.id,
        path: '/electronics/computers-laptops/laptops/',
        depth: 2,
        isActive: true
      }
    })

    const desktops = await this.prisma.category.create({
      data: {
        name: 'Desktop Computers',
        slug: 'desktop-computers',
        description: 'Desktop PCs',
        parentId: computers.id,
        path: '/electronics/computers-laptops/desktop-computers/',
        depth: 2,
        isActive: true
      }
    })

    const monitors = await this.prisma.category.create({
      data: {
        name: 'Monitors',
        slug: 'monitors',
        description: 'Computer monitors and displays',
        parentId: computers.id,
        path: '/electronics/computers-laptops/monitors/',
        depth: 2,
        isActive: true
      }
    })

    const keyboards = await this.prisma.category.create({
      data: {
        name: 'Keyboards & Mice',
        slug: 'keyboards-mice',
        description: 'Computer input devices',
        parentId: computers.id,
        path: '/electronics/computers-laptops/keyboards-mice/',
        depth: 2,
        isActive: true
      }
    })

    // Smartphones subcategories (level 2)
    const iosPhones = await this.prisma.category.create({
      data: {
        name: 'iPhones',
        slug: 'iphones',
        description: 'Apple iPhones',
        parentId: smartphones.id,
        path: '/electronics/smartphones-tablets/iphones/',
        depth: 2,
        isActive: true
      }
    })

    const androidPhones = await this.prisma.category.create({
      data: {
        name: 'Android Phones',
        slug: 'android-phones',
        description: 'Android smartphones',
        parentId: smartphones.id,
        path: '/electronics/smartphones-tablets/android-phones/',
        depth: 2,
        isActive: true
      }
    })

    const tablets = await this.prisma.category.create({
      data: {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablets and iPads',
        parentId: smartphones.id,
        path: '/electronics/smartphones-tablets/tablets/',
        depth: 2,
        isActive: true
      }
    })

    // Fashion subcategories (level 1)
    const menClothing = await this.prisma.category.create({
      data: {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Clothing for men',
        parentId: fashion.id,
        path: '/fashion/mens-clothing/',
        depth: 1,
        isActive: true
      }
    })

    const womenClothing = await this.prisma.category.create({
      data: {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Clothing for women',
        parentId: fashion.id,
        path: '/fashion/womens-clothing/',
        depth: 1,
        isActive: true
      }
    })

    const shoes = await this.prisma.category.create({
      data: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for everyone',
        parentId: fashion.id,
        path: '/fashion/shoes/',
        depth: 1,
        isActive: true
      }
    })

    const bags = await this.prisma.category.create({
      data: {
        name: 'Bags & Accessories',
        slug: 'bags-accessories',
        description: 'Bags and fashion accessories',
        parentId: fashion.id,
        path: '/fashion/bags-accessories/',
        depth: 1,
        isActive: true
      }
    })

    const jewelry = await this.prisma.category.create({
      data: {
        name: 'Jewelry & Watches',
        slug: 'jewelry-watches',
        description: 'Jewelry and timepieces',
        parentId: fashion.id,
        path: '/fashion/jewelry-watches/',
        depth: 1,
        isActive: true
      }
    })

    // Men's clothing subcategories (level 2)
    const menShirts = await this.prisma.category.create({
      data: {
        name: 'Shirts',
        slug: 'mens-shirts',
        description: "Men's shirts and t-shirts",
        parentId: menClothing.id,
        path: '/fashion/mens-clothing/shirts/',
        depth: 2,
        isActive: true
      }
    })

    const menPants = await this.prisma.category.create({
      data: {
        name: 'Pants & Jeans',
        slug: 'mens-pants-jeans',
        description: "Men's pants and jeans",
        parentId: menClothing.id,
        path: '/fashion/mens-clothing/pants-jeans/',
        depth: 2,
        isActive: true
      }
    })

    const menJackets = await this.prisma.category.create({
      data: {
        name: 'Jackets & Coats',
        slug: 'mens-jackets-coats',
        description: "Men's outerwear",
        parentId: menClothing.id,
        path: '/fashion/mens-clothing/jackets-coats/',
        depth: 2,
        isActive: true
      }
    })

    const menSuits = await this.prisma.category.create({
      data: {
        name: 'Suits & Blazers',
        slug: 'mens-suits-blazers',
        description: "Men's formal wear",
        parentId: menClothing.id,
        path: '/fashion/mens-clothing/suits-blazers/',
        depth: 2,
        isActive: true
      }
    })

    // Women's clothing subcategories (level 2)
    const womenTops = await this.prisma.category.create({
      data: {
        name: 'Tops & Blouses',
        slug: 'womens-tops-blouses',
        description: "Women's tops and blouses",
        parentId: womenClothing.id,
        path: '/fashion/womens-clothing/tops-blouses/',
        depth: 2,
        isActive: true
      }
    })

    const womenDresses = await this.prisma.category.create({
      data: {
        name: 'Dresses',
        slug: 'womens-dresses',
        description: "Women's dresses",
        parentId: womenClothing.id,
        path: '/fashion/womens-clothing/dresses/',
        depth: 2,
        isActive: true
      }
    })

    const womenPants = await this.prisma.category.create({
      data: {
        name: 'Pants & Jeans',
        slug: 'womens-pants-jeans',
        description: "Women's pants and jeans",
        parentId: womenClothing.id,
        path: '/fashion/womens-clothing/pants-jeans/',
        depth: 2,
        isActive: true
      }
    })

    const womenSkirts = await this.prisma.category.create({
      data: {
        name: 'Skirts',
        slug: 'womens-skirts',
        description: "Women's skirts'",
        parentId: womenClothing.id,
        path: '/fashion/womens-clothing/skirts/',
        depth: 2,
        isActive: true
      }
    })

    // Shoes subcategories (level 2)
    const mensShoes = await this.prisma.category.create({
      data: {
        name: "Men's Shoes",
        slug: 'mens-shoes',
        description: 'Footwear for men',
        parentId: shoes.id,
        path: '/fashion/shoes/mens-shoes/',
        depth: 2,
        isActive: true
      }
    })

    const womensShoes = await this.prisma.category.create({
      data: {
        name: "Women's Shoes",
        slug: 'womens-shoes',
        description: 'Footwear for women',
        parentId: shoes.id,
        path: '/fashion/shoes/womens-shoes/',
        depth: 2,
        isActive: true
      }
    })

    const sneakers = await this.prisma.category.create({
      data: {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Athletic and casual sneakers',
        parentId: shoes.id,
        path: '/fashion/shoes/sneakers/',
        depth: 2,
        isActive: true
      }
    })

    // Home & Kitchen subcategories (level 1)
    const furniture = await this.prisma.category.create({
      data: {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Home furniture',
        parentId: homeKitchen.id,
        path: '/home-kitchen/furniture/',
        depth: 1,
        isActive: true
      }
    })

    const kitchenAppliances = await this.prisma.category.create({
      data: {
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        description: 'Appliances for your kitchen',
        parentId: homeKitchen.id,
        path: '/home-kitchen/kitchen-appliances/',
        depth: 1,
        isActive: true
      }
    })

    const homeDecor = await this.prisma.category.create({
      data: {
        name: 'Home Decor',
        slug: 'home-decor',
        description: 'Decorative items for your home',
        parentId: homeKitchen.id,
        path: '/home-kitchen/home-decor/',
        depth: 1,
        isActive: true
      }
    })

    const bedBath = await this.prisma.category.create({
      data: {
        name: 'Bed & Bath',
        slug: 'bed-bath',
        description: 'Bedroom and bathroom essentials',
        parentId: homeKitchen.id,
        path: '/home-kitchen/bed-bath/',
        depth: 1,
        isActive: true
      }
    })

    const storage = await this.prisma.category.create({
      data: {
        name: 'Storage & Organization',
        slug: 'storage-organization',
        description: 'Storage solutions',
        parentId: homeKitchen.id,
        path: '/home-kitchen/storage-organization/',
        depth: 1,
        isActive: true
      }
    })

    // Beauty & Health subcategories (level 1)
    const skincare = await this.prisma.category.create({
      data: {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Skincare products',
        parentId: beautyHealth.id,
        path: '/beauty-health/skincare/',
        depth: 1,
        isActive: true
      }
    })

    const makeup = await this.prisma.category.create({
      data: {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Cosmetics and makeup',
        parentId: beautyHealth.id,
        path: '/beauty-health/makeup/',
        depth: 1,
        isActive: true
      }
    })

    const haircare = await this.prisma.category.create({
      data: {
        name: 'Haircare',
        slug: 'haircare',
        description: 'Hair products and tools',
        parentId: beautyHealth.id,
        path: '/beauty-health/haircare/',
        depth: 1,
        isActive: true
      }
    })

    const fragrance = await this.prisma.category.create({
      data: {
        name: 'Fragrance',
        slug: 'fragrance',
        description: 'Perfumes and colognes',
        parentId: beautyHealth.id,
        path: '/beauty-health/fragrance/',
        depth: 1,
        isActive: true
      }
    })

    const personalCare = await this.prisma.category.create({
      data: {
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Personal care products',
        parentId: beautyHealth.id,
        path: '/beauty-health/personal-care/',
        depth: 1,
        isActive: true
      }
    })

    // Sports & Outdoors subcategories (level 1)
    const exerciseFitness = await this.prisma.category.create({
      data: {
        name: 'Exercise & Fitness',
        slug: 'exercise-fitness',
        description: 'Fitness equipment and gear',
        parentId: sportsOutdoors.id,
        path: '/sports-outdoors/exercise-fitness/',
        depth: 1,
        isActive: true
      }
    })

    const camping = await this.prisma.category.create({
      data: {
        name: 'Camping & Hiking',
        slug: 'camping-hiking',
        description: 'Outdoor camping and hiking gear',
        parentId: sportsOutdoors.id,
        path: '/sports-outdoors/camping-hiking/',
        depth: 1,
        isActive: true
      }
    })

    const cycling = await this.prisma.category.create({
      data: {
        name: 'Cycling',
        slug: 'cycling',
        description: 'Bicycles and cycling equipment',
        parentId: sportsOutdoors.id,
        path: '/sports-outdoors/cycling/',
        depth: 1,
        isActive: true
      }
    })

    const teamSports = await this.prisma.category.create({
      data: {
        name: 'Team Sports',
        slug: 'team-sports',
        description: 'Equipment for team sports',
        parentId: sportsOutdoors.id,
        path: '/sports-outdoors/team-sports/',
        depth: 1,
        isActive: true
      }
    })

    const waterSports = await this.prisma.category.create({
      data: {
        name: 'Water Sports',
        slug: 'water-sports',
        description: 'Water sports equipment',
        parentId: sportsOutdoors.id,
        path: '/sports-outdoors/water-sports/',
        depth: 1,
        isActive: true
      }
    })

    console.log('Created', await this.prisma.category.count(), 'categories')

    // 5. CREATE CATEGORY ATTRIBUTES
    console.log('🔗 Linking attributes to categories...')

    // Laptops category attributes
    await Promise.all([
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: laptops.id,
          attributeId: colorAttr.id,
          displayName: 'Color',
          displayOrder: 1,
          filterType: FilterDisplayType.SWATCH,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Style'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: laptops.id,
          attributeId: storageAttr.id,
          displayName: 'Storage Capacity',
          displayOrder: 2,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: laptops.id,
          attributeId: ramAttr.id,
          displayName: 'RAM',
          displayOrder: 3,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: laptops.id,
          attributeId: screenSizeAttr.id,
          displayName: 'Screen Size',
          displayOrder: 4,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: false,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: laptops.id,
          attributeId: processorAttr.id,
          displayName: 'Processor',
          displayOrder: 5,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: false,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      })
    ])

    // Men's Shirts category attributes
    await Promise.all([
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: menShirts.id,
          attributeId: colorAttr.id,
          displayName: 'Color',
          displayOrder: 1,
          filterType: FilterDisplayType.SWATCH,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Style'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: menShirts.id,
          attributeId: sizeAttr.id,
          displayName: 'Size',
          displayOrder: 2,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: menShirts.id,
          attributeId: materialAttr.id,
          displayName: 'Material',
          displayOrder: 3,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: false,
          inheritToChildren: true,
          filterGroup: 'Features'
        }
      })
    ])

    // Women's Dresses category attributes
    await Promise.all([
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: womenDresses.id,
          attributeId: colorAttr.id,
          displayName: 'Color',
          displayOrder: 1,
          filterType: FilterDisplayType.SWATCH,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Style'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: womenDresses.id,
          attributeId: sizeAttr.id,
          displayName: 'Size',
          displayOrder: 2,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: womenDresses.id,
          attributeId: materialAttr.id,
          displayName: 'Fabric',
          displayOrder: 3,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: false,
          inheritToChildren: true,
          filterGroup: 'Features'
        }
      })
    ])

    // Smartphone categories
    await Promise.all([
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: iosPhones.id,
          attributeId: colorAttr.id,
          displayName: 'Color',
          displayOrder: 1,
          filterType: FilterDisplayType.SWATCH,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Style'
        }
      }),
      this.prisma.categoryAttribute.create({
        data: {
          categoryId: iosPhones.id,
          attributeId: storageAttr.id,
          displayName: 'Storage',
          displayOrder: 2,
          filterType: FilterDisplayType.CHECKBOX,
          isFilterable: true,
          isRequired: true,
          inheritToChildren: true,
          filterGroup: 'Specifications'
        }
      })
    ])

    console.log('Created', await this.prisma.categoryAttribute.count(), 'category attributes')

    // Helper function to create products in batch
    const createProductsBatch = async (productData: any[]) => {
      const products = []
      for (const data of productData) {
        const product = await this.prisma.product.create({ data })
        products.push(product)
      }
      return products
    }

    // 6. CREATE PRODUCTS
    console.log('📦 Creating products (this may take a moment)...')

    // Get brand and country references
    const appleBrand = brands.find((b) => b.name === 'Apple')!
    const samsungBrand = brands.find((b) => b.name === 'Samsung')!
    const dellBrand = brands.find((b) => b.name === 'Dell')!
    const hpBrand = brands.find((b) => b.name === 'HP')!
    const lenovoBrand = brands.find((b) => b.name === 'Lenovo')!
    const nikeBrand = brands.find((b) => b.name === 'Nike')!
    const adidasBrand = brands.find((b) => b.name === 'Adidas')!
    const leviBrand = brands.find((b) => b.name === "Levi's")!
    const ralphBrand = brands.find((b) => b.name === 'Ralph Lauren')!
    const ckBrand = brands.find((b) => b.name === 'Calvin Klein')!
    const zaraBrand = brands.find((b) => b.name === 'Zara')!
    const hmBrand = brands.find((b) => b.name === 'H&M')!
    const northFaceBrand = brands.find((b) => b.name === 'The North Face')!
    const dysonBrand = brands.find((b) => b.name === 'Dyson')!
    const kitchenAidBrand = brands.find((b) => b.name === 'KitchenAid')!

    const chinaCountry = countries.find((c) => c.name === 'China')!
    const vietnamCountry = countries.find((c) => c.name === 'Vietnam')!
    const usaCountry = countries.find((c) => c.name === 'United States')!
    const mexicoCountry = countries.find((c) => c.name === 'Mexico')!
    const indiaCountry = countries.find((c) => c.name === 'India')!

    const productsData = [
      // Laptops
      {
        code: 'MBP-14-2024',
        name: 'MacBook Pro 14-inch M3',
        slug: 'macbook-pro-14-inch-m3',
        description:
          'Powerful MacBook Pro with M3 chip, stunning Retina display, and all-day battery life. Perfect for professionals and creators.',
        brandId: appleBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1999.0,
        views: 2456
      },
      {
        code: 'MBP-16-2024',
        name: 'MacBook Pro 16-inch M3 Pro',
        slug: 'macbook-pro-16-inch-m3-pro',
        description: 'Ultimate performance with M3 Pro chip, larger display, and exceptional battery life.',
        brandId: appleBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 2499.0,
        views: 1876
      },
      {
        code: 'MBA-13-M2',
        name: 'MacBook Air 13-inch M2',
        slug: 'macbook-air-13-inch-m2',
        description: 'Incredibly thin and light with M2 chip. Perfect balance of performance and portability.',
        brandId: appleBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1299.0,
        views: 3241
      },
      {
        code: 'DELL-XPS-15',
        name: 'Dell XPS 15 Laptop',
        slug: 'dell-xps-15-laptop',
        description: 'Premium laptop with InfinityEdge display, powerful Intel processors, and stunning design.',
        brandId: dellBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1599.0,
        views: 1892
      },
      {
        code: 'DELL-XPS-13',
        name: 'Dell XPS 13 Ultrabook',
        slug: 'dell-xps-13-ultrabook',
        description: 'Ultra-portable 13-inch laptop with premium build quality and performance.',
        brandId: dellBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1299.0,
        views: 1654
      },
      {
        code: 'HP-PAV-15',
        name: 'HP Pavilion 15 Laptop',
        slug: 'hp-pavilion-15-laptop',
        description: 'Affordable and reliable laptop for everyday computing, entertainment, and productivity.',
        brandId: hpBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 799.0,
        views: 2154
      },
      {
        code: 'HP-ENVY-14',
        name: 'HP ENVY 14 Laptop',
        slug: 'hp-envy-14-laptop',
        description: 'Premium HP laptop with sleek design and powerful performance.',
        brandId: hpBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1199.0,
        views: 987
      },
      {
        code: 'LNV-TP-X1',
        name: 'Lenovo ThinkPad X1 Carbon',
        slug: 'lenovo-thinkpad-x1-carbon',
        description:
          'Business-class laptop with legendary keyboard, robust security features, and military-grade durability.',
        brandId: lenovoBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1499.0,
        views: 1123
      },
      {
        code: 'LNV-YOGA-9I',
        name: 'Lenovo Yoga 9i Convertible',
        slug: 'lenovo-yoga-9i-convertible',
        description: '2-in-1 convertible laptop with touchscreen and premium build.',
        brandId: lenovoBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1699.0,
        views: 865
      },

      // Smartphones
      {
        code: 'IPHONE-15-PRO',
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.',
        brandId: appleBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1199.0,
        views: 5341
      },
      {
        code: 'IPHONE-15-PRO-MAX',
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Largest iPhone with Pro features, longest battery life, and 5x optical zoom.',
        brandId: appleBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1399.0,
        views: 4876
      },
      {
        code: 'IPHONE-15',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'All-new design with Dynamic Island and advanced dual camera system.',
        brandId: appleBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 899.0,
        views: 6234
      },
      {
        code: 'SAM-S24-ULTRA',
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Premium Android smartphone with S Pen, exceptional camera, and powerful performance.',
        brandId: samsungBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 1299.0,
        views: 3876
      },
      {
        code: 'SAM-S24-PLUS',
        name: 'Samsung Galaxy S24+',
        slug: 'samsung-galaxy-s24-plus',
        description: 'Large display with flagship features and long battery life.',
        brandId: samsungBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 999.0,
        views: 2987
      },
      {
        code: 'SAM-S24',
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Compact flagship with powerful AI features and stunning display.',
        brandId: samsungBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 799.0,
        views: 3456
      },

      // Men's Fashion
      {
        code: 'NIKE-AM-90',
        name: 'Nike Air Max 90',
        slug: 'nike-air-max-90',
        description: 'Classic Nike sneakers with iconic Air cushioning, comfortable fit, and timeless style.',
        brandId: nikeBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 130.0,
        views: 2765
      },
      {
        code: 'NIKE-AF1',
        name: 'Nike Air Force 1',
        slug: 'nike-air-force-1',
        description: 'Legendary basketball sneaker, now a streetwear staple.',
        brandId: nikeBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 110.0,
        views: 3123
      },
      {
        code: 'ADIDAS-ULTRA-BOOST',
        name: 'Adidas Ultraboost Running Shoes',
        slug: 'adidas-ultraboost-running-shoes',
        description: 'Premium running shoes with Boost cushioning technology.',
        brandId: adidasBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 180.0,
        views: 1987
      },
      {
        code: 'LEVI-501',
        name: "Levi's 501 Original Jeans",
        slug: 'levis-501-original-jeans',
        description: 'The original button-fly jeans since 1873. Authentic fit and timeless style.',
        brandId: leviBrand.id,
        countryOriginId: mexicoCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 89.5,
        views: 2543
      },
      {
        code: 'LEVI-511',
        name: "Levi's 511 Slim Fit Jeans",
        slug: 'levis-511-slim-fit-jeans',
        description: "Modern slim fit jeans with classic Levi's quality.",
        brandId: leviBrand.id,
        countryOriginId: mexicoCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 79.5,
        views: 1876
      },
      {
        code: 'RL-POLO-SHIRT',
        name: 'Ralph Lauren Classic Polo Shirt',
        slug: 'ralph-lauren-classic-polo-shirt',
        description: 'Timeless polo shirt with signature pony logo, comfortable cotton fabric, and classic fit.',
        brandId: ralphBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 98.0,
        views: 1432
      },
      {
        code: 'RL-OXFORD-SHIRT',
        name: 'Ralph Lauren Oxford Button-Down Shirt',
        slug: 'ralph-lauren-oxford-button-down-shirt',
        description: 'Classic Oxford shirt in premium cotton.',
        brandId: ralphBrand.id,
        countryOriginId: chinaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 89.5,
        views: 987
      },
      {
        code: 'CK-TSHIRT-BASIC',
        name: 'Calvin Klein Basic T-Shirt',
        slug: 'calvin-klein-basic-tshirt',
        description: 'Essential cotton t-shirt with modern fit and iconic logo waistband.',
        brandId: ckBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 45.0,
        views: 1821
      },
      {
        code: 'TNF-NUPTSE',
        name: 'The North Face Nuptse Jacket',
        slug: 'north-face-nuptse-jacket',
        description: 'Iconic insulated jacket with water-repellent finish and packable design.',
        brandId: northFaceBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 299.0,
        views: 1678
      },
      {
        code: 'TNF-THERMOBALL',
        name: 'The North Face ThermoBall Jacket',
        slug: 'north-face-thermoball-jacket',
        description: 'Lightweight insulated jacket with synthetic fill.',
        brandId: northFaceBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 229.0,
        views: 1123
      },

      // Women's Fashion
      {
        code: 'ZARA-FLORAL-DRESS',
        name: 'Zara Floral Print Dress',
        slug: 'zara-floral-print-dress',
        description: 'Elegant floral dress perfect for any occasion. Comfortable fit with beautiful print.',
        brandId: zaraBrand.id,
        countryOriginId: indiaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 69.9,
        views: 2892
      },
      {
        code: 'ZARA-MIDI-DRESS',
        name: 'Zara Midi Dress',
        slug: 'zara-midi-dress',
        description: 'Versatile midi dress suitable for work or evening wear.',
        brandId: zaraBrand.id,
        countryOriginId: indiaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 59.9,
        views: 2234
      },
      {
        code: 'HM-SILK-BLOUSE',
        name: 'H&M Silk Blend Blouse',
        slug: 'hm-silk-blend-blouse',
        description: 'Sophisticated blouse with silk blend fabric, perfect for office or evening wear.',
        brandId: hmBrand.id,
        countryOriginId: countries.find((c) => c.name === 'Bangladesh')!.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 39.99,
        views: 1456
      },
      {
        code: 'HM-TRENCH-COAT',
        name: 'H&M Trench Coat',
        slug: 'hm-trench-coat',
        description: 'Classic trench coat with modern details.',
        brandId: hmBrand.id,
        countryOriginId: countries.find((c) => c.name === 'Bangladesh')!.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 79.99,
        views: 987
      },
      {
        code: 'ADIDAS-YOGA-LEGGINGS',
        name: 'Adidas Yoga Leggings',
        slug: 'adidas-yoga-leggings',
        description: 'High-performance leggings with moisture-wicking fabric and comfortable waistband.',
        brandId: adidasBrand.id,
        countryOriginId: countries.find((c) => c.name === 'Cambodia')!.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 55.0,
        views: 2723
      },
      {
        code: 'NIKE-SPORTS-BRA',
        name: 'Nike Sports Bra',
        slug: 'nike-sports-bra',
        description: 'High-support sports bra for intense workouts.',
        brandId: nikeBrand.id,
        countryOriginId: vietnamCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 45.0,
        views: 1654
      },

      // Home & Kitchen
      {
        code: 'DYSON-V15',
        name: 'Dyson V15 Detect Cordless Vacuum',
        slug: 'dyson-v15-detect-vacuum',
        description: 'Powerful cordless vacuum with laser detection and intelligent suction.',
        brandId: dysonBrand.id,
        countryOriginId: countries.find((c) => c.name === 'Malaysia')!.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 649.99,
        views: 1234
      },
      {
        code: 'DYSON-AIRWRAP',
        name: 'Dyson Airwrap Hair Styler',
        slug: 'dyson-airwrap-hair-styler',
        description: 'Multi-styler for all hair types with no extreme heat.',
        brandId: dysonBrand.id,
        countryOriginId: countries.find((c) => c.name === 'Malaysia')!.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 599.99,
        views: 2876
      },
      {
        code: 'KA-STAND-MIXER',
        name: 'KitchenAid Stand Mixer',
        slug: 'kitchenaid-stand-mixer',
        description: 'Professional-grade stand mixer with 10 speeds and multiple attachments.',
        brandId: kitchenAidBrand.id,
        countryOriginId: usaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 379.99,
        views: 1567
      },
      {
        code: 'KA-FOOD-PROCESSOR',
        name: 'KitchenAid Food Processor',
        slug: 'kitchenaid-food-processor',
        description: 'Versatile food processor for all your meal prep needs.',
        brandId: kitchenAidBrand.id,
        countryOriginId: usaCountry.id,
        status: ProductStatus.PUBLISHED,
        basePrice: 199.99,
        views: 876
      }
    ]

    const products = await createProductsBatch(productsData)
    console.log(`Created ${products.length} products`)

    // 7. LINK PRODUCTS TO CATEGORIES
    console.log('🔗 Linking products to categories...')

    const productCategoryMap = [
      // MacBook products
      { product: products[0], primaryCat: laptops, secondaryCats: [computers] },
      { product: products[1], primaryCat: laptops, secondaryCats: [computers] },
      { product: products[2], primaryCat: laptops, secondaryCats: [computers] },
      // Dell products
      { product: products[3], primaryCat: laptops, secondaryCats: [computers] },
      { product: products[4], primaryCat: laptops, secondaryCats: [computers] },
      // HP products
      { product: products[5], primaryCat: laptops, secondaryCats: [computers] },
      { product: products[6], primaryCat: laptops, secondaryCats: [computers] },
      // Lenovo products
      { product: products[7], primaryCat: laptops, secondaryCats: [computers] },
      { product: products[8], primaryCat: laptops, secondaryCats: [computers] },
      // iPhones
      { product: products[9], primaryCat: iosPhones, secondaryCats: [smartphones] },
      { product: products[10], primaryCat: iosPhones, secondaryCats: [smartphones] },
      { product: products[11], primaryCat: iosPhones, secondaryCats: [smartphones] },
      // Samsung phones
      { product: products[12], primaryCat: androidPhones, secondaryCats: [smartphones] },
      { product: products[13], primaryCat: androidPhones, secondaryCats: [smartphones] },
      { product: products[14], primaryCat: androidPhones, secondaryCats: [smartphones] },
      // Men's shoes
      { product: products[15], primaryCat: sneakers, secondaryCats: [mensShoes, shoes] },
      { product: products[16], primaryCat: sneakers, secondaryCats: [mensShoes, shoes] },
      { product: products[17], primaryCat: sneakers, secondaryCats: [mensShoes, shoes] },
      // Men's pants
      { product: products[18], primaryCat: menPants, secondaryCats: [menClothing] },
      { product: products[19], primaryCat: menPants, secondaryCats: [menClothing] },
      // Men's shirts
      { product: products[20], primaryCat: menShirts, secondaryCats: [menClothing] },
      { product: products[21], primaryCat: menShirts, secondaryCats: [menClothing] },
      { product: products[22], primaryCat: menShirts, secondaryCats: [menClothing] },
      // Men's jackets
      { product: products[23], primaryCat: menJackets, secondaryCats: [menClothing] },
      { product: products[24], primaryCat: menJackets, secondaryCats: [menClothing] },
      // Women's dresses
      { product: products[25], primaryCat: womenDresses, secondaryCats: [womenClothing] },
      { product: products[26], primaryCat: womenDresses, secondaryCats: [womenClothing] },
      // Women's tops
      { product: products[27], primaryCat: womenTops, secondaryCats: [womenClothing] },
      { product: products[28], primaryCat: womenTops, secondaryCats: [womenClothing] },
      // Women's pants
      { product: products[29], primaryCat: womenPants, secondaryCats: [womenClothing] },
      { product: products[30], primaryCat: womenTops, secondaryCats: [womenClothing] },
      // Kitchen appliances
      { product: products[31], primaryCat: kitchenAppliances, secondaryCats: [homeKitchen] },
      { product: products[32], primaryCat: kitchenAppliances, secondaryCats: [homeKitchen] },
      { product: products[33], primaryCat: kitchenAppliances, secondaryCats: [homeKitchen] },
      { product: products[34], primaryCat: kitchenAppliances, secondaryCats: [homeKitchen] }
    ]

    for (const { product, primaryCat, secondaryCats } of productCategoryMap) {
      await this.prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: primaryCat.id,
          isPrimary: true
        }
      })

      for (const secondaryCat of secondaryCats) {
        await this.prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: secondaryCat.id,
            isPrimary: false
          }
        })
      }
    }

    console.log(`Created ${await this.prisma.productCategory.count()} product-category links`)

    // 8. LINK PRODUCT ATTRIBUTES
    console.log('🎨 Linking product attributes...')

    // Laptops get color, storage, RAM, processor attributes
    for (let i = 0; i < 9; i++) {
      await Promise.all([
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: colorAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: storageAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: ramAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: processorAttr.id, isRequired: false }
        })
      ])
    }

    // Smartphones get color and storage
    for (let i = 9; i < 15; i++) {
      await Promise.all([
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: colorAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: storageAttr.id, isRequired: true }
        })
      ])
    }

    // Shoes get color and size
    for (let i = 15; i < 18; i++) {
      await Promise.all([
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: colorAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: sizeAttr.id, isRequired: true }
        })
      ])
    }

    // Men's clothing gets color, size, material
    for (let i = 18; i < 25; i++) {
      await Promise.all([
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: colorAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: sizeAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: materialAttr.id, isRequired: false }
        })
      ])
    }

    // Women's clothing gets color, size, material
    for (let i = 25; i < 31; i++) {
      await Promise.all([
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: colorAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: sizeAttr.id, isRequired: true }
        }),
        this.prisma.productAttribute.create({
          data: { productId: products[i].id, attributeId: materialAttr.id, isRequired: false }
        })
      ])
    }

    // Kitchen appliances get color
    for (let i = 31; i < 35; i++) {
      await this.prisma.productAttribute.create({
        data: { productId: products[i].id, attributeId: colorAttr.id, isRequired: false }
      })
    }

    console.log(`Created ${await this.prisma.productAttribute.count()} product attributes`)

    // 9. CREATE PRODUCT IMAGES
    console.log('📷 Creating product images...')

    let imageCount = 0
    for (const product of products) {
      const numImages = Math.floor(Math.random() * 3) + 2 // 2–4 images

      for (let i = 1; i <= numImages; i++) {
        await this.prisma.productImage.create({
          data: {
            productId: product.id,
            url: `/products/${product.slug}-${i}.jpg`,
            altText: `${product.name} - Image ${i}`
          }
        })

        imageCount++
      }
    }

    // 10. CREATE PRODUCT VARIANTS
    console.log('🎯 Creating product variants...')

    // Helper to create variant
    const createVariant = async (
      productId: string,
      sku: string,
      name: string,
      barcode: string,
      costPrice: number,
      sellingPrice: number,
      stock: number
    ) => {
      return this.prisma.productVariant.create({
        data: {
          productId,
          sku,
          name,
          barcode,
          costPrice,
          sellingPrice,
          stockOnHand: stock,
          imageUrl: `/variants/${sku.toLowerCase()}.jpg`,
          lowStockThreshold: Math.floor(stock * 0.2),
          maxStockThreshold: stock * 2,
          isActive: true
        }
      })
    }

    const variants = []

    // Create variants for first laptop (MacBook Pro 14")
    const mbpVariants = [
      await createVariant(
        products[0].id,
        'MBP14-SIL-256-16',
        'MacBook Pro 14" Silver 256GB 16GB',
        '1001',
        1699,
        1999,
        25
      ),
      await createVariant(
        products[0].id,
        'MBP14-SIL-512-16',
        'MacBook Pro 14" Silver 512GB 16GB',
        '1002',
        1899,
        2299,
        18
      ),
      await createVariant(
        products[0].id,
        'MBP14-GRAY-256-16',
        'MacBook Pro 14" Gray 256GB 16GB',
        '1003',
        1699,
        1999,
        30
      ),
      await createVariant(
        products[0].id,
        'MBP14-GRAY-512-32',
        'MacBook Pro 14" Gray 512GB 32GB',
        '1004',
        2099,
        2599,
        12
      )
    ]
    variants.push(...mbpVariants)

    // Link variant attributes for MacBook variants
    await this.prisma.variantAttributeValue.create({
      data: {
        variantId: mbpVariants[0].id,
        attributeValueId: colorValues.find((v) => v.value === 'Silver')!.id
      }
    })
    await this.prisma.variantAttributeValue.create({
      data: {
        variantId: mbpVariants[0].id,
        attributeValueId: storageValues.find((v) => v.value === '256GB')!.id
      }
    })
    await this.prisma.variantAttributeValue.create({
      data: {
        variantId: mbpVariants[0].id,
        attributeValueId: ramValues.find((v) => v.value === '16GB')!.id
      }
    })

    await this.prisma.variantAttributeValue.create({
      data: {
        variantId: mbpVariants[1].id,
        attributeValueId: colorValues.find((v) => v.value === 'Silver')!.id
      }
    })
    await this.prisma.variantAttributeValue.create({
      data: {
        variantId: mbpVariants[1].id,
        attributeValueId: storageValues.find((v) => v.value === '512GB')!.id
      }
    })
    await this.prisma.variantAttributeValue.create({
      data: {
        variantId: mbpVariants[1].id,
        attributeValueId: ramValues.find((v) => v.value === '16GB')!.id
      }
    })

    // Create variants for iPhone 15 Pro
    const iphoneVariants = [
      await createVariant(products[9].id, 'IPH15P-BLK-128', 'iPhone 15 Pro Black 128GB', '2001', 899, 1199, 45),
      await createVariant(products[9].id, 'IPH15P-BLK-256', 'iPhone 15 Pro Black 256GB', '2002', 999, 1299, 38),
      await createVariant(products[9].id, 'IPH15P-BLU-256', 'iPhone 15 Pro Blue 256GB', '2003', 999, 1299, 33),
      await createVariant(products[9].id, 'IPH15P-WHT-512', 'iPhone 15 Pro White 512GB', '2004', 1199, 1499, 22)
    ]
    variants.push(...iphoneVariants)

    // Create variants for Nike Air Max
    const nikeVariants = [
      await createVariant(products[15].id, 'NIKE-AM90-BLK-9', 'Nike Air Max 90 Black US 9', '3001', 90, 130, 65),
      await createVariant(products[15].id, 'NIKE-AM90-WHT-9', 'Nike Air Max 90 White US 9', '3002', 90, 130, 72),
      await createVariant(products[15].id, 'NIKE-AM90-RED-10', 'Nike Air Max 90 Red US 10', '3003', 90, 130, 58)
    ]
    variants.push(...nikeVariants)

    // Create variants for Levi's Jeans
    const leviVariants = [
      await createVariant(products[18].id, 'LEVI-501-BLU-32', "Levi's 501 Blue W32", '4001', 59.5, 89.5, 85),
      await createVariant(products[18].id, 'LEVI-501-BLK-34', "Levi's 501 Black W34", '4002', 59.5, 89.5, 72),
      await createVariant(products[18].id, 'LEVI-501-BLU-36', "Levi's 501 Blue W36", '4003', 59.5, 89.5, 68)
    ]
    variants.push(...leviVariants)

    // Create variants for Ralph Lauren Polo
    const poloVariants = [
      await createVariant(products[20].id, 'RL-POLO-WHT-M', 'Ralph Lauren Polo White M', '5001', 68, 98, 75),
      await createVariant(products[20].id, 'RL-POLO-NAVY-L', 'Ralph Lauren Polo Navy L', '5002', 68, 98, 65),
      await createVariant(products[20].id, 'RL-POLO-BLK-XL', 'Ralph Lauren Polo Black XL', '5003', 68, 98, 58)
    ]
    variants.push(...poloVariants)

    // Create variants for Zara Dress
    const zaraVariants = [
      await createVariant(products[25].id, 'ZARA-FLORAL-S', 'Zara Floral Dress S', '6001', 39.9, 69.9, 45),
      await createVariant(products[25].id, 'ZARA-FLORAL-M', 'Zara Floral Dress M', '6002', 39.9, 69.9, 52),
      await createVariant(products[25].id, 'ZARA-FLORAL-L', 'Zara Floral Dress L', '6003', 39.9, 69.9, 38)
    ]
    variants.push(...zaraVariants)

    // Create variants for KitchenAid Mixer
    const mixerVariants = [
      await createVariant(products[33].id, 'KA-MIXER-RED', 'KitchenAid Stand Mixer Red', '7001', 279.99, 379.99, 24),
      await createVariant(
        products[33].id,
        'KA-MIXER-SILVER',
        'KitchenAid Stand Mixer Silver',
        '7002',
        279.99,
        379.99,
        28
      ),
      await createVariant(products[33].id, 'KA-MIXER-BLACK', 'KitchenAid Stand Mixer Black', '7003', 279.99, 379.99, 19)
    ]
    variants.push(...mixerVariants)

    console.log(`Created ${variants.length} product variants`)

    // Create some more variant images
    let variantImageCount = 0
    for (const variant of variants) {
      const numImages = Math.floor(Math.random() * 2) + 1

      for (let i = 1; i <= numImages; i++) {
        await this.prisma.variantImage.create({
          data: {
            variantId: variant.id,
            url: `/variants/${variant.sku.toLowerCase()}-${i}.jpg`,
            altText: `${variant.name} - Image ${i}`
          }
        })

        variantImageCount++
      }
    }

    console.log(`Created ${variantImageCount} variant images`)

    console.log('✅ Seed completed successfully!')

    // Print summary
    const counts = {
      countries: await this.prisma.countryOfOrigin.count(),
      brands: await this.prisma.brand.count(),
      categories: await this.prisma.category.count(),
      attributes: await this.prisma.attribute.count(),
      attributeValues: await this.prisma.attributeValue.count(),
      products: await this.prisma.product.count(),
      productCategories: await this.prisma.productCategory.count(),
      productAttributes: await this.prisma.productAttribute.count(),
      productImages: await this.prisma.productImage.count(),
      variants: await this.prisma.productVariant.count(),
      variantImages: await this.prisma.variantImage.count(),
      variantAttributeValues: await this.prisma.variantAttributeValue.count(),
      categoryAttributes: await this.prisma.categoryAttribute.count()
    }

    console.log('\\n📊 Database Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Countries of Origin: ${counts.countries}`)
    console.log(`Brands: ${counts.brands}`)
    console.log(`Categories: ${counts.categories}`)
    console.log(`Attributes: ${counts.attributes}`)
    console.log(`Attribute Values: ${counts.attributeValues}`)
    console.log(`Products: ${counts.products}`)
    console.log(`Product Categories (Links): ${counts.productCategories}`)
    console.log(`Product Attributes (Links): ${counts.productAttributes}`)
    console.log(`Product Images: ${counts.productImages}`)
    console.log(`Product Variants: ${counts.variants}`)
    console.log(`Variant Images: ${counts.variantImages}`)
    console.log(`Variant Attribute Values: ${counts.variantAttributeValues}`)
    console.log(`Category Attributes: ${counts.categoryAttributes}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\\n🎉 Your e-commerce database is ready!')
  }
}
