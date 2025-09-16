import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/session.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;