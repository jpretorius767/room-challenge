'use strict';

const { v4: uuidv4 } = require('uuid');
const express        = require('express');
let router           = express.Router();

/*
   Mock data to be used in application
   Notes: capacity field should be in a configuration file
          There is no middleware used in the rooms routes
 */
const rooms = [
  { 
    roomid: uuidv4(), 
    name: 'room1',
    capacity: 5, 
    participants: ['test2', 'test1'],
    host: 'test1'
 }, 
  { 
    roomid: uuidv4(),
    name: 'room2',
    capacity: 5, 
    participants: ['test1', 'test2'],
    host: 'test1'
   } 
];

// POST create a room
router.post('/', (req, res) => {
  let { name, participants, host, capacity } = req.body;
  if (!host) return res.send(422).json({ error: "Missing host field" });
  if (!name) return res.send(422).json({ error: "Missing name field" });
  let idx = rooms.findIndex(u => u.name === name);
  if (idx > -1) {
    return res.send(500).json({ error: "Room already exists" });
  }
  participants = participants || [];
  capacity = parseInt(capacity) || 5;
  rooms.push({ roomid: uuidv4(), name: name, capacity: capacity, host: host, participants: participants });
  res.sendStatus(201);
});

// GET room
router.get('/:roomid', (req, res) => {
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
router.put('/:roomid/host', (req, res) => {
  const { host } = req.body;
  if (!host) return res.status(400).send({ error: `Missing host field` })
  const roomid = req.params.roomid;
  let room = rooms.find(r => r.roomid === roomid);
  if (!room) return res.sendStatus(404);
  room.host = host;
  res.sendStatus(204);
});

/*
  PUT join a room
  Assume that a duplicate user can be just ignored and not return an error
*/
router.put('/:roomid/join', (req, res) => {
  const { username } = req.body;
  const roomid = req.params.roomid;
  let room = rooms.find(r => r.roomid === roomid);
  if (!room) return res.sendStatus(404);
  if (room) {
    if (room.participants.length >= room.capacity) {
      return res.status(500).send({ error: `Maximum capacity reached for room: ${roomid}` })
    }
    if (!room.participants.find(p => p === username)) {
      room.participants.push(username);
    }
  }
  res.sendStatus(204);
});

// PUT leave a room
router.put('/:roomid/leave', (req, res) => {
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

// GET rooms
router.get('/', (req, res) => {
  res.status(200).json({ rooms: rooms });
});

//GET search rooms which currently only supports single username value
router.get('/search/:username', (req, res) => {
  let foundRooms = rooms.filter(r => r.participants.includes(req.params.username));
  res.send({ rooms: foundRooms });
}); 

module.exports = router;