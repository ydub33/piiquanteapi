const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// User Model
const User = require('../models/User')

exports.signup = (req, res) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = new User({
                email: req.body.email,
                password: hash
            });
            newUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}

exports.login = (req, res) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'incorrect login' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}
