const { response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const pool = require('../Database/database');

const changePhotoProfile = async (req, res = response ) => {

    const { uidPerson } = req.body;
    const pathNew = req.file.filename;

    const rows = await pool.query('SELECT image FROM person WHERE uid = ?', [uidPerson]);

    if( rows[0].image != ''){
        await fs.unlink(path.resolve('src/Uploads/Profile/'+rows[0].image))
    }

    await pool.query(`CALL SP_SAVE_IMAGE_PROFILE(?,?);`,[pathNew, uidPerson]);

    return res.json({
        resp: true,
        msj : 'Updated image',
        profile : pathNew
    });
}

const userPersonalRegister = async ( req, res = response ) => {

    const { firstname, lastname, phone, address, reference} = req.body;

    //const uid = req.uid;

    await pool.query(`CALL SP_REGISTER_PERSONAL(?,?,?,?,?);`, [ firstname, lastname, phone, address, reference ]);

    return res.json({
        resp: true,
        msj: 'Infomation personal added'
    });
}

const getPersonalInformation = async ( req, res = response ) => {

    const uid = req.uid;

    const user = await pool.query('SELECT uid, firstName, lastName, phone, address, reference, image FROM person WHERE uid = ?',[ uid ]);

    return res.json({
        resp: true,
        msj: 'Get personal, information',
        information: user[0]
    });
}

module.exports = {
    changePhotoProfile,
    userPersonalRegister,
    getPersonalInformation
}