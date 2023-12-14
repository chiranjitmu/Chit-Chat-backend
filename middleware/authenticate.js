import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(' ')[1];
      let user = jwt.verify(token, process.env.SECRET_KEY);

      next();
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

export default auth;