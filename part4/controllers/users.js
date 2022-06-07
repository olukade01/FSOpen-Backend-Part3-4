const userRouter = require('express').Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async(req, res) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
  res.json(users)
})

userRouter.post('/', async(req, res) => {
  const {username, name, password} = req.body
  const existingUsers = await User.findOne({ username })
  if(existingUsers){
    return res.status(400).json({error: "username must be unique"})
  }else if (!password) {
    return res.status(400).json({ error: 'password is required' })
  }else if (password.length < 3){
    return res.status(400).json({error: "min length of password must be 3"})
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    name,
    passwordHash
  })
  const savedUser = await newUser.save()
  res.status(201).json(savedUser)
})

module.exports = userRouter