import { postRouter } from "./post.route";
import { usersRouter } from "./users.route";
import { viewRouter } from "./view.route";

const routers = {
  ["users"]: usersRouter,
  ["view"]: viewRouter,
  // ["profile"]: profileRouter,
  ["post"]: postRouter,
} as const;

export { routers };
