import { Router } from "express";   
import{ getUsers ,getUserById, updateUser, deleteUser,createUser} from "../controllers/user.controller.js";

const router= Router();

router.get("/", getUsers);
router.get("/:uid", getUserById);
router.post("/", createUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);



export default router;