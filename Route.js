const express = require('express')
const router = express.Router()
const auth = require('./middleware/auth')
const mongoose = require('mongoose')
const connStr = process.env.DATABASE_URL.replace('<password>',process.env.DATABASE_PWD,)
                                        .replace('<database>',process.env.DATABASE_NAME)


const Event = require('./models/eventmodel')
const User = require('./models/usermodel')


mongoose.connect(connStr, { useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false})
const db = mongoose.connection
db.on('error', () => console.log('Database conection error'))
db.once('open', () => console.log('Database connected'))


// ----------------------------User----------------
router.post('/api/v3/users', async (req,res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).json({ message: "User Add",user ,token})
        
    } catch (error) {
        res.status(400).json({ message: "error" })
    }
})

router.post('/api/v3/users/login', async (req,res) => {
    try {
        const { email , password } = req.body
        const user = await User.findByCredentials(email,password)

        if (!user) {return res.status(401).json({error : 'Login failed'})}

        const token = await user.generateAuthToken()
        res.status(200).json({token}) 

    } catch (error) {
        res.status(400).json ({error: error.message})
    }
})

router.get('/api/v3/users/me', auth,(req,res) => {
    const user = req.user
    res.status(201).json(user)
})

router.post('/api/v3/users/logout', auth, async (req,res) => {
    const user = req.user
    const current_token = req.token

    try {
        user.tokens = user.tokens.filter(token => {return token.token!==current_token})
        await user.save()
        res.status(200).json({msg: 'log out!'})
        
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

router.post('/api/v3/users/logoutall', auth, async (req,res) => {
    const user = req.user
    try {
        user.tokens.splice(0 , user.tokens.length)
        await user.save()
        res.status(200).json({msg: 'all logout!'})
    } catch (error) {
        res.status(500).json({msg: 'error'})
    }
})

router.put('/api/v3/users/editprofile', auth, async (req,res) => {
    const userUpdate = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        updated: new Date()
    }
    try {
        userUpdate.password = await User.encryptChangedPass(userUpdate.password)
        const u = await User.findByIdAndUpdate(req.user.id , userUpdate, { new: true})
        if (!u) {
            res.status(404).json({error: error.message})
        }else{
        res.status(200).json(u)
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// ---------------------------ENDPOINT-------------

router.get('/api/v3/events', async (req,res,next) => {
    try {
        const event = await Event.find()
        res.status(200).json({uid: req.params.uid,
                  event: event})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get('/api/v3/events/myevents', auth, async (req,res,next) => {
    const user = req.user
    try {
        const event = await Event.find({_uid: user.id})
        res.status(200).json({uid: req.params.uid,
                  event: event})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.delete('/api/v3/events/:id' , async (req,res) => {
    try {
        const t =  await Event.findByIdAndDelete(req.params.id)
        if (!t) {
            res.status(404).json({error:'event not found'})
        }else{
        res.status(200).json({msg: 'event is cancelled!'})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.put('/api/v3/events/:id' , async (req,res) => {
    const update_t = {
        name: req.body.name,
        date: req.body.date,
        details: req.body.details,
        updated: new Date()
    }
    try {
        const t = await Event.findByIdAndUpdate(req.params.id , update_t, { new: true})
        if (!t) {
            res.status(404).json({error:'event not found'})
        }else{
        res.status(200).json(t)
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get('/api/v3/events/:id', async (req,res,next) => {
    try {
        const t = await Event.findById(req.params.id)
        if (!t) {
            res.status(404).json({error:'event not found'})
        }
        res.status(200).json(t)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})
    
router.post('/api/v3/events', auth,async (req,res) => {
    const t = new Event(req.body)
    const user = req.user
    t._uid = user.id
    try {
        await t.save()
        res.status(200).json(t)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router