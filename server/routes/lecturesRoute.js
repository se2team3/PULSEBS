const bookingService = require('../services/bookingService');
const extendedLectureService = require('../services/extendedLectureService');
const lectureService = require('../services/lectureService');
const express = require('express');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const moment = require('moment');
const router = express.Router();

/**
 * @swagger
 * /lectures/:lecture_id/bookings:
 *  get:
 *    tags:
 *      - lectures
 *    summary: "Get the list of all bookings for a lesson"
 *    description: "Use to request all the bookings for a specific lesson"
 *    parameters:
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful response"
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Lecture"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */

router.get('/lectures/:lecture_id/bookings', async(req,res) =>{
  const lecture_id= + req.params.lecture_id;
  try{
      let bookings = await bookingService.retrieveBookingsbyLectureId(lecture_id);
      return res.status(200).json(bookings);
  } catch(error){
      res.json(error);
  }
})

/**
 * @swagger
 * /lectures/:lecture_id:
 *  get:
 *    tags:
 *      - lectures
 *    summary: "Get all the information needed for a lesson"
 *    description: "Use to request an extended lecture"
 *    parameters:
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful response"
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Lecture"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */
router.get('/lectures/:lecture_id', async(req,res) =>{
  const lecture_id= + req.params.lecture_id;
  try{
      let lecture = await extendedLectureService.getLectureById(lecture_id);
      return res.status(200).json(lecture);
  } catch(error){
      res.json(error);
  }
})

 /**
 * @swagger
 * /lectures/{lecture_id}:
 *  delete:
 *    tags:
 *      - lectures
 *    summary: "Delete a lecture"
 *    description: "Use to request a deletion for a specific lecture"
 *    parameters:
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *      - in: cookie
 *        name: user
 *        schema:
 *          type: object 
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful deletion"
 *       "304":
 *         description: "The lecture doesn't exist or has been deleted yet"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */
router.delete('/lectures/:lecture_id', authorize(role.Teacher), async (req,res)=>{
    const teacher=req.user.sub
    const lecture_id= +req.params.lecture_id;
    const datetime= moment().format('YYYY-MM-DD HH:mm');
    const lecture={datetime:datetime,lecture_id:lecture_id,teacher:teacher}
    try{
        let number = await lectureService.deleteLecture(lecture);
        if(number===1)
            return res.status(200).json({});
        else if (number===0) 
            return res.status(304).json({});
    } catch(error){
        console.log(error)
        res.status(400).json(error);
    }
})


module.exports = router;