const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        name: 'vase table'
    })
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
    const { name, featured, company, sort, fields } = req.query,
        queryObject = {};
    if (name) queryObject.name = { $regex: name, $options: 'i' }

    if (featured) queryObject.featured = featured === 'true' ? true : false;

    if (company) queryObject.company = company

    console.log(queryObject)

    let result = Product.find(queryObject)

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (Number(page) - 1) * limit;
    result = result.skip(skip).limit(limit)

    const products = await result;
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}