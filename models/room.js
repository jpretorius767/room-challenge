const { v4: uuidv4 } = require('uuid');

export class Room {
    constructor (roomId = uuidv4(), capacity = 5) {
        this.roomId = roomId;
        this.capacity = capacity
    }
}
  