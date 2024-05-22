const express = require ("express");
const { getBioProfile, followUser, unfollowUser, getSingleUser, getAllUsers, searchUsers,updateUserProfile} =require("../controllers/userController");
const router = express.Router();
const authMiddleWare = require("../middleware/auth")

//search users
router.get("/search" ,searchUsers)
// own account
router.get('/' , authMiddleWare, getBioProfile);
//follower user
router.post("/follow/:followersId" , authMiddleWare,followUser)
// unfollow user
router.post("/unfollow/:followerId", authMiddleWare,unfollowUser);
// single user
router.get("/userprofile/:userId", getSingleUser)
// all users
router.get("/" ,getAllUsers)
// update user profile
router.patch('/update-profile', authMiddleWare,updateUserProfile)
module.exports = router