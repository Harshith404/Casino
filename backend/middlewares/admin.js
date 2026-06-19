function admin(req,res,next)
{ console.log(req.user);
    if(req.user.role !== "admin")
    {
        return res.status(403).json({
            error:"Admin access only"
        });
    }

    next();
}

module.exports = admin;