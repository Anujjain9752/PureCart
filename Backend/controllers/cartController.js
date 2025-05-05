import User from "../models/User.js";


// update user CartData: /api/cart/update



export const updateCart = async (req, res) => { 


  try{

    const {cartItems} = req.body;
    const userId = req.userId;
    await User.findByIdAndUpdate(userId, {cartItems});
    res.json({success: true, message: "Cart updated successfully"});
  }catch (error) {
    console.error(error.message);
    res.json({success: false, message: error.message});
  }
                 






}