// import { Request, Response } from "express";
// import { Profile } from "../entity/Profile";
// import { db } from "../datasource";
// import { getManager } from "typeorm";
// import { Users } from "../entity/User";

// // const profileRepository = db.getRepository(Profile);

// async function profile(req: Request, res: Response) {
//   const entityManager = getManager();

//   const profile = new Profile();
//   profile.gender = "Male";
//   profile.photo = "photo.jpg";

//   let data = await entityManager.save(profile);

//   const user = new Users();
//   user.username = "Hello";
//   user.profile = profile;
//   await entityManager.save(user);

//   res.json({ test: "ok" });
// }

// export const profileController = { profile };
