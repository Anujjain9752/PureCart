import jwt from "jsonwebtoken";

export const authSeller = async (req,res,next) => {


 const {sellerToken } = req.cookies;

  if(!sellerToken) {
    return res.json({success: false, message: "Not Unauthorized"});
  }
  
  try{
     const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

      if(tokenDecode.email === process.env.SELLER_EMAIL){
        next();
      }else{
        return res.json({success: false, message: "Not Unauthorized"});
      }
   

  }catch(error) {
    return res.json({success: false, message: "Not Unauthorized"});
  }

}

