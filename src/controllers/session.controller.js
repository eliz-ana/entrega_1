import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Helper para firmar el token
function signToken(user) {
    const payload={uid:user._id,role:user.role, email:user.email};
    return jwt.sign(payload,process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN || "1d"})
};
// Controlador de registro 
export async function register(req,res,next){
    try {
        const {first_name,last_name,email,age,password,cart,role}=req.body;

        if(!first_name || !last_name || !email || typeof age !== "number" || !password){
            return res.status(400).json({error:"Datos invalidos"});
        }
        const exist=await User.findOne({email:email.toLowerCase().trim()});
        if(exist){
            return res.status(400).json({error:"El email ya esta registrado"});
        }

      
        const user=await User.create({
            first_name,
            last_name,
            email,
            age,
            password:bcrypt.hashSync(password,10),
            cart:  cart || null,
            role: role || undefined
        });

        const token=signToken(user);
        res.cookie("authToken",token,{
            httpOnly:true,
            sameSite:"lax",
            secure: true
        })
        return res.status(201).json({ token, user });
    } catch (error) {
        next(error);
        
    }
};
// Controlador de login
export async function login(req,res,next){
    try {
         const { email, password } = req.body;
          const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
     const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken(user);
     res.cookie("authToken",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:  process.env.NODE_ENV === "production",
        })
    res.json({ token, user }); 
    } catch (error) {
        next(error);
    }
}