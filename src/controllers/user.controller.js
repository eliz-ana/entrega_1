import user from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




//---------------get all users----------------//
export async function getUsers(req,res,next) {
    try {
        const users=await user.find().lean();
        res.json(users);
    } catch (error) {
        next(error);
    }
    
}
//---------------get user by id----------------//
export async function getUserById(req,res,next) {
    try {
        const userId=await user.findById(req.params.uid).lean();
        if(!userId){
            return res.status(404).json({error:"User not found"});
        }
        res.json(userId);
    } catch (error) {
        next(error);
    }
};

//---------------create user----------------//
export async function createUser(req,res,next) {
    try {
        const {first_name,last_name,email,age,password,cart,role}=req.body;
        if(!first_name || !last_name || !email || typeof age !=="number" || !password ){
            return res.status(400).json({error:"Invalid data"});
        }
        const exist = await user.findOne({email: email.toLowerCase().trim()});
        if(exist){
            return res.status(400).json({error:"Email already registered"});
        }
        const newUser= await user.create({
            first_name,
            last_name,
            email: email.toLowerCase().trim(),
            age,
            password: await bcrypt.hash(password, 10),
            cart: cart || null,
            role: role || "user"
        });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
        
    }
}

//---------------update user----------------//

export async function updateUser(req,res,next) {
    try {
        const update= {...req.body};
        if(update.email)update.email= update.email.toLowerCase().trim();
        if(update.password)update.password= bcrypt.hashSync(update.password,10);
        
        const updated= await user.findByIdAndUpdate(
            req.params.uid,
            update,
            {new:true,runValidators:true});
        if(!updated){
            return res.status(404).json({error:"User not found"});
        }
        return res.json(updated);
    } catch (error) {
        next(error)
    }
    
}

//---------------delete user----------------//
export async function deleteUser(req,res,next) {
    try {
        const deleted = await user.findByIdAndDelete(req.params.uid);
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}