import { NextApiHandler } from "next";
import { getUserByUserId } from "./user";

// verify login state
const handler: NextApiHandler = async (req, res) => {
  const userId = req.cookies["PROMPT_GENERATOR_USER"];
  if (!userId) {
    res.status(200).json({ message: "You're not logged in yet!", loggedIn: false });
    return;
  }
  const user = getUserByUserId(userId);
  if (!user) {
    res.setHeader("Set-Cookie", "PROMPT_GENERATOR_USER=; Max-Age=0");
    res.status(200).json({ message: "Your login session has been expired!", loggedIn: false });
    return;
  }
  return res.status(200).json({ message: "You're logged in!", loggedIn: true });
};
export default handler;
