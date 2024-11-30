const express = require('express')
const route = express.Router()
const {addUser,writeontag,validateTag} = require('../controllers/controller')

route.post('/register-user', addUser)
route.post('/writeontag',writeontag)
route.post('/validateTag',validateTag)

module.exports = route
