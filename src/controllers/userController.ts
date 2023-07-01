import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res, { err, user, info}) => {
    
    if (err) return res.status(400).error(err);

    if (!user) {
        return res.status(400).json({message: info})
    }
    user.password = undefined;

    return res.status(201).json({
        message: info,
        user: user
    });
}

export const login = (req, res, { err, user, info}) => {
    if (err) {
        return res.status(400).error(err);
    }

    if (!user) {
        return res.json({ message: 'Username or password is incorrect'})
    }

    req.login(user, { session: false },
        async (error) => {
            if (error) return res.status(400).json(error)

            const body = { _id: user._id, username: user.username };
           
            const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
            return res.status(200).json({info, token});
        }
    );
}