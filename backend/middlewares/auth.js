const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
async function auth(req,res,next)
{
  const authHeader = req.headers.authorization;
  if(!authHeader)
  {
    return res.status(401).json({
      error:"Authorization header required"
    });
  }
  if(!authHeader.startsWith("Bearer "))
  {
    return res.status(401).json({
      error:"Invalid authorization format"
    });
  }

  const token = authHeader.trim().split(/\s+/)[1];
  if(!token)
{
    return res.status(401).json({
        error: "Token required"
    });
}
try{
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);

const user = await User.findById(decoded.userId);
if(!user)
{
  return res.status(404).json({
        error:"User not found"
    });
}
  req.user = user;
  next();
}
catch(err)
{
  console.log(err);
  return res.status(401).json({
    error:"Invalid token"
  })
}
}

module.exports = auth;