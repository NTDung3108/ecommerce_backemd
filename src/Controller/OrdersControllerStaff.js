const{ response } = require('express');
const pool = require('../Database/database');

const getAllOrders = async (req, res = response) => {
    try {
        const row = await pool.query(`CALL SP_GET_ALL_ORDERS;`);
        const orders = row[0];
        return res.status(200).json({
            resp : true,
            msj : 'Success',
            orders: orders
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            orders: []
        });
    }
};

module.exports = {
    getAllOrders
}