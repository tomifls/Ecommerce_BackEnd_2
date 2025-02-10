import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/current", userController.getCurrentUser);

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
    const users = await userModel.find();
    res.json(users);
})

userRouter.post('/create', (req, res) => {
const user = new User(req.body);
    user.save((err) => {
        if (err) {
            res.status(400).send({ message: 'Error al crear usuario' });
        } else {
            res.send({ message: 'Usuario creado con éxito' });
        }
    });
});

export default router;