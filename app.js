// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const fs = require('fs');
 const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://dash-ytqylu.firebaseio.com'
});
const functions = require('firebase-functions');
const {WebhookClient,Image,Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  function camera_level(agent){
   let level = request.body.queryResult.parameters.level;
  if(level == 1){
   
     return admin.database().ref("Camera-inside").child("photo1").once("value").then(snapshot => {

       /*agent.add( new Card({
        title: 'ภาพจากกล้องภายในบ้าน ภาพที่ 1',
        imageUrl: 'https://th.seaicons.com/wp-content/uploads/2015/06/file-icon.png',
        buttonText: 'กดปุ่มเพื่อดูภาพจากกล้อง',
        buttonUrl: 'https://www.google.com/'
       }));*/
      });
     }
  }
  function lamp_open(agent) {
    let lamp = request.body.queryResult.parameters.lamp;
    let data;
    
  let result = "none";
  if(lamp == 'หน้าบ้าน'){
    
    result = 'front';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 1){
        agent.add('ไฟหน้าบ้านเปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 0){
          admin.database().ref('lamp/front').set({'status': 1});
        agent.add('เปิดไฟหน้าบ้านแล้วค่ะ');
        }
      });
  }else if(lamp == 'หลังบ้าน'){
    
    result = 'back';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 1){
        agent.add('ไฟหลังบ้านเปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 0){
          admin.database().ref('lamp/back').set({'status': 1});
        agent.add('เปิดไฟหลังบ้านแล้วค่ะ');
        }
      });
  }else if(lamp == 'ห้องนอน'){
    
    result = 'bed';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 1){
        agent.add('ไฟห้องนอนเปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 0){
          admin.database().ref('lamp/bed').set({'status': 1});
        agent.add('เปิดไฟห้องนอนแล้วค่ะ');
        }
      });
  }else if(lamp == 'ทั้งหมด'){
		admin.database().ref('lamp/back').set({'status': 1});
     	admin.database().ref('lamp/bed').set({'status': 1});
    	 admin.database().ref('lamp/front').set({'status': 1});
    return agent.add('เปิดไฟทั้งหมดแล้วค่ะ');
           }
  }
  
    function lamp_close(agent) {
    let lamp = request.body.queryResult.parameters.lamp;
    let data;
    
  let result = "none";
  if(lamp == 'หน้าบ้าน'){
    
    result = 'front';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไฟหน้าบ้านปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 1){
          admin.database().ref('lamp/front').set({'status': 0});
        agent.add('ปิดไฟหน้าบ้านแล้วค่ะ');
        }
      });
  }else if(lamp == 'หลังบ้าน'){
    
    result = 'back';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไฟหลังบ้านปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 1){
          admin.database().ref('lamp/back').set({'status': 0});
        agent.add('ปิดไฟหลังบ้านแล้วค่ะ');
        }
      });
  }else if(lamp == 'ห้องนอน'){
    
    result = 'bed';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไฟห้องนอนปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 1){
          admin.database().ref('lamp/bed').set({'status': 0});
        agent.add('ปิดไฟห้องนอนแล้วค่ะ');
        }
      });
  }else if(lamp == 'ทั้งหมด'){
    admin.database().ref('lamp/back').set({'status': 0});
     	admin.database().ref('lamp/bed').set({'status': 0});
    	 admin.database().ref('lamp/front').set({'status': 0});
    return agent.add('ปิดไฟทั้งหมดแล้วค่ะ');
           }

      
}
  
 function lamp_check(agent){
    let lamp = request.body.queryResult.parameters.lamp;
   let result;
   let front_time,back_time,bed_time;
   if(lamp == 'หน้าบ้าน'){
     result = 'front';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไฟหน้าบ้านปิดอยู่ค่ะ');
        }else if(snapshot.val() == 1){
        return admin.database().ref("lamp").child(result).child("time").once("value").then(snapshot => {
          front_time = snapshot.val()/60;
          if(front_time < 60){
            agent.add('ไฟหน้าบ้านเปิดมา '+front_time.toFixed(2) +' นาทีแล้วค่ะ');
             }else if(front_time >=60){
             front_time = front_time*0.016666666666667;
               agent.add('ไฟหน้าบ้านเปิดมา '+front_time.toFixed(2) +' ชั่วโมงแล้วค่ะ');
             }
          
        });
        }
      });
      }else if(lamp == 'หลังบ้าน'){
          result = 'back';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไฟหลังบ้านปิดอยู่ค่ะ');
        }else if(snapshot.val() == 1){
        return admin.database().ref("lamp").child(result).child("time").once("value").then(snapshot => {
          back_time = snapshot.val()/60;
          if(back_time < 60){
            agent.add('ไฟหลังบ้านเปิดมา '+back_time.toFixed(2) +' นาทีแล้วค่ะ');
             }else if(back_time >=60){
             back_time = back_time*0.016666666666667;
               agent.add('ไฟหลังบ้านเปิดมา '+back_time.toFixed(2) +' ชั่วโมงแล้วค่ะ');
             }
          
        });
        }
      });
               }else if(lamp == 'ห้องนอน'){
          result = 'bed';
    
     return admin.database().ref("lamp").child(result).child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไฟห้องนอนปิดอยู่ค่ะ');
        }else if(snapshot.val() == 1){
        return admin.database().ref("lamp").child(result).child("time").once("value").then(snapshot => {
          bed_time = snapshot.val()/60;
          if(bed_time < 60){
            agent.add('ไฟห้องนอนเปิดมา '+bed_time.toFixed(2) +' นาทีแล้วค่ะ');
             }else if(bed_time >=60){
             bed_time = bed_time*0.016666666666667;
               agent.add('ไฟห้องนอนเปิดมา '+bed_time.toFixed(2) +' ชั่วโมงแล้วค่ะ');
             }
          
        });
        }
      });
               }
  }
  
  function fan_open(agent){
      let fan = request.body.queryResult.parameters.fan;
  let numb = request.body.queryResult.parameters.number;
  if(fan == 'พัดลม'){
    
    if(numb == 1){
       
     return admin.database().ref("fan").child("fan1").child("status").once("value").then(snapshot => {
        if(snapshot.val() == 1){
        agent.add('พัดลมเปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 0){
          admin.database().ref('fan/fan1').set({'status': 1,'level': 1});
             agent.add('เปิดพัดลมเบอร์ 1 แล้วค่ะ');}});
  }else if(numb==2){
                return admin.database().ref("fan").child("fan1").child("status").once("value").then(snapshot => {
        if(snapshot.val() == 1){
        agent.add('พัดลมเปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 0){
          admin.database().ref('fan/fan1').set({'status': 1,'level': 2});
             agent.add('เปิดพัดลมเบอร์ 2 แล้วค่ะ');}});
           }else if(numb==3){
                return admin.database().ref("fan").child("fan1").child("status").once("value").then(snapshot => {
        if(snapshot.val() == 1){
        agent.add('พัดลมเปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 0){
          admin.database().ref('fan/fan1').set({'status': 1,'level': 3});
             agent.add('เปิดพัดลมเบอร์ 3 แล้วค่ะ');}});
           }
       }
    
  }
  
  function fan_close(agent){
      let fan = request.body.queryResult.parameters.fan;
  return admin.database().ref("fan").child("fan1").child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('พัดลมปิดอยู่แล้วค่ะ');
        }else if(snapshot.val() == 1){
          admin.database().ref('fan/fan1').set({'status': 0});
        agent.add('ปิดพัดลมแล้วค่ะ');
        }
      });
  
  }
     function fan_check(agent){
        let fan = request.body.queryResult.parameters.fan;
   let fan_time;
         if(fan == 'พัดลม'){
               return admin.database().ref("fan").child('fan1').child("status").once("value").then(snapshot => {
                 if(snapshot.val() == 0){
        agent.add('พัดลมปิดอยู่ค่ะ');
        }else if(snapshot.val() == 1){
        return admin.database().ref("fan").child('fan1').child("time").once("value").then(snapshot => {
          fan_time = snapshot.val()/60;
          if(fan_time < 60){
            agent.add('พัดลมเปิดมา '+fan_time.toFixed(2) +' นาทีแล้วค่ะ');
             }else if(fan_time >=60){
             fan_time = fan_time*0.016666666666667;
               agent.add('พัดลมเปิดมา '+fan_time.toFixed(2) +' ชั่วโมงแล้วค่ะ');
            }
          
        });
        }
      });
   }
     }
    
  function fan_change(agent){
   let fan = request.body.queryResult.parameters.fan;
     let level = request.body.queryResult.parameters.level;
   let check ;
    return admin.database().ref("fan").child("fan1").child("status").once("value").then(snapshot => {
        if(snapshot.val() == 0){
        agent.add('ไม่สามารถเปลี่ยนเบอร์พัดลมได้ พัดลมปิดอยู่ค่ะ');
        }else if(snapshot.val() == 1){
          
          if(level == 1 ){
           admin.database().ref('fan/fan1').set({'status': 1,'level': 1});
             agent.add('ปรับเบอร์พัดลม เป็น เบอร์ 1 แล้วค่ะ');
          }else if(level == 2){
           admin.database().ref('fan/fan1').set({'status': 1,'level': 2});
             agent.add('ปรับเบอร์พัดลม เป็น เบอร์ 2 แล้วค่ะ');
          }else if(level == 3 ){
           admin.database().ref('fan/fan1').set({'status': 1,'level': 3});
             agent.add('ปรับเบอร์พัดลม เป็น เบอร์ 3 แล้วค่ะ');
          }else if(level == "เบา"){
                   return admin.database().ref("fan").child("fan1").child("level").once("value").then(snapshot => {
        check = snapshot.val()+1;
                     if(snapshot.val() == 1){
        agent.add('พัดลมอยู่ในเบอร์ต่ำสุดค่ะ');
        }else if(snapshot.val() == 2){
         admin.database().ref('fan/fan1').set({'status': 1,'level': 1});
             agent.add('เบาพัดลมเป็น เบอร์ 1 แล้วค่ะ');
        }else if(snapshot.val() == 3){
         admin.database().ref('fan/fan1').set({'status': 1,'level': 2});
             agent.add('เบาพัดลมเป็น เบอร์ 2 แล้วค่ะ');
        }
                      });
                   }else if(level == 'เพิ่ม' || level == 'เร่ง'){
                   
                   return admin.database().ref("fan").child("fan1").child("level").once("value").then(snapshot => {
        check = snapshot.val()+1;
                     if(snapshot.val() == 3){
        agent.add('พัดลมอยู่ในเบอร์สูงสุดค่ะ');
        }else if(snapshot.val() == 2){
         admin.database().ref('fan/fan1').set({'status': 1,'level': 3});
             agent.add('เปลี่ยนพัดลมเป็น เบอร์ 3 แล้วค่ะ');
        }else if(snapshot.val() == 1){
         admin.database().ref('fan/fan1').set({'status': 1,'level': 2});
             agent.add('เปลี่ยนพัดลมเป็น เบอร์ 2 แล้วค่ะ');
        }
                      });
                   }
        }
      });
  }
 
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('lamp.open', lamp_open);
  intentMap.set('lamp.close', lamp_close);
  intentMap.set('lamp.check_time', lamp_check);
  intentMap.set('fan.checktime',fan_check);
  intentMap.set('fan.change',fan_change);
  intentMap.set('fan.open',fan_open);
  intentMap.set('fan.close',fan_close);
  intentMap.set('camera.level',camera_level);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
