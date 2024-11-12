const express = require('express')
const router = express.Router()
const { create, list, read, remove, listby, searchFilters, update, createImages, removeImage } = require('../controllers/product')
const { adminCheck, authCheck } = require('../middlewares/authCheck')

//@ENDPOINT http://localhost:8000/api/product
router.post('/product', create)
router.get('/products/:count', list)
router.get('/product/:id', read)
router.put('/product/:id', update)
router.delete('/product/:id', remove)
router.post('/productby', listby)
router.post('/search/filters', searchFilters)

router.post('/images', authCheck, adminCheck, createImages)
router.post('/removeimages', authCheck, adminCheck, removeImage)



module.exports = router