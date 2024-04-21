const User = require("../models/User");
const Transaction = require("../models/Transaction");
const categories = require("../config/categories");

const getTransactionCategories = (req, res) => {
    res.status(201).json({ transactionCategories: categories });
};

const createNewTransaction = async (req, res) => {
    const { title, charge, category } = req.body;
    const id_group = req.params?.id;
    const id_user = req.id_user;

    try {
        let transaction = await Transaction.create({
            title,
            charge,
            category,
            groupID: id_group,
            userID: id_user,
        });

        if (transaction instanceof Transaction) {
            res.status(201).json({ transaction });
        } else {
            res.status(400).json({ message: "Invalid data" });
        }
    } catch (err) {
        return res.sendStatus(500);
    }
};

module.exports = { getTransactionCategories, createNewTransaction };
