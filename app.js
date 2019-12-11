
const PORT = process.env.PORT || 4000

"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/cate", function(req, res) {
  var speech = '';
  if((req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.cate )
    == ('อุณหภูมิภายในบ้าน' && ('อุณหภูมิ')) ){
      speech = 'รอสักครู่กำลังดึงข้อมูล อุณหภูมิภายในบ้าน'
    }else if((req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.cate )
      == 'กล้องวงจรปิด' ){
       speech = 'รอสักครู่กำลังดึงข้อมูล กล้องวงจรปิด'
      }else if((req.body.queryResult &&
        req.body.queryResult.parameters &&
        req.body.queryResult.parameters.cate )
        == ('ไฟฟ้า' && ('ไฟฟ้าภายในบ้าน')) ){
          speech = 'รอสักครู่กำลังดึงข้อมูล ไฟฟ้าภายในบ้าน'
      }else

    
      speech =  "ยังไม่มี บริการนี้ให้ใช้!!";
  
  var speechResponse = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: speech
            }
          }
        ]
      }
    }
  };
  
  return res.json({
    payload: speechResponse,
    //data: speechResponse,
    fulfillmentText: speech,
    speech: speech,
    displayText: speech
  });
});

restService.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})