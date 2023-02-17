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

    res.send(user)
}

export const Login = async (req: Request, res : Response) => {

    const { email , password } = req.body;

    const user = await repository.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        return res.status(400).send({
            message: "Incorrect Information"
        })
    }

    if (!await bcryptjs.compare(password, user.password)) {

        return res.status(400).send({
            message: "Invalid Information"
        })
    }

    const accessToken = sign({
        id: user.id
    }, "access_secret", {expiresIn : 60 * 60});

    const refreshToken =sign({
        id: user.id
    }, "refresh_token", {expiresIn: 24 * 60 
    * 60})

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.send({
        message: "Successful"
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        console.log(req.cookies);
        const accessToken = req.cookies['accessToken'];

        const payload: any = verify(accessToken, "access_secret");

        if(!payload) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await repository.findOne({
            where: {
                id: payload.id
            }
        });

        if (!user) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const {password, ...data} = user;

        res.send(data);

    }catch(e) {
        console.log(e)
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie('accessToken', '', {maxAge: 0});
    res.cookie('refreshToken', '', {maxAge: 0});
}