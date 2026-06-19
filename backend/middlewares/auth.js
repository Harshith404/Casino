const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
async function auth(req,res,next)
{
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if(!authHeader)
  {
    return res.json({
      error:"Authorization header required"
    });
  }
  if(!authHeader.startsWith("Bearer "))
  {
    return res.json({
      error:"Invalid authorization format"
    });
  }

  const token = authHeader.trim().split(/\s+/)[1];
  if(!token)
{
    return res.json({
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
  return res.json({
        error:"User not found"
    });
}
  req.user = user;
  next();
}
catch(err)
{
  console.log(err);
  return res.json({
    error:"Invalid token"
  })
}
}

module.exports = auth;