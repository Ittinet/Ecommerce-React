const { query } = require("express")
const prisma = require("../config/prisma");
const { result } = require("lodash");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUND_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.create = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body
        console.log(title, description, price, quantity, categoryId, images)

        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            },
            include: {
                images: true
            }
        })

        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}

exports.list = async (req, res) => {
    try {
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error',
        })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error',
        })
    }
}

exports.remove = async (req, res) => {
    try {

        const { id } = req.params
        //Step 1 ค้นหาสินค้า include
        const product = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                images: true
            }
        })
        if (!product) {
            return res.status(400).json({
                message: 'Product not Found!!'
            })
        }

        // Step2 Promise ลบรูปภาพใน cloud แบบ รอให้เสร็จก่อน
        const deletedImage = product.images.map((item, index) => {
            new Promise((resolve, reject) => {
                //ลบจาก cloudinary
                cloudinary.uploader.destroy(item.public_id, (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
            })
        })
        await Promise.all(deletedImage)

        //อันนี้คืออีกแบบของ Step2 วิธีเขียน promise อีกแบบ แต่ต้อง const { promisify } = require('util'); ด้วย
        // const destroyImage = promisify(cloudinary.uploader.destroy);

        // const deletedImage = product.images.map(item => {
        //     return destroyImage(item.public_id); // คืนค่า Promise โดยตรง
        // });

        // await Promise.all(deletedImage);

        //Step 3 ลบสินค้า
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })

        res.json({
            message: 'Deleted Success',
            productdata: deletedImage
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}

exports.listby = async (req, res) => {
    try {
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)

        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: { category: true }
        })

        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}


const handleQuery = async (req, res, query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Search Error" })
    }
}

const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0], //ค้นหาราคาที่มากกว่า price
                    lte: priceRange[1] //ค้นหาราคาที่น้อยกว่า price
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Search Error" })
    }
}

const handleCategory = async (req, res, categoryId) => {
    try {
        const product = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((item) => Number(item))
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(product)
    } catch (error) {
        res.status(500).json({ message: 'Search error' })
    }
}

exports.searchFilters = async (req, res) => {
    try {

        const { query, category, price } = req.body
        if (query) {
            console.log('query', query)
            await handleQuery(req, res, query)
        }
        if (category) {
            console.log('category', category)
            await handleCategory(req, res, category)
        }
        if (price) {
            console.log('price', price)
            await handlePrice(req, res, price)
        }

        // res.send('Hello searchFilters product list')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}

exports.update = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title, description, price, quantity, categoryId, images)

        //clear
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            },
            include: {
                images: true
            }
        })

        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}

exports.createImages = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `Saint-${Date.now()}`,
            resource_type: 'auto',
            folder: 'Ecom-beginner'
        })
        res.send(result)
        console.log(req.body)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.removeImage = async (req, res) => {
    try {
        const { public_id } = req.body
        cloudinary.uploader.destroy(public_id, (result) => {
            res.json({
                message: 'Remove Complete',
                public_id: public_id
            })
        })
    } catch (error) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
