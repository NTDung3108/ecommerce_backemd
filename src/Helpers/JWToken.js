const jwt = require('jsonwebtoken');

const generarJsonWebToken = ( uid ) => {

    return new Promise( ( resolve, reject ) => {
        console.log(process.env.JWT_KEY+'');
        jwt.sign( {uid: uid}, 'mysecretkey', { 
            algorithm: "HS256",
            expiresIn: '10h'
        }, (error, token) => {
            if (error) {
              return reject(error);
            }
            resolve(token);
        });
    });   
}

module.exports = {
    generarJsonWebToken,
}