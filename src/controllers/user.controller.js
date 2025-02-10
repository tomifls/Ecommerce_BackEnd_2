import { UserDTO } from "../dto/UserDto.js";

class UserController {
    getCurrentUser(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userDTO = new UserDTO(req.user);
        res.json(userDTO);
    }
}

export const userController = new UserController();
