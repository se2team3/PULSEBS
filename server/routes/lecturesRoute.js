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
 * /lectures:
 *  get:
 *    tags:
 *      - lectures
 *    summary: "Get the list of all bookings for a lesson"
 *    description: "Use to request all the bookings for a specific lesson"
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "201":
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
 * /lectures:
 *  get:
 *    tags:
 *      - lectures
 *    summary: "Get the list of all bookings for a lesson"
 *    description: "Use to request all the bookings for a specific lesson"
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
 * /lectures:
 *  get:
 *    tags:
 *      - lectures
 *    summary: "Get the list of all lectures"
 *    description: "Use to request all the lectures"
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

/*
router.get('/lectures', (req, res) => {
  //lectureDao.getAllLectures...
  res.status(200).json([{ id: 1, course_id: "01SQNOV" }]);
});


/**
 * @swagger
 * /lectures:
 *  post:
 *      tags:
 *      - "lectures"
 *      summary: "Add a new lecture"
 *      description: ""
 *      operationId: ""
 *      consumes:
 *      - "application/json"
 *      - "application/xml"
 *      produces:
 *      - "application/xml"
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Lecture object that needs to be added to the db"
 *        required: true
 *        schema:
 *          $ref: "#/components/schemas/Lecture"
 *      responses:
 *        "405":
 *          description: "Invalid input"
 *        '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   format: int64
 *                   description: ID of the created lecture.
 *         # -----------------------------------------------------
 *         # Links
 *         # -----------------------------------------------------
 *         links:
 *           GetLectureById:   # <---- arbitrary name for the link
 *             operationId: getLecture
 *             # or
 *             # operationRef: '#/lectures/{lecture_id}/get'
 *             parameters:
 *               lecture_id: '$response.body#/id'
 *             description: >
 *               The `id` value returned in the response can be used as
 *               the `lecture_id` parameter in `GET /lectures/{lecture_id}`.
 *         # -----------------------------------------------------
 *    
 */

 /*
router.post('/lectures', (req, res) => {
  //lectureDao.getAllLectures...
  res.status(200).json({ id: 1 });
});


/**
 * @swagger
 *  /lectures/{lecture_id}:
 *  get:
 *    tags:
 *      - "lectures"
 *    summary: Gets a lecture by ID
 *    operationId: getLecture
 *    parameters:
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      '200':
 *        description: A Lecture object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Lecture'
 */

 /*

router.get('/lectures/:lecture_id', (req, res) => {
  //lectureDao.getAllLectures...
  const lectureId = req.params.lecture_id;
  res.status(200).json({ id: 1, course_id: "01SQNOV" });
});*/





 /**
 * @swagger
 * /teachers/{teacher_id}/lectures/{lecture_id}:
 *  delete:
 *    tags:
 *      - lectures
 *    summary: "Delete a lecture"
 *    description: "Use to request a deletion for a specific lecture"
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
    lecture={datetime:datetime,lecture_id:lecture_id,teacher:teacher}
    try{
        let number = await lectureService.deleteLecture(lecture);
        if(number===1)
            return res.status(200).json({});
        else if (number===0) 
            return res.status(304).json({});
            return number;
    } catch(error){
        console.log(error)
        res.status(400).json(error);
    }
})


module.exports = router;