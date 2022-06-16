const { response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');

const getAVGRating = async(req, res = response) => {
    const row = await pool.query(`CALL SP_GET_RATTING();`,[req.params.idProduct]);
    console.log(row[0][0])
}

module.exports = {
    getAVGRating
}