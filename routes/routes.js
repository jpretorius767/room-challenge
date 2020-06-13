'use strict';

const express        = require('express');
let router           = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt            = require('jsonwebtoken');

/*
  Middlware to allow only users to modify their own profiles
  NOTES: Users is an array but should be read from a database instead of 
  being passed in this manner
*/
const isSameUserAuth = (users) => {
  return (req, res, next) => {
    if (req.headers['content-type'] !== 'application/json') {
      res.status(400).send('Server requires application/json');
      return;
    }
    const username = req.params.username;
    const idx = users.findIndex(u => u.username === username);
    if (idx > -1) {
      if (users[idx].mobile_token !== req.headers['x-access-token']) {
        res.status(403).send('Unauthorized!');
        return;
      } else {
        next();
      }
    }
    next();
  }
}


const users = [
  { 
    username: 'test1', 
    password: 'test'
  }, 
  {
   username: 'abc', 
   password: 'test'
  }
 ];

 const rooms = [
  { 
    roomid: '6fee74c1-aa05-4a12-ad1f-a28d1e0628d2', 
    name: 'room1',
    capacity: 5, 
    participants: ['test2', 'test1'],
    host: 'test1'
 }, 
  { 
    roomid: 'f4bdf4e2-6807-4a36-a125-8eed83170e37',
    name: 'room2',
    capacity: 5, 
    participants: ['test1', 'test2'],
    host: 'test1'
   } 
];

/*
  For real-world scenarios passwords should be hashed/encrypted in some manner and not in plain text
*/

router.get('/users/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.sendStatus(404);
  res.status(200).json({ users: user });
});

/*
  POST authenticate
*/
router.post('/users/authenticate', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.sendStatus(401);
  user.mobile_token = jwt.sign({ foo: user.username}, user.password);
  res.status(200).json({ mobile_token: user.mobile_token });
});

/*
  GET specific user
*/
router.get('/users/', (req, res) => {
  res.status(200).json({ users: users });
});

/*
  POST /api/users
*/
router.post('/users', (req, res) => {
  const { username, password, mobile_token } = req.body;
  let idx = users.findIndex(u => u.username === username);
  if (idx > -1) {
    return res.sendStatus(409);
  }

  users.push({ username: username, password: password, mobile_token: mobile_token });
  res.sendStatus(201);
});

/* 
  DELETE a the logged in use only
*/
router.delete('/users/:username', isSameUserAuth(users) ,(req, res) => {
  const username = req.params.username;
  const idx = users.findIndex(u => u.username === username);
  if (idx > -1) {
      users.splice(idx, 1);
      return res.status(200).json({ message: `User ${username} deleted` });
  }
  res.sendStatus(404);
});

/*
 PUT /api/users/:username
 */
router.put('/users/:username', isSameUserAuth(users), (req, res) => {
    const { password, mobile_token} = req.body;
    const username = req.params.username;
    let user = users.find(u => u.username === username);
    if (!user) return res.sendStatus(404);
    user.password = password || user.password;
    user.mobile_token = mobile_token || user.mobile_token;
    res.status(201).json({ users: user });
});


/* ROOMS ROUTES: */

/*
  POST create a room
*/
router.post('/rooms', isSameUserAuth(users), (req, res) => {
  let { name, participants, host, capacity } = req.body;
  if (!host) return res.status(422).json({ error: "Missing host field" });
  if (!name) return res.status(422).json({ error: "Missing name field" });
  let idx = rooms.findIndex(u => u.name === name);
  if (idx > -1) {
    return res.status(500).json({ error: "Room already exists" });
  }
  participants = participants || [];
  capacity = parseInt(capacity) || 5;
  rooms.push({ roomid: uuidv4(), name: name, capacity: capacity, host: host, participants: participants });
  res.sendStatus(201);
});

/*
  GET room
*/
router.get('/rooms/:roomid', (req, res) => {
  let foundRoom = rooms.find(r => r.roomid === req.params.roomid);
  if (!foundRoom) {
    return res.sendStatus(404);
  }
  res.send({ rooms: foundRoom });
});

/*
  PUT host change
  Assume that a duplicate user can be just ignored and not return an error
*/
router.put('/rooms/:roomid/host/:username', isSameUserAuth(users), (req, res) => {
  const { host } = req.body;
  if (!host) return res.status(400).send({ error: `Missing host field` })
  const roomid = req.params.roomid;
  const username = req.params.username;
  let room = rooms.find(r => r.roomid === roomid);
  if (!room) return res.sendStatus(404);
  room.host = host;
  res.sendStatus(204);
});

/*
  PUT join a room
  Assume that a duplicate user can be just ignored and not return an error
*/
router.put('/rooms/:roomid/user/:username/join', isSameUserAuth(users), (req, res) => {
  const { username } = req.body;
  const roomid = req.params.roomid;
  let room = rooms.find(r => r.roomid === roomid);
  if (!room) return res.sendStatus(404);
  if (room.participants.length >= room.capacity) {
    return res.status(500).send({ error: `Maximum capacity reached for room: ${roomid}` })
  }
  if (!room.participants.find(p => p === username)) {
    room.participants.push(username);
  }
  res.sendStatus(204);
});

/*
  PUT /rooms/:roomid/user/:username/leave  -> leave a room
*/
router.put('/rooms/:roomid/user/:username/leave', isSameUserAuth(users), (req, res) => {
  const { username } = req.body;
  const roomid = req.params.roomid;
  let room = rooms.find(r => r.roomid === roomid);
  if (room) {
    let idx =  room.participants.findIndex(p => p === username);
    room.participants.splice(idx, 1);
    return res.sendStatus(204);
  }
  res.status(404);
});

/*
  GET all rooms
*/
router.get('/rooms', (req, res) => {
  res.status(200).json({ rooms: rooms });
});

/*
 GET search rooms which currently only supports single username value
 */
router.get('/rooms/search/:username', (req, res) => {
  let foundRooms = rooms.filter(r => r.participants.includes(req.params.username));
  res.send({ rooms: foundRooms });
}); 

module.exports = router;