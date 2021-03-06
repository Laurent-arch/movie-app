const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator");
const User = require("../models/User");

const {
  getAllMovies,
  insertMovie,
  getMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movies");

const {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/authentication");

router.get("/", getAllMovies);
router.get("/insert", isAuth, insertMovie).post("/insert", isAuth, insertMovie);
router.get("/edit-movie/:id", isAuth, getMovie);
router
  .get("/update/:id", isAuth, updateMovie)
  .post("/update/:id", isAuth, updateMovie);
router.post("/delete-movie", isAuth, deleteMovie);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  postSignup
);
router.post("/logout", postLogout);
router.get("/reset", getReset);
router.post("/reset", postReset);
router.get("/reset/:token", getNewPassword);
router.post("/reset/:token", postNewPassword);

module.exports = router;
