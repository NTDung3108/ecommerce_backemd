const{ response } = require('express');
const pool = require('../Database/database');

const addFavoriteProduct = async (req, res = response) => {

    const {idProduct, idUser} = req.body;

    const rows = await pool.query('SELECT product_id, user_id FROM favorite WHERE product_id = ? AND user_id = ?', [ idProduct, idUser ]);

    console.log(rows);
    console.log(idProduct+idUser+"");

    if( rows.length == 0){
        await pool.query(`CALL SP_ADD_PRODUCT_FAVORITE(?,?);`,[ idProduct, idUser ]);

        res.json({
            resp: true,
            msj: 'Product add to Favorite'
        })
    }else{
        await pool.query(`CALL SP_DELETE_PRODUCT_FAVORITE(?,?);`, [ idProduct, idUser ]);

        res.json({
            resp: true,
            msj: 'Delete product to Favorite'
        });
    }
};

const productFavoriteForUser = async ( req, res = response) => {

    const uidUser = req.uid;

    const rows = await pool.query(`CALL SP_LIST_FAVORITE_PRODUCTS(?);`, [ uidUser]);

    const listProducts = rows[0];

    console.log(listProducts[0]);

    for(i = 0; i < listProducts.length; i++){

        const color = JSON.parse(listProducts[i].colors);

        const picture = JSON.parse(listProducts[i].picture);

        listProducts[i].colors = color;

        listProducts[i].picture = picture;
    }

    res.json({
        resp: true,
        msj: 'List to products favorites',
        favorites: listProducts
    });
}

const saveOrderProducts = async (req, res = response) => {

    const { status, date, amount, address, products } =  req.body;
    const uid = req.uid;

    const db = await pool.query('INSERT INTO orderBuy (user_id, status, datee, amount, address) VALUES (?,?,?,?,?)', [ uid, status, date, amount, address]);

    products.forEach(e => {
        pool.query('INSERT INTO orderDetails (orderBuy_id, product_id, quantity, price) VALUES(?,?,?,?)', [db.insertId, e.idProduct, e.quantity, e.price]);
    });

    return res.json({
        resp: true,
        msj: 'Products save'
    });
}

const getPurchasedProduct = async ( req, res = response ) => {

    const uid = req.uid;

    const orderbuy = await pool.query('SELECT uidOrderBuy, status, datee, amount FROM orderBuy WHERE user_id = ?', [uid]);

    console.log(orderbuy);

    const orderDetails = await pool.query(`CALL SP_ORDER_DETAILS(?);`, [orderbuy[0].uidOrderBuy]);

    const details = orderDetails[0];

    for(i=0; i<details.length; i++){
        var picture = JSON.parse(details[i].picture);

        details[i].picture = picture;
    }

    res.json({
        resp: true,
        msg: 'Get Puchased Products',
        orderBuy: orderbuy,
        orderDetails: details
    });
}

const getProductsForCategories = async ( req, res = response) => {

    const rows = await pool.query('SELECT * FROM Products WHERE subcategory_id = ?', [req.params.id]);

    console.log(rows);

    for(i=0; i<rows.length; i++){
        const colors = JSON.parse(rows[i].colors);

        const picture = JSON.parse(rows[i].picture);

        rows[i].colors = colors;

        rows[i].picture = picture;
    }

    res.json({
        resp: true,
        msj: 'List Products',
        products: rows
    });

}

const getBrandList = async(req, res = response) => {

    const rows = await pool.query(`CALL SP_BRAND_LIST(?);`, [req.params.subCategoryId]);
    
    console.log(rows[0]);

    res.json({
        resp: true,
        msj: 'List brands',
        brands: rows[0]
    });
}

module.exports = {
    addFavoriteProduct,
    productFavoriteForUser,
    saveOrderProducts,
    getPurchasedProduct,
    getProductsForCategories,
    getBrandList
}