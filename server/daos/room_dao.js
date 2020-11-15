// import database
// import modules

const db = require('../db/db.js');
const Room = require('../models/room.js');

const createRoom = function (row){
    return new Room(row.id,row.name,row.seats);
}

// it creates the room table
exports.createRoomsTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = 'CREATE TABLE Rooms (id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, seats INTEGER NOT NULL)'
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}
//it allows you to insert a new room
exports.insertRoom = function({name,seats}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Rooms(name,seats) VALUES(?,?)'
        db.run(sql,[name,seats], function(err){
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}
//gets the room with the selected id
exports.retrieveRoom = function({id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Rooms WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const room = createRoom(row);
                resolve(room);
            }
                
        });
    })
}

exports.deleteRoomTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Rooms '
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null); 
        });
    })
}