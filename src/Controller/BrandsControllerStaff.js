const{ response } = require('express');
const pool = require('../Database/database');

const addNewBrands = async (req, res = response) => {
    const {in_brand} = req.body;

    try {
        if(in_brand == undefined || in_brand == ''){
            return res.status(400).json({
                resp : false,
                msj : 'Missing brands information'
            });
        }
    
        if(req.file == undefined){
            return res.status(400).json({
                resp : false,
                msj : 'You must select at least 1 file.'
            });
        }
    
        await pool.query(`CALL SP_ADD_BRANDS(?,?)`,[in_brand, req.file.filename]);
        
        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });
        
    } catch (error) {
        return res.json({
            resp : false,
            msj : error
        });
    }
};

const getAllBrands = async (req, res = response) => {
    try {
        const row = await pool.query('SELECT*FROM brands');
        console.log(row);
        return res.status(200).json({
            resp : true,
            msj : 'Success',
            brands: row
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            brands: []
        });
    }
};

const deleteBrands = async (req, res = response) =>{
    
    try {
        if(req.params.idBrands == undefined || req.params.idBrands == null || req.params.idBrands == ''){
            return res.status(400).json({
                resp : false,
                msj : 'Brands deletion failed due to missing idBrands'
            });
        }
    
        await pool.query(`CALL SP_DELETE_BRANDS(?);`,[req.params.idBrands]);
    
        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error
        });
    }
}

module.exports = {
    addNewBrands,
    getAllBrands,
    deleteBrands
}