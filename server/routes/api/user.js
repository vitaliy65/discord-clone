import { Router } from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  adminGetAllUsers,
  adminGetUser,
  adminDeleteUser,
  adminUpdateUser,
} from "../../controllers/userController.js";
import { checkForAdminRole } from "../middleware/userRoleValidation.js";

const router = Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", registerUser);

// @route   POST api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post("/login", loginUser);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  getCurrentUser
);

// @route   DELETE api/users/deleteCurrentUser
// @desc    Delete current user
// @access  Private
router.delete(
  "/deleteCurrentUser",
  passport.authenticate("jwt", { session: false }),
  deleteCurrentUser
);

// @route   PATCH api/users/updateCurrentUser
// @desc    Update current user
// @access  Private
router.patch(
  "/updateCurrentUser",
  passport.authenticate("jwt", { session: false }),
  updateCurrentUser
);

// @route   GET api/users/all
// @desc    Get all users
// @access  Private admin
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  checkForAdminRole,
  adminGetAllUsers
);

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Private admin
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkForAdminRole,
  adminGetUser
);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private admin
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkForAdminRole,
  adminDeleteUser
);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private admin
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkForAdminRole,
  adminUpdateUser
);

const userRoutes = router;
export default userRoutes;
