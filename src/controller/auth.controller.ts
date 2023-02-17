import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import bcryptjs from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { dataSource } from "../datasource";


const repository = dataSource.getRepository(User)

export const Register = async (req: Request, res: Response) => {
    
    const { name, email, password } = req.body;

    const user = await repository.save({
        name,
        email,
        password: await bcryptjs.hash(password, 12)
    })
}