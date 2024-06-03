import { db } from "../datasource";
import { Users } from "../entity/User";
import bcrypt from "bcrypt";
const userRepository = db.getRepository(Users);

type User = {
  username: string;
  email: string;
  password: string;
};

async function list() {
  try {
    const result = await userRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching users list:", error);
    throw new Error("Internal server error");
  }
}

async function create({ username, email, password }: User) {
  try {
    const user = userRepository.create({ username, email, password });
    await userRepository.save(user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Internal server error");
  }
}

async function getUserByID(userID: number) {
  try {
    const result = await userRepository.findOne({ where: { id: userID } });
    return result;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Internal server error");
  }
}

async function update(userID: number, { username, email, password }: User) {
  try {
    const user = await userRepository.findOneBy({ id: userID });
    if (!user) {
      throw new Error("User not found");
    }
    userRepository.merge(user, { username, email, password });
    return await userRepository.save(user);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Internal server error");
  }
}

async function remove(userID: number) {
  try {
    const user = await userRepository.findOneBy({ id: userID });
    if (!user) {
      throw new Error("User not found");
    }
    return await userRepository.remove(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Internal server error");
  }
}

async function register(res: any, { username, email, password }: User) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Internal server error");
  }
}

async function login(
  res: any,
  { email, password }: { email: string; password: string }
) {
  try {
    const user = await userRepository.findOneBy({ email });

    const passwordMatch = await bcrypt.compare(password, user!.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Internal server error");
  }
}

export const usersService = {
  list,
  create,
  getUserByID,
  update,
  remove,
  register,
  login,
};
