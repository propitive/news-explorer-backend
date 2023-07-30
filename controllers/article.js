const article = require("../models/article");
const { BadRequestError } = require("../errors/bad-request-error");
const { ForbiddenError } = require("../errors/forbidden-error");
const { NotFoundError } = require("../errors/not-found-error");

const getArticles = (req, res, next) => {
  article
    .find({ owner: req.user._id })
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const addArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  article
    .create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user._id,
    })
    .then((item) => {
      res.send({ data: item });
      console.log(req.user + "controller > article.js");
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        next(err);
      }
    });
};

const removeArticle = (req, res, next) => {
  article
    .findById(req.params.articleId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("You are not authorized to delete this item"));
        return;
      }
      item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getArticles,
  addArticle,
  removeArticle,
};