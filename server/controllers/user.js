const prisma = require("../config/prisma")

exports.listUsers = async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address: true
            }
        })
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const { id, enabled } = req.body

        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                enabled: enabled
            }
        })

        res.send('Update Status Success')
        console.log(id, enabled)
        res.send('hi changeStatus')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.changeRole = async (req, res) => {
    try {
        const { id, role } = req.body

        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                role: role
            }
        })

        res.send('Update Role Success')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body
        console.log(cart)
        console.log(req.user.id)

        const user = await prisma.user.findFirst({
            where: {
                id: Number(req.user.id)
            }
        })
        // console.log(user)

        // Deleted ole Cart item
        await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    orderedById: user.id
                }
            }
        })
        // Delete old Cart
        await prisma.cart.deleteMany({
            where: {
                orderedById: user.id
            }
        })

        // เตรียมสินค้า
        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))

        //หาผลรวม
        let cartTotal = products.reduce((sum, item) => sum + item.price * item.count, 0)


        //New cart
        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products  //นำสินค้าที่ได้มาจาก req.body ไปไว้ใน productOnCart ของ Cart
                },
                cartTotal: cartTotal,
                orderedById: user.id
            },
        })
        console.log(newCart)



        res.send('Add Cart Ok')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getUserCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        // console.log(cart)
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.emtyCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            }
        })

        if (!cart) {
            return res.status(400).json({
                message: 'No Cart'
            })
        }
        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.id
            }
        })

        const result = await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        })


        console.log(result)
        res.json({
            message: 'Cart Empty Success',
            deletedCount: result.count
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.saveAddress = async (req, res) => {
    try {
        const { address } = req.body
        const addressUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        })

        res.json({
            message: "Update Success"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.saveOrder = async (req, res) => {
    try {
        //step 1 Get User Cart
        const userCart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: true
            }
        })

        // Check Empty
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({
                message: 'Cart is Empty'
            })
        }

        //Check quantity
        let itemnostock = []
        for (const item of userCart.products) {
            const product = await prisma.product.findUnique({
                where: {
                    id: item.productId
                },
                select: {
                    quantity: true,
                    title: true
                }
            })
            if (!product || item.count > product.quantity) {
                itemnostock.push(product?.title || "Product บางชนิด")
            }
            // console.log(product)
            // console.log('itemnostockcheck', itemnostock)
        }

        if (itemnostock.length > 0) {
            return res.status(400).json({
                message: `ขออภัย. สินค้า ${itemnostock.join(', ')} ไม่มีในสต็อค`
            })
        }


        //Create a new Order
        const order = await prisma.order.create({
            data: {
                products: {
                    create: userCart.products.map((item) => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price,
                    }))
                },
                orderedBy: {
                    connect: { id: req.user.id }
                },
                cartTotal: userCart.cartTotal
            },
            include: {
                orderedBy: true
            }
        })
        console.log(userCart.products)

        //Update Product (โครงสร้างเพื่อเตรียมไปใช้)
        const update = userCart.products.map((item) => ({
            where: { id: item.productId },
            data: {
                quantity: { decrement: item.count }, //decrement ลดลงตามจำนวนที่กำหนดในที่นี้คือ item.count
                sold: { increment: item.count }  //increment ลดลงตามจำนวนที่กำหนดในที่นี้คือ item.count
            }
        }))
        console.log(update)

        //นำมาใช้จริง
        await Promise.all(
            update.map((updated) => prisma.product.update(updated))
        )

        await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        })


        res.json({
            message: "order complete", order
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}


exports.getOrder = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if (orders.length === 0) {
            return res.status(400).json({
                message: "No orders"
            })
        }

        res.json({ orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}
