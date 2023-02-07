const { fileUpload } = require("../../helpers/cloudinary");
const { validationResult } = require("express-validator");
const { ReE, ReS } = require("../../helpers/utils");
const Bond = require("../../models/bond.model");
const MyBond = require("../../models/my-bond.model");
const cloudinary = require("../../helpers/cloudinary");
const fs = require("fs");
const pagination = require("../../helpers/pagination");
const User = require("../../models/user.model");
const BondsWon = require("../../models/bonds-won.model");
const BondClaimed = require("../../models/bonds-claimed.model");
const BondSeries = require("../../models/bond-series.model");
const DrawBond = require("../../models/draw-bond.model");

exports.getBonds = async (req, res) => {
  try {
    let bonds = await pagination(req, BondSeries, ["bond"], {});

    await Promise.all(
      bonds?.results?.map(async (bond) => {
        if (!bond.bond.imagePath.includes("http"))
          bond.bond.imagePath = process.env.ADMIN_URL + bond?.bond?.imagePath;
      }),
    );

    return ReS(res, { bonds, message: "Bonds With Pagination!" }, 200);
  } catch (e) {
    return ReE(res, e.message, 500);
  }
};
