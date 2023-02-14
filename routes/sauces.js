const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

const sauceControl = require('../controllers/sauces');

router.get('/', auth,sauceControl.getAll);
router.post('/', auth,multer,sauceControl.createSauce);
router.get('/:id',auth, sauceControl.getSauce);
router.put('/:id',auth,multer, sauceControl.modifySauce);
router.delete('/:id',auth, sauceControl.deleteSauce);

router.post('/:id/like',auth, sauceControl.likeDislike);

module.exports = router;
