require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/constants");
const { handleOnFailError } = require("../utils/errors");
const { UnauthorizedError } = require("../errors/unauthorized-error");
const { ConflictError } = require("../errors/conflict-error");
const { BadRequestError } = require("../errors/bad-request-error");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      handleOnFailError();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, invalid ID"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((user) => {
          const userData = user.toObject();
          delete userData.password;
          return res.status(201).send({ data: userData });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError("A user with the current email already exists")
            );
          }
          if (err.name === "ValidationError") {
            next(new BadRequestError("Bad request, invalid data input"));
          }
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new UnauthorizedError("You are not authorized to do this"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
};
