const{ response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');


const getAllOrders = async (req, res = response, next) => {
    try {
        const row = await pool.query(`CALL SP_GET_ALL_ORDERS;`);
        const orders = row[0];

        if(orders.length == 0){
            return res.status(200).json({
                resp : true,
                msj : 'No order',
                orders: []
            });
        }

        for (i = 0; i < orders.length; i++) {
            var a = moment.tz(orders[i].datee, "Asia/Ho_Chi_Minh");
            console.log(a.format('DD/MM/yyyy HH:mm:ss'));
    
            orders[i].datee = a.format('DD/MM/yyyy HH:mm:ss');
        }
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