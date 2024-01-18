var express = require('express');
var multer  = require('multer');
const sharp = require('sharp')
const path = require('path')

var router = express.Router();

// Multer configs
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
})

router.post('/', upload.single('image'), async (req, res) => {
    console.log('Req', req.file)
    try {
        const fileName = `${Date.now()}${path.extname(req.file.originalname)}`
        const fileLocation = path.resolve(`./uploads/${fileName}`)
        await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(fileLocation)
        res.redirect('/');
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.get('/', async (req, res) => {
    res.sendFile(path.resolve('./views/index.html'));
})

module.exports = router