const mongoCollections = require("./collections");
const animals = mongoCollections.animals;
const uuid = require("node-uuid");

const exportedMethod = {

    async getAllAnimals(){
        const animalCollection = await animals()
        const allAnimal = await animalCollection.find({}).toArray()
        return allAnimal
    },

    async getAnimalById(id){
        if (!id) throw "you must provide an id to search for"
        const animalCollection = await animals()
        const animal = await animalCollection.findOne({_id: id})
        if (animal ===null) throw "no animal with that id"
         return animal

    },

    async addAnimal(name, animalType) {
        if (!name) throw "you must provide a name"
        if (!animalType) throw "you must provide a animalType"

        const animalCollection = await animals()

        let newAnimal = {
            name: name,
            animalType: animalType,
            _id: uuid.v4(),
            likes: []
        }
        const insertInfo = await animalCollection.insertOne(newAnimal)
        if (insertInfo.insertedCount === 0) throw "can not add animal"
        const newId = insertInfo.insertedId
        const animal = await this.getAnimalById(newId)
        return animal
    },

    async updateAnimal(id, updatedAnimal){
        if (!id) throw "you must provide an id to be updated"
        if (!updatedAnimal.newName && !updatedAnimal.newType) throw "you must provide a new name or a new type"
        const animalCollection = await animals()
        const updateData = {}

        if (updatedAnimal.newName) {updateData.name = updatedAnimal.newName}
        if (updatedAnimal.newType) {updateData.animalType = updatedAnimal.newType}

        const updatedInfo = await animalCollection.updateOne({_id: id}, {$set:  updateData})
        if (updatedInfo.modifiedCount === 0) throw "can not updated animal successfully"
        return await this.getAnimalById(id);
    },

    async deleteAnimal(id){
        if (!id) throw "you must provide an id"
        const animalCollection = await animals()
        const deletionInfo = await animalCollection.removeOne({_id: id})
        if (deletionInfo.deletedCount === 0) throw "Could not delete animal with id of ${id}"
    },


}

module.exports = exportedMethod