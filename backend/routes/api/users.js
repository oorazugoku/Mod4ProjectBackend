const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];






router.get('/current/spots', async (req, res) => {

  const { token } = req.cookies;

  const result = await User.findAll({
    where: {token: token},
    include: {
      model: Spot
    }
  })

  await requireAuth(res, result)

  res.json(result)

  }
);

// Sign up endpoint
router.post('/', validateSignup, async (req, res) => {

      const { email, password, username } = req.body;
      const user = await User.signup({ email, username, password });

      await setTokenCookie(res, user);

      return res.json({
        user
      });
    }
  );

router.get('/', async (req, res) => {

  const result = await User.findAll()
  res.json(result)

  }
);



module.exports = router;
