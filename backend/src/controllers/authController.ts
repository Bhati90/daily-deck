import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ username, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      streak: user.streak,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const authUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        streak: user.streak,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
};

export const getUserProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);
    if(user){
        res.json({
            _id: user._id,
            username: user.username,
            streak: user.streak,
            lastQuizTakenAt: user.lastQuizTakenAt
        });
    } else {
        res.status(404).json({ message: 'User not found'});
    }
};