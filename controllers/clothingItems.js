const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .populate(["owner", "likes"])
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;

  if (!owner) {
    return res
      .status(400)
      .send({ message: "owner is required (will come from auth later)" });
  }

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => item.populate(["owner", "likes"]))
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid item data", details: err.errors });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((deleted) =>
      res
        .status(200)
        .send({ message: "Item deleted successfully", _id: deleted._id })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};
