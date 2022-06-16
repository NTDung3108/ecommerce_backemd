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

        const respone = await pool.query(`CALL SP_NEW_COMMENT (?,?,?,?,?)`, in_productId, in_personId, in_rating, in_comment, '', in_date);

        console.log(respone);

        return res.json({
            resp : true,
            msj : 'Add new rating success',
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
        });
    }
    
}

// DELIMITER //
// CREATE PROCEDURE SP_GET_RATTING (IN in_idProduct INT)
// BEGIN
// 	SELECT AVG(rating) as rating FROM rating WHERE product_id = in_idProduct;
// END//

// DELIMITER //
// CREATE PROCEDURE SP_GET_COMMENT (IN in_idProduct INT)
// BEGIN
// 	SELECT r.person_id, p.firstName, p.lastName, p.image, r.comment, r.rating, r.date FROM rating AS r
//     INNER JOIN person AS p ON p.uid = r.person_id
//     WHERE product_id = in_idProduct;
// END//

// DELIMITER //
// CREATE PROCEDURE SP_NEW_COMMENT (IN in_idProduct INT, IN in_personId VARCHAR(50), IN in_rating double, IN in_date DATE)
// BEGIN
// 	INSERT INTO rating(product_id, person_id, rating, comment, date) VALUE (in_idProduct, in_personId, in_rating, in_date);
// END//

module.exports = {
    getCommet,
    getAVGRating,
    addNewRating
}