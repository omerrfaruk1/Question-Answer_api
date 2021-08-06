const express = require('express');
const router = express.Router();
const {getSingleUser,getAllUser} = require('../contorllers/user');
const {checkUserExist} = require('../middlewares/database/databaseErrorHelepers')
const userQueryMiddlewares = require('../middlewares/query/userQueryMiddlewares');
const User = require('../models/User');

router.get('/:id',checkUserExist,getSingleUser)
router.get('/',userQueryMiddlewares(User),getAllUser)




module.exports = router;