const fs = require('fs')
// User Model
const Sauce = require('../models/Sauce')

// get all sauces
exports.getAll =(req, res) => {

    Sauce.find()
        .then(sauces => res.json(sauces))
}

// create a sauce

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        like: 0,
        dislike: 0,
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
}

// get a sauce

exports.getSauce =(req, res) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {

            console.log(req.params.id)
            res.status(404).json({
                error: error
            });
        }
    );
}

// modify a sauce

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

// delete a sauce
exports.deleteSauce =(req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
}
// // like/dislike
exports.likeDislike = (req, res) => {

    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    if (like === 1) {
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
            .then(() => res.status(200).json({ message: "Like" }))
            .catch((error) => res.status(400).json({ error }))

    } else if (like === -1) {

        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
            .then(() => res.status(200).json({ message: "Dislike" }))
            .catch((error) => res.status(400).json({ error }))

    } else if (like === 0) {

        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: "Cancel Like" }))
                        .catch((error) => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: "Cancel Dislike" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    }
}
