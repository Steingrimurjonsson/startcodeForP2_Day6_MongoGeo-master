
import express from "express";
import userFacade from "../facades/userFacadeWithDB";
const router = express.Router();
import { ApiError } from "../errors/apiError"
import authMiddleware from "../middlewares/basic-auth";
import * as mongo from "mongodb"
import setup from "../config/setupDB"
const gju = require('geojson-utils');
const {gameArea, players} = require('../gameData');

const MongoClient = mongo.MongoClient;


(async function setupDB() {
    const client = await setup()
    userFacade.setDatabase(client)
})()

const polygonForClient = {
    polygonForClient: gameArea.coordinates[0].map((point : any) => {
      return {latitude: point[1],longitude: point[0]}
    })
    };
    //Returns a polygon, representing the gameArea
    router.get("/gamearea",(req,res)=>{
      res.json(polygonForClient);
    });
    
    router.get('/isuserinarea/:lon/:lat', function(req, res) {
      const lon = req.params.lon;
      const lat = req.params.lat;
      const point = {"type":"Point","coordinates":[lon,lat]}
      let isInside = gju.pointInPolygon(point,gameArea);
     // let result = {};
     // result.status = isInside;
      const msg = isInside ? "Point was inside the tested polygon":
                           "Point was NOT inside tested polygon";
      let result = {status: isInside,
        msg};
      res.json(result);
    });
    
    router.get('/findNearbyPlayers/:lon/:lat/:rad', function(req, res) {
      const lon = Number(req.params.lon);
      const lat = Number(req.params.lat);
      const rad = Number(req.params.rad);
      const point = {"type":"Point","coordinates":[lon,lat]}
      let isInside = gju.pointInPolygon(point,gameArea);
      let result: any = [];
      players.forEach((player : any) => {
         if (gju.geometryWithinRadius(player.geometry, point, rad)) {
          result.push(player);
        }
      })
      res.json(result);
    });
    
    router.get('/distanceToUser/:lon/:lat/:username', function(req, res) {
      const {lon,lat,username} = req.params
      const point = {"type":"Point","coordinates":[Number(lon),Number(lat)]}
      console.log(point,username);
      const user = players.find((player: any)=> {
        return player.properties.name===username
      });
      if(!user){
        res.status(404);
        return res.json({msg:"User not found"});
      }
      let distance = gju.pointDistance(point,user.geometry);
      //result = {distance:distance,to:username}
      res.json({distance:distance,to:username});
    });
    
    //app.get('/', (req, res) => res.send('Geo Demo!'))
    //app.listen(3000, () => console.log('Example app listening on port 3000!'))
    module.exports = router;