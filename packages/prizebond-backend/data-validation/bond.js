const { body } = require("express-validator");

exports.createBond = [
  body("type").trim().notEmpty().withMessage("type is required!"),
  body("totalDraws").trim().notEmpty().withMessage("totalDraws is required!"),
  body("maxSupply").trim().notEmpty().withMessage("maxSupply is required!"),
  body("series").trim().notEmpty().withMessage("series is required!"),
  body("winningPrice1")
    .trim()
    .notEmpty()
    .withMessage("winningPrice1 is required!"),
  body("winningPrice2")
    .trim()
    .notEmpty()
    .withMessage("winningPrice2 is required!"),
  body("winningPrice3")
    .trim()
    .notEmpty()
    .withMessage("winningPrice3 is required!"),
  body("imagePath").trim().notEmpty().withMessage("imagePath is required!"),
];

exports.buyBond = [
  body("bondType").trim().notEmpty().withMessage("bondType is required!"),
  body("bondSerialNumber")
    .trim()
    .notEmpty()
    .withMessage("bondSerialNumber is required!"),
];

exports.drawBond = [
  body("bondType").trim().notEmpty().withMessage("bondType is required!"),
  body("series").trim().notEmpty().withMessage("series is required!"),
  body("drawNumber").trim().notEmpty().withMessage("drawNumber is required!"),
  body("winningAddress1")
    .trim()
    .notEmpty()
    .withMessage("winningAddress1 is required!"),
  body("winningSerialNumber1")
    .trim()
    .notEmpty()
    .withMessage("winningSerialNumber1 is required!"),
  body("winningAddress2")
    .trim()
    .notEmpty()
    .withMessage("winningAddress2 is required!"),
  body("winningSerialNumber2")
    .trim()
    .notEmpty()
    .withMessage("winningSerialNumber2 is required!"),
  body("winningAddress3")
    .trim()
    .notEmpty()
    .withMessage("winningAddress3 is required!"),
  body("winningSerialNumber3")
    .trim()
    .notEmpty()
    .withMessage("winningSerialNumber3 is required!"),
  body("transactionHash")
    .trim()
    .notEmpty()
    .withMessage("transactionHash is required!"),
];

exports.claimBond = [
  body("bondWon").trim().notEmpty().withMessage("bondWon is required!"),
];

exports.redeemBond = [
  body("bondId").trim().notEmpty().withMessage("bondId is required!"),
];
