const { Router } = require('express');
const { check } = require('express-validator');
const { createUser } = require('../Controller/Register');
const { LoginUser, RenewToken } = require('../Controller/LoginController');
const { ValidatedAuth} = require('../Middlewares/ValidateAuth');
const { validateToken } = require('../Middlewares/ValidateToken');
const { changePhotoProfile, userPersonalRegister, getPersonalInformation } = require('../Controller/UserController');
const { uploadsProfile } = require('../Helpers/Multer');
const { ListProductsHome, ListCategoriesAll, ListCategoriesHome, ListSubCategoriesAll, ListDiscaountBannerHome, ListSubcategoriesHome} = require('../Controller/HomeController');
const { addFavoriteProduct, productFavoriteForUser, saveOrderProducts, getPurchasedProduct, getProductsForCategories, getBrandList} = require('../Controller/ProductsController');


const router = Router();


router.post( '/api/register', [
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    check('idUser', 'idUser is required').not().isEmpty(),
    ValidatedAuth
], createUser );

//lỗi treo request
router.post('/api/login',[
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    ValidatedAuth
], LoginUser );

router.put('/api/personal/register', validateToken, userPersonalRegister);

router.get('/api/get-personal-information', validateToken, getPersonalInformation);

router.get('/api/login/renew', validateToken, RenewToken);

router.put('/api/update-image-profile', [validateToken, uploadsProfile.single('image')], changePhotoProfile);

//router home
router.get('/api/list-products-home', ListProductsHome);
router.get('/api/list-categories-home', ListCategoriesHome);
router.get('/api/discount-banners-home', ListDiscaountBannerHome);
router.get('/api/list-subcategory-home', ListSubcategoriesHome);


//router categoris
router.get('/api/list-categories-all', ListCategoriesAll);

//router subcategoris
router.get('/api/list-subcategories-all/:idCategory', ListSubCategoriesAll);

//Products
router.post('/api/add-Favorite-Product', validateToken, addFavoriteProduct);
router.get('/api/product-favorite-for-user', validateToken, productFavoriteForUser);
router.post('/api/save-order-products', validateToken, saveOrderProducts);
router.get('/api/get-purchased-products', validateToken, getPurchasedProduct);
router.get('/api/get-products-for-subcategories/:id', getProductsForCategories);
router.get('/api/get-brands-list/:subCategoryId', getBrandList)

module.exports = router;