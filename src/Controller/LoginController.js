const {response} = require('express');
const pool = require('../Database/database');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');

const LoginUser = async ( req, res = response ) => {

    const {phone, password} = req.body;

    const rows = await pool.query(`CALL SP_VALIDATE_LOGIN(?);`,[ phone ]);

    if( rows[0].length > 0){

        const users = rows[0][0];
        console.log(users);

        let validatedPassword = await bcrypt.compareSync(password, users.passwordd);

        if( validatedPassword ){

            console.log(users.persona_id);

            let token = await generarJsonWebToken(users.persona_id);
            
            console.log('token: '+ token);
            
            res.header('xx-token', token);
            res.json({
                resp: true,
                msj: 'Welcome to ....',
                users: { 'id': users.persona_id, 'phone': users.phone, 'image': users.image },
                token: token
            });

            
        }else{

            return res.status(400).json({
                resp: false,
                msj: 'Wrong Credentials',
                users: { 'id': 0000, 'phone': 'invalid', 'users': 'invalid' },
                token: 'invalid'
            });
        }
    }else{
        return res.status(400).json({
            resp: false,
            msj: 'Wrong Credentials',
            users: { 'id': 0000, 'email': 'invalid', 'users' : 'invalid' },
            token: 'invalid'
        });
    }
}

const RenewToken = async ( req, res = response ) => {

    const uid = req.uid;

    const token = await generarJsonWebToken( uid );

    const rows = await pool.query(`CALL SP_RENEW_TOKEN(?);`,[uid]);

    const users = rows[0][0];

    return res.json({
        resp: true,
        msj: 'Welcome to...',
        users: { 'id': users.persona_id, 'phone': users.phone, 'image': users.image},
        token: token
    });
}

module.exports = {
    LoginUser,
    RenewToken
}
