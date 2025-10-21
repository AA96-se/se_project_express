const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_MESSAGE,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .populate(["owner", "likes"])
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: INTERNAL_SERVER_MESSAGE });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;
  const ownerId = owner || (req.user && req.user._id);

  if (!ownerId) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "owner is required (will come from auth later)" });
  }

  ClothingItem.create({ name, weather, imageUrl, owner: ownerId })
    .then((item) => item.populate(["owner", "likes"]))
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item data", details: err.errors });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: INTERNAL_SERVER_MESSAGE });
    });
};

// Only owner can delete (from Step 10)
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user && req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== currentUserId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Forbidden: not the owner" });
      }
      return item
        .deleteOne()
        .then(() =>
          res
            .status(200)
            .send({ message: "Item deleted successfully", _id: item._id })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item id" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: INTERNAL_SERVER_MESSAGE });
    });
};

// PUT /items/:itemId/likes — like an item
const likeItem = (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authentication required" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item id" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: INTERNAL_SERVER_MESSAGE });
    });
};

// DELETE /items/:itemId/likes — unlike an item
const dislikeItem = (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authentication required" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item id" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: INTERNAL_SERVER_MESSAGE });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
