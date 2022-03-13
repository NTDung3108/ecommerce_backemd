const jwt = require('jsonwebtoken');



const validateToken = ( req, res, next ) => {

    let token = req.header('xx-token');

    if( !token ){
        return res.status(401).json({
            resp: false,
            msj : "There is not Token in the request"
        });
    }

    try {

        // -----------------------------------Add key Jwt TOKEN
        const { uid } = jwt.verify( token, 'mysecretkey' );

        req.uid = uid;

        next();
        
    } catch (e) {
        return res.status(401).json({
            resp: false,
            msj : 'Invalid Token',
            users: {},
            token: 'Invalid Token'
        });
    }

}

module.exports = {
    validateToken
}