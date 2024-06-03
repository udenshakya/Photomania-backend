import { Request, Response } from "express";
import { usersService } from "../services";
import jwt from "jsonwebtoken";
import { db } from "../datasource";
import { Users } from "../entity/User";
const userRepository = db.getRepository(Users);
import { JwtPayload } from "jsonwebtoken";
import * as yup from "yup";
import bcrypt from "bcrypt";
import { Post } from "../entity/Post";
const postRepository = db.getRepository(Post);

async function list(req: Request, res: Response) {
  try {
    const data = await usersService.list();
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

// async function create(req: Request, res: Response) {
//   try {
//     const { username, email, password } = req.body;

//     const data = await usersService.create({ username, email, password });
//     return res.status(201).json({ data });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }

async function getUserByID(req: Request, res: Response) {
  try {
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const data = await usersService.getUserByID(userID);
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserPosts(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);

    // Retrieve posts associated with the specified user ID
    const posts = await postRepository.find({
      where: { user: { id: userId } },
    });

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await usersService.remove(userID);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { username, email, password } = req.body;
    if (!username && !email && !password) {
      return res.status(400).json({
        error:
          "At least one field (username, email, password) must be provided for update",
      });
    }

    const updatedUser = await usersService.update(userID, {
      username,
      email,
      password,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const registerSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
});
async function register(req: Request, res: Response) {
  try {
    await registerSchema.validate(req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const userAlreadyExists = await userRepository.findOneBy({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await usersService.register(res, {
      username,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      // Validation failed
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }
    const passwordMatch = await bcrypt.compare(password, user!.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Send the token in the response header
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(201).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function myProfile(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function logout(req: Request, res: Response) {
  try {
    res.setHeader("Authorization", ""); // Clear the token in the response header
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const usersController = {
  list,
  // create,
  getUserByID,
  updateUser,
  deleteUser,
  login,
  register,
  myProfile,
  getUserPosts,
  logout,
};
