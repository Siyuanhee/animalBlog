const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const animalData = data.animals;
const likeData = data.likes;

router.post("/*", async (req, res) => {

    try {
        if (!animalData.getAnimalById(req.params[0])) {
            res.sendStatus(404)
            return
        }
        if (!postData.getPostById(req.query.postId)) {
            res.sendStatus(404)
            return
        }

        likeData.addLikes(req.params[0], req.query.postId)
        res.sendStatus(200)
    } catch (e) {
        res.status(200).json({ error: e });
    }
});

router.delete("/*", async (req, res) => {

    try {
        if (!animalData.getAnimalById(req.params[0])) {
            res.sendStatus(404)
            return
        }
        if (!postData.getPostById(req.query.postId)) {
            res.sendStatus(404)
            return
        }

        likeData.deleteLikes(req.params[0], req.query.postId)
        res.sendStatus(200)
    } catch (e) {
        res.status(200).json({ error: e });
    }
});



module.exports = router;