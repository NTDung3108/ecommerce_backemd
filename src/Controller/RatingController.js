const{ response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');

const getCommet = async(req, res = response) => {
    try {
        const rows = await pool.query(`CALL SP_GET_COMMENT(?);`, [req.params.idProduct]);
        if(rows[0].length == 0){
            return res.json({
                resp : false,
                msj : 'No rating',
                rating:[]
            });
        }

        for (i = 0; i < rows[0].length; i++) {
            var a = moment.tz(rows[0][i].date, "Asia/Ho_Chi_Minh");
            console.log(a.format('DD/MM/yyyy'));
    
            rows[0][i].date = a.format('DD/MM/yyyy');
        }

        return res.json({
            resp : true,
            msj : 'Ratings',
            ratings: rows[0]
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            rating:[]
        });
    }
    
}

const getAVGRating = async(req, res = response) => {
    try {
        console.log(req.params.productId);
        const rows = await pool.query(`CALL SP_GET_RATTING(?);`,[req.params.idProduct]);        
        var rating = rows[0][0].rating;
        console.log(rating)
        if(rating == 0 || rating == null){
            return res.json({
                resp : false,
                msj : 'No rating',
                rating: 0.0
            });
        }
        return res.json({
            resp : true,
            msj : 'Rating',
            rating: rating
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            rating: 0.0
        });
    }
    
}

const addNewRating = async(req, res = response) => {
    const {in_productId, in_personId, in_rating, in_comment, in_date} = req.body;
    try {
        if(in_productId == undefined || in_personId == undefined || in_rating == undefined 
            || in_comment == undefined || in_date == undefined){
            return res.json({
                resp : false,
                msj : 'Missing product information',
            });
        }

        await pool.query(`CALL SP_NEW_COMMENT (?,?,?,?,?);`, [in_productId, in_personId, in_rating, in_comment, in_date]);

        return res.json({
            resp : true,
            msj : 'Add new rating success',
        });
    } catch (error) {
        return res.status(400).json({
            resp : false,
            msj : error,
        });
    }
    
}


module.exports = {
    getCommet,
    getAVGRating,
    addNewRating
}