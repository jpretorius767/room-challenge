'use strict';
const express = require('express');
let router = express.Router();
const basicAuth = require('../middleware/auth');

const users = [{ username: 'test', password: 'test', mobile_token: 'abcdef'}, { username: 'abc', password: 'test1', mobile_token: 'qwerty'} ];

/*
  For real-world scenarios passwords should be hashed/encrypted in some manner and not in plain text
*/

router.get('/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.sendStatus(404);
  res.status(200).json({ users: user });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  // if (!username || !password) return res.sendStatus(401);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.sendStatus(401);
  res.sendStatus(204);
});
  
router.get('/', (req, res) => {
  res.status(200).json({ users: users });
});

router.post('/', (req, res) => {
  const { username, password, mobile_token } = req.body;
  let idx = users.findIndex(u => u.username === username);
  if (idx > -1) {
    return res.sendStatus(409);
  }
  users.push({ username: username, password: password, mobile_token: mobile_token });
  res.sendStatus(201);
});
  
router.delete('/:username', basicAuth(), (req, res) => {
  const idx = users.findIndex(u => u.username === req.params.username);
  if (idx > -1) {
    users.splice(idx, 1);
    return res.sendStatus(200);
  }
  res.sendStatus(404);
});
  
router.put('/:username', basicAuth(), (req, res) => {
    const { password, mobile_token} = req.body;
    let user = users.find(u => u.username === req.params.username);
    if (!user) return res.sendStatus(404);
    user.password = password || user.password;
    user.mobile_token = mobile_token || user.mobile_token;
    res.status(201).json({ users: user });
});

module.exports = router;