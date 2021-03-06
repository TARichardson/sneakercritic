const express = require('express');
const bcrypt = require('bcrypt');
const { sign, passport } = require('../auth');
const { User, Comment, Role } = require('../models');

const UsersRouter = express.Router();

UsersRouter.get('/', async (req, res) => {
  try {
    const user = await User.findAll();
    res.json({user});

  }
  catch(evt) {
    res.status(401).json(evt.message);
  }});

UsersRouter.post('/', async (req, res) => {
  try {
    const data = req.body;
    const user = await User.create(data);
    const { id, user_name, first_name } = user;
    const token = sign({user_name, first_name, id});
    res.json({user, token});
  }
  catch(evt) {
    res.status(500).json({msg: evt.message})
  }
});


UsersRouter.post('/login', async (req, res) => {
  try {
    const {user_name, password} = req.body;
    const user = await User.findOne({where: {user_name}});
    const valid =  await bcrypt.compare(password, user.password);

    if (valid) {
      const { id, user_name, first_name } = user;
      const token = sign({user_name, first_name, id});
      res.json({token,valid,id});
    }
    else {
      throw Error('Invalid username or password');
    }

  }
  catch(evt) {
    res.status(401).json(evt.message);
  }
});

UsersRouter.get('/profile', passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    try {
      const comments = await Comment.findAll({
        where: {user_id: req.user.id}
      })
      res.json({user: req.user,comments: comments});
    }
    catch(evt) {
      res.status(401).json(evt.message);
    }
  }
);
UsersRouter.get('/roles', async (req, res) => {
    try {
      const roles = await Role.findAll()
      res.json({roles});
    }
    catch(evt) {
      res.status(401).json(evt.message);
    }
  }
);

UsersRouter.put('/:user_id', passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    try {
      const data = req.body;
      const user = await User.findByPk(req.params.user_id);
      const resp = await User.update(
        {
          user_name: data.user_name || user.user_name,
          password: data.password || user.password,
          email: data.email || user.email,
          first_name: data.first_name || user.first_name,
          last_name: data.last_name || user.last_name,
        },
        {
          where: {
            id: req.params.user_id,
          }
        }
      );
      res.json(data);
    }
    catch(evt) {
      res.status(500).json({msg: evt.message})
    }
  }
);

UsersRouter.delete('/:user_name', passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    try {
      await User.destroy(
        {
          where: {
            user_name: req.params.user_name,
          }
        },
        {
          truncate: true
        }
      );
      res.json({msg: `delete user by id ${req.params.user_id}`});
    }
    catch(evt) {
      res.status(500).json({msg: evt.message})
    }
  }
);

module.exports = {
  UsersRouter,
}
