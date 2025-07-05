import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import genToken from '../config/token.js';

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = genToken(user._id); // jwt.sign is sync, so no await needed

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    const { password: _, ...safeUser } = user._doc;

    return res.status(201).json(safeUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sign up error' });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = genToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    const { password: _, ...safeUser } = user._doc;

    return res.status(200).json(safeUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Login error' });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout error' });
  }
};
