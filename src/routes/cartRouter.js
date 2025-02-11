import { Router } from 'express';
import { isUser } from '../middlewares/authMiddleware.js';
import Cart from '../dao/models/cartModel.js';
import Product from '../dao/models/productModel.js';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { cartController } from '../controllers/cart.controller.js';

const router = Router();
const cartRouter = express.Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

router.get('/:cid', async (req, res) => {

    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {

    try {
        const result = await CartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        const result = await CartService.addProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post("/:cid/purchase", 
    isUser, 
    cartController.purchase
);

cartRouter.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).exec();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        } else {
            const cart = await Cart.findone({ user: req.user._id }).exec();
            if (!cart) {
                const newCart = new Cart({ user: req.user._id, products: [product] });
                await newCart.save();
                return res.status(201).json({ message: 'Product added to cart' });
            } else {
                const productAlreadyInCart = cart.products.find((p) => p._id.toString() === product._id.toString());
                if (productAlreadyInCart) {
                    return res.status(400).json({ message: 'Product already in cart' });
                } else {
                    cart.products.push(product);
                    await cart.save();
                    res.status(201).json({ message: 'Product added to cart' });
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'Error adding product to cart' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {

    try {
        const result = await CartService.deleteProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', async (req, res) => {

    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {

    try {
        const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', async (req, res) => {

    try {
        const result = await CartService.deleteAllProducts(req.params.cid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
export { cartRouter };