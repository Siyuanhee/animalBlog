const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get("/", async (req, res) => {
    try {
        const postList = await postData.getAllPosts();
        res.json(postList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await postData.getPostById(req.params.id);
        res.json(post);
    } catch (e) {
        res.status(404).json({ error: "Post not found" });
    }
});

router.post("/", async (req, res) => {
    const blogPostData = req.body;
    try {
        const { title, author, content } = blogPostData;
        const newPost = await postData.addPost(title, author, content);

        res.json(newPost);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.delete("/:id", async (req, res) =>{
    try{
        await postData.getPostById(req.params.id)
    } catch (e) {
        res.status(404).json({ error: "Animal not found" })
        return
    }

    try{
        const deletedInfo = await postData.removePost(req.params.id)
        res.status(200)
        res.json(deletedInfo)
    } catch (e) {
        res.sendStatus(500);
        return;
    }
});

router.put("/:id", async (req, res) => {

    const postInfo = req.body
    if (!postInfo.newTitle & !postInfo.newContent) {
        res.status(400).json({error: "you must provide a new title or a new content"});
        return;
    }
    try{
        await postData.getPostById(req.params.id)
    }catch (e) {
        res.status(404).json({error: "Post not found"});
        return;
    }
    try{
        const updatedPost = await postData.updatePost(req.params.id, postInfo)
        res.json(updatedPost)
    }catch (e) {
        res.sendStatus(500);
        return;
    }
})

module.exports = router;

