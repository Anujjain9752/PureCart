import jwt from "jsonwebtoken";

const authUser = async (req,res,next) => {
    
    const {token} = req.cookies;
    if(!token) {
        return res.json({success: false, message: "Not Unauthorized"});
    }
    
    try {
       const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
       if(!tokenDecode){
         return res.json({success: false, message: "Not Unauthorized"});
       }


      req.userId = tokenDecode.id;
      
       next();
    }catch(error) {
          return res.json({success: false, message: "Not Unauthorized 1"});
    }

}


export default authUser;