const postRoutes = require("./posts")
const animalRoutes = require("./animals");

const constructorMethod = app => {
    app.use("/animals", animalRoutes);
    app.use("/posts", postRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;