require('dotenv').config();
import express from "express";
import path from "path";
import { ApiError } from "./errors/apiError";

const gju = require('geojson-utils');
const {gameArea, players} = require('./gameData');

const app = express();

app.use(express.static(path.join(process.cwd(),"public")))

app.use("/",(req,res,next)=>{
  console.log(req.url)
  next()
})
app.use(express.json())
//let userAPIRouter = require('./routes/userApi');
let userAPIRouter = require('./routes/userApiDB');
let gameAPIRouter = require('./routes/gameAPI');


app.use("/api/users",userAPIRouter);
app.use("/gameapi",gameAPIRouter);

app.get("/api/dummy", (req, res) => {
  res.json({ msg: "Hello" })
})

app.use(function (req, res, next) {
  if(req.originalUrl.startsWith("/api")){
      res.status(404).json({code:404, msg:"this API does not contanin this endpoint"})
  }
  next()
})

app.use(function (err:any, req:any, res:any, next:Function) {
  //if(err.name === "ApiError"){
  if(err instanceof(ApiError)){
    const e = <ApiError> err;
    return res.status(e.errorCode).send({code:e.errorCode,message:e.message})
  }
  next(err)
})


const polygonForClient = {
polygonForClient: gameArea.coordinates[0].map((point : any) => {
  return {latitude: point[1],longitude: point[0]}
})
};
//Returns a polygon, representing the gameArea
app.get("/geoapi/gamearea",(req,res)=>{
  res.json(polygonForClient);
});

app.get('/geoapi/isuserinarea/:lon/:lat', function(req, res) {
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

app.get('/geoapi/findNearbyPlayers/:lon/:lat/:rad', function(req, res) {
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

app.get('/geoapi/distanceToUser/:lon/:lat/:username', function(req, res) {
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


const PORT = process.env.PORT || 3333;
const server = app.listen(PORT)
console.log(`Server started, listening on port: ${PORT}`)
module.exports.server = server;


