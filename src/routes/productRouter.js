import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { uploader } from '../utils/multerUtil.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const productRouter = express.Router();
const router = Router();
const ProductService = new productDBManager();

productRouter.post('/', isAdmin, async (req, res) => {
    try {
        const { name, description, code, price, stock, category, thumbnails } = req.body;
        const product = new product({ name, description, code, price, stock, category, thumbnails });
        await product.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating product' });
    }
});

productRouter.put('/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, code, price, stock, category, thumbnails } = req.body;
        const product = await Product.findByIdAndUpdate(id, { name, description, code, price, stock, category, thumbnails }, { new: true }).exec();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Product updated successfully' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating product' });
    }
});

productRouter.delete('/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id).exec();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting product' });
    }
});

router.get('/', async (req, res) => {
    const result = await ProductService.getAllProducts(req.query);

    res.send({
        status: 'success',
        payload: result
    });
});

router.get('/:pid', async (req, res) => {

    try {
        const result = await ProductService.getProductByID(req.params.pid);
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

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.path);
        });
    }

    try {
        const result = await ProductService.createProduct(req.body);
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

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await ProductService.updateProduct(req.params.pid, req.body);
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

router.delete('/:pid', async (req, res) => {

    try {
        const result = await ProductService.deleteProduct(req.params.pid);
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
export { productRouter };