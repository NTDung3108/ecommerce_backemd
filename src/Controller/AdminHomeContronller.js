const{ response } = require('express');
const pool = require('../Database/database');

const topBuyers = async (req, res = response) => {
    try {
        const buyers = await pool.query(`CALL SP_TOP_BUYERS;`);
        return res.status(200).json({
            resp : true,
            msj : 'Success',
            buyers: buyers[0]
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            buyers: []
        });
    }
};

const revenue = async(req, res = response) => {
    try {
        const revenue = pool.query('SELECT SUM(amount) AS amount FROM orderbuy WHERE status = 2');

        return res.json({
            resp : true,
            msj : 'Revenue',
            revenue: revenue
        });
        
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            revenue: null
        });
    }
}

const sumProduct = async(req, res = response) => {
    try {
        const sum = pool.query('SELECT COUNT(idProduct) FROM products WHERE status = 1');

        return res.json({
            resp : true,
            msj : 'Revenue',
            sumProduct: sum
        });
        
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            sumProduct: null
        });
    }
}

const sumOrder = async(req, res = response) => {
    try {
        const sum = pool.query('SELECT COUNT(uidOrderBuy) AS amount FROM orderbuy WHERE status = 2');

        return res.json({
            resp : true,
            msj : 'Revenue',
            sumOrder: sum
        });
        
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            sumOrder: null
        });
    }
}

module.exports = {
    topBuyers,
    revenue,
    sumProduct,
    sumOrder
}