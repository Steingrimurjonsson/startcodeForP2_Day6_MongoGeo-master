import express from "express";
import gameFacade from "../facades/gameFacade";
const router = express.Router();
import { ApiError } from "../errors/apiError"

//import * as mongo from "mongodb"
import setup from "../config/setupDB"
import UserFacade from '../facades/userFacadeWithDB';

(async function setupDB() {
  const client = await setup()
  gameFacade.setDatabase(client)
})()

router.post('/nearbyplayers', async function (req, res, next) {
  try {
    const userName = req.body.userName
    const password = req.body.password
    const lat = req.body.lat
    const lon = req.body.lon
    const distance = req.body.distance

    //const point: IPoint = { type: 'Point', coordinates: [lat, lon] }
    const result = await gameFacade.nearbyPlayers(userName, password, lon, lat, distance)
    res.json(result)
  } catch (err) {
    next(err)
  }

})
router.post('/getPostIfReached', async function (req, res, next) {
  try {
    const id = req.body.postId
    const lat = req.body.lat
    const lon = req.body.lon
    const result = await gameFacade.getPostIfReached(id, lat, lon)
    res.json(result)
  } catch (err) {
    next(err)
  }
})
router.post('/addPost', async (req, res, next) => {
  try {

    const name = req.body.name
    const task = req.body.task
    const isUrl = req.body.isUrl
    const taskSolution = req.body.taskSolution
    const lon = req.body.lon
    const lat = req.body.lat
    const result = await gameFacade.addPost(name, task, isUrl, taskSolution, lon, lat)

    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router;