const mongoCollections = require("./collections");
const animals = mongoCollections.animals;
const animalData = require("./animals")
const uuid = require("node-uuid");


const exportedMethods = {

    async addLikes(animalId, postId){
        if (!animalId) throw "you must provide an animal id"
        if (!postId) throw "you must provide an post id"
        if (!animalData.getAnimalById(animalId)) throw "animal not exist"

        const animalCollection = await animals()
        const animal = await animalData.getAnimalById(animalId)
        const newLike = {}
        let likeArr = []
        likeArr = animal.likes
        likeArr.push(postId)
        newLike.likes = likeArr

        const updatedInfo = await animalCollection.updateOne({_id: animalId}, {$set: newLike});
        if (updatedInfo.modifiedCount ===0) throw "can not updated like successfully"

    },

    async deleteLikes(animalId, postId){
        if (!animalId) throw "you must provide an animal id"
        if (!postId) throw "you must provide an post id"
        if (!animalData.getAnimalById(animalId)) throw "animal not exist"

        const animalCollection = await animals()
        const animal = await animalData.getAnimalById(animalId)
        const deleteInfo = {}
        let likeArr = []
        likeArr = animal.likes
        for (let i = 0; i < likeArr.length; i ++){
            if (likeArr[i] === postId)  likeArr.splice(i,i)
        }
        deleteInfo.likes = likeArr

        const updatedInfo = await animalCollection.updateOne({_id: animalId}, {$set: deleteInfo});
        if (updatedInfo.modifiedCount ===0) throw "can not updated like successfully"

    }

}

module.exports = exportedMethods;