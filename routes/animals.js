const express = require("express");
const router = express.Router();
const data = require("../data");
const animalData = data.animals;
const postData = data.posts;

router.get("/", async (req, res) => {
    try {
        const animalList = await animalData.getAllAnimals();
        const length = animalList.length
        for (let i = 0; i <length; i++){
            const postList = await postData.listToArray(animalList[i]._id)
            animalList[i].posts = postList
        }
        res.json(animalList);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/:id", async (req, res) => {
    try {
        const animal = await animalData.getAnimalById(req.params.id)
        const post = await postData.listToArray(animal._id)
        animal.posts = post
        res.json(animal);
    } catch (e) {
        res.status(404).json({ message: "Animal not found" });
    }
});

router.post("/", async (req, res) => {
    const animalInfo = req.body;
    //console.log(req.body);

    if (!animalInfo) {
        res.status(400).json({ error: "You must provide data to create a animal" });
        return;
    }
    if (!animalInfo.name) {
        res.status(400).json({ error: "You must provide a name" });
        return;
    }
    if (!animalInfo.animalType) {
        res.status(400).json({ error: "You must provide a type" });
        return;
    }

    try {
        const newAnimal = await animalData.addAnimal(
            animalInfo.name,
            animalInfo.animalType
        );
        const post = await postData.listToArray(newAnimal._id)
        newAnimal.posts = post
        res.json(newAnimal);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.put("/:id", async (req,res) => {
    const animalInfo = req.body

    if (!animalInfo) {
        res.status(400).json({error: "You must provide data to update a animal"});
        return;
    }
    if (!animalInfo.newName && !animalInfo.newType) {
        res.status(400).json({error: "You must provide a new name or new type"});
        return;
    }

    try {
        await animalData.getAnimalById(req.params.id)
    } catch (e) {
        res.status(404).json({error: "Animal not found"});
        return;
    }
    try {
        const updatedAnimal = await animalData.updateAnimal(req.params.id, animalInfo)
        const post = await postData.listToArray(updatedAnimal._id)
        updatedAnimal.posts = post
        res.json(updatedAnimal)
    } catch (e) {
        res.sendStatus(500)
    }
})
    
    router.delete("/:id", async (req, res) => {
        try{
            await animalData.getAnimalById(req.params.id)
        } catch (e) {
            res.status(404).json({ error: "Animal not found" })
            return
        }
        
        try{
            const animal = await animalData.getAnimalById(req.params.id)
            const post = await postData.listToArray(animal._id)
            animal.posts = post
            const length = animal.posts.length
            for (let i = 0; i < length; i++){
                await postData.removePost(animal.posts[i]._id)
            }
            await animalData.deleteAnimal(req.params.id)
            res.json(animal)
        } catch (e) {
            res.sendStatus(500);
            return;
        }
    })

module.exports = router;