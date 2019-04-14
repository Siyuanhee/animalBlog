const mongoCollections = require("./collections");
const posts = mongoCollections.posts;
const animals = require("./animals");
const uuid = require("node-uuid");

const exportedMethods = {

    async listToArray(ownerId) {
        const postFromOwner = await this.getPostByOwner(ownerId)
        let newArray = []
        const length = postFromOwner.length
        for (let i = 0; i < length; i ++){
            newArray.push({
                _id: postFromOwner[i]._id,
                title: postFromOwner[i].title
            })
        }
        return newArray
    },

    async getAllPosts() {
        const postCollection = await posts();
        const allPosts =  await postCollection.find({}).toArray();
        const length = allPosts.length
        const output = []
        for (let i =0; i < length; i++){
            output.push(await this.getPostById(allPosts[i]._id))
        }
        return output
    },

    async getPostById(id) {
        if(!id)  throw "You must provide an id";
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: id });
        if (!post) throw "Post not found";
        const animalThatPosted = await animals.getAnimalById(post.author)
        const output = {
            _id: post._id,
            title: post.title,
            content: post.content,
            author:{
                _id: animalThatPosted._id,
                name: animalThatPosted.name
            }
        }

        return output;
    },

    async getPostByOwner(id) {
        if(!id)  throw "You must provide an id";
        const postCollection = await posts();
        const post = await postCollection.find({ author: id }).toArray();
        if (!post) throw "Post not found";

        return post;
    },

    async addPost(title, author, content) {
        if (typeof title !== "string") throw "No title provided";
        if (!author) throw "No author provided"
        if (typeof content !== "string") throw "No content provided";

        const postCollection = await posts();
        const animalThatPosted = await animals.getAnimalById(author)

        const newPost = {
            _id: uuid.v4(),
            title: title,
            author: author,
            content: content
        };

        const newInsertInformation = await postCollection.insertOne(newPost);
        const newId = newInsertInformation.insertedId;
        const postInfo = await this.getPostById(newId)
        const outputPost = {
            _id: postInfo._id,
            title: postInfo.title,
            content: postInfo.content,
            author: {
                _id: animalThatPosted._id,
                name: animalThatPosted.name
            }
        };
        return outputPost;
    },
    async removePost(id) {
        if(!id)  throw "You must provide an id to be removed";
        const postCollection = await posts();
        const postInfo = await this.getPostById(id)
        const deletionInfo = await postCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete post with id of ${id}`;
        }
        return {
            delete: true,
            data: postInfo
        }
    },
    async updatePost(id, updatedPost) {

        const updateInfo = {};

        if (!updatedPost.newTitle && !updatedPost.newContent) {throw "you must provide a new title or a new content"}

        if (updatedPost.newTitle) {
            updateInfo.title = updatedPost.newTitle
        }
        if (updatedPost.newContent) {
            updateInfo.content= updatedPost.newContent
        }

        const postCollection = await posts();

        const updatedInfo = await postCollection.updateOne({_id: id}, {$set: updateInfo});
        if (updatedInfo.modifiedCount ===0) throw "can not updated post successfully"
        return await this.getPostById(id);
    },

};

module.exports = exportedMethods;