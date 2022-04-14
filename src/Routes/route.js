const { Router } = require('express');
const { check } = require('express-validator');
const { createUser } = require('../Controller/Register');
const { LoginUser, RenewToken, RefreshToken} = require('../Controller/LoginController');
const { ValidatedAuth} = require('../Middlewares/ValidateAuth');
const { validateToken } = require('../Middlewares/ValidateToken');
const { changePhotoProfile, userPersonalRegister, getPersonalInformation, 
    updateFirstName, updateLastName, updatePhone, updateAddress, checkPhone, forgotPassword} = require('../Controller/UserController');
const { uploadsProfile } = require('../Helpers/Multer');
const { ListProductsHome, ListCategoriesAll, ListCategoriesHome, ListSubCategoriesAll,
     ListDiscaountBannerHome, ListSubcategoriesHome, getAllSubCategories} = require('../Controller/HomeController');
const { addFavoriteProduct, productFavoriteForUser, saveOrderProducts, getPurchasedProduct, 
    getProductsForCategories, getBrandList, getAllProducts, checkQuantityProduct, getDetailOders,
    updateOrderStatus} = require('../Controller/ProductsController');


const router = Router();


router.post( '/api/register', [
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    check('idUser', 'idUser is required').not().isEmpty(),
    ValidatedAuth
], createUser);

router.post('/api/login',[
    check('phone', 'PhoneNumber is required').isMobilePhone(),
    check('password', 'Password is required').not().isEmpty(),
    ValidatedAuth
], LoginUser );

router.put('/api/personal/register', userPersonalRegister);

router.put('/api/personal/updateFirstName', validateToken, updateFirstName);
router.put('/api/personal/updateLastName', validateToken, updateLastName);
router.put('/api/personal/updatePhone', validateToken, updatePhone);
router.put('/api/personal/updateAddress', validateToken, updateAddress);

router.get('/api/get-personal-information', validateToken, getPersonalInformation);

router.get('/api/login/renew', validateToken, RenewToken);

router.post('/api/login/refresh-token', RefreshToken)

router.put('/api/update-image-profile', [validateToken, uploadsProfile.single('image')], changePhotoProfile);

router.get('/api/check-phone/:phone', checkPhone);

router.put('/api/forgot-password', forgotPassword);



//router home
router.get('/api/list-products-home', ListProductsHome);
router.get('/api/list-categories-home', ListCategoriesHome);
router.get('/api/discount-banners-home', ListDiscaountBannerHome);
router.get('/api/list-subcategory-home', ListSubcategoriesHome);


//router categoris
router.get('/api/list-categories-all', ListCategoriesAll);

//router subcategoris
router.get('/api/list-subcategories-all/:idCategory', ListSubCategoriesAll);
router.get('/api/get-all-subcategories', getAllSubCategories);


//Products
router.post('/api/add-Favorite-Product', validateToken, addFavoriteProduct);
router.get('/api/product-favorite-for-user', validateToken, productFavoriteForUser);
router.post('/api/save-order-products', validateToken, saveOrderProducts);
router.get('/api/get-purchased-products', validateToken, getPurchasedProduct);
router.get('/api/get-products-for-subcategories/:id', getProductsForCategories);
router.get('/api/get-brands-list/:subCategoryId', getBrandList);
router.get('/api/get-all-product', getAllProducts);
router.put('/api/update-quantity-product', validateToken, checkQuantityProduct);
router.get('/api/get-detail-by-id/:orderId', validateToken, getDetailOders);
router.put('/api/update-order-status', validateToken, updateOrderStatus);

module.exports = router;