import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";
import { TicketRepository } from "../dao/repositories/TicketRepository.js";
import { v4 as uuidv4 } from "uuid";

const ticketRepository = new TicketRepository();

class CartController {
    async purchase(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartModel.findById(cid).populate("products.product");

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            let totalAmount = 0;
            let unprocessedProducts = [];

            for (let item of cart.products) {
                const product = await productModel.findById(item.product._id);

                if (!product) {
                    unprocessedProducts.push(item.product._id);
                    continue;
                }

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    totalAmount += product.price * item.quantity;
                    await product.save();
                } else {
                    unprocessedProducts.push(product._id);
                }
            }

            if (totalAmount > 0) {
                const ticket = await ticketRepository.createTicket({
                    code: uuidv4(),
                    amount: totalAmount,
                    purchaser: req.user.email
                });

                // Filtracion productos NO procesados
                cart.products = cart.products.filter(p => !unprocessedProducts.includes(p.product._id));
                await cart.save();

                return res.status(200).json({ ticket, unprocessedProducts });
            }

            return res.status(400).json({ message: "No products were processed", unprocessedProducts });
        } catch (error) {
            console.error("Error in purchase:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const cartController = new CartController();
