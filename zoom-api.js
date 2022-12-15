const axios = require('axios');
require('dotenv').config()

async function zoomuserInfo(zoomToken) {
    try {
      const token = zoomToken;
      const email = process.env.HOST_EMAIL; //host email id
      const result = await axios.get("https://api.zoom.us/v2/users/" + email, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'User-Agent': 'Zoom-api-Jwt-Request',
          'content-type': 'application/json'
        }
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  
  
  //Create a zoom meeting
  async function createZoomMeeting(zoomToken, topic, start_time, duration) {
    try {
      const token = zoomToken;
      const email = process.env.HOST_EMAIL; //host email id;
      const result = await axios.post("https://api.zoom.us/v2/users/" + email + "/meetings", {
        "topic": topic,
        "type": 2,
        "start_time": start_time, //"2021-03-18T17:00:00"
        "duration": Number(duration),
        "timezone": "Russia",
        "password": "1234567",
        "agenda": "Test zoom meeting",
        "settings": {
          "host_video": true,
          "participant_video": true,
          "cn_meeting": false,
          "in_meeting": true,
          "join_before_host": true,
          "mute_upon_entry": true,
          "watermark": false,
          "use_pmi": false,
          "approval_type": 2,
          "audio": "both",
          "auto_recording": "local",
          "enforce_login": false,
          "registrants_email_notification": false,
          "waiting_room": true,
          "allow_multiple_devices": true
        }
      }, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'User-Agent': 'Zoom-api-Jwt-Request',
          'content-type': 'application/json'
        }
      });
        console.log(result.data);
      return result.data;
     } catch (error) {
        console.log(error.message);
     }
  }
  //Update a zoom meeting
  async function updateMeeting(zoomToken, meetingId, topic, start_time) {
    try {
      const token = zoomToken;
      const meetingId = meetingId;
      const result = await axios.patch("https://api.zoom.us/v2/meetings/" + meetingId, {
        "topic": "UPDATE: Discussion about today's Demo",
        "type": 2,
        "start_time": "2021-03-18T17:00:00",
        "duration": 20,
        "timezone": "Russia",
        "password": "1234567",
        "agenda": "Discussion about how to update zoome meeting programatically",
        "settings": {
          "host_video": true,
          "participant_video": true,
          "cn_meeting": false,
          "in_meeting": true,
          "join_before_host": false,
          "mute_upon_entry": false,
          "watermark": false,
          "use_pmi": false,
          "approval_type": 2,
          "audio": "both",
          "auto_recording": "local",
          "enforce_login": false,
          "registrants_email_notification": false,
          "waiting_room": true,
          "allow_multiple_devices": true
        }
      }, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'User-Agent': 'Zoom-api-Jwt-Request',
          'content-type': 'application/json'
        }
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  //Delete a zoom meeting
  async function deleteMeeting(zoomToken, meetingId) {
    try {
      const token = zoomToken;
      const meetingId = meetingId;
      const result = await axios.delete("https://api.zoom.us/v2/meetings/" + meetingId, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'User-Agent': 'Zoom-api-Jwt-Request',
          'content-type': 'application/json'
        }
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  //Get details of a zoom meeting
  async function getMeeting(zoomToken, meetingId) {
    try {
      const token = zoomToken;
      const meetingId = meetingId;
      const result = await axios.get("https://api.zoom.us/v2/meetings/" + meetingId, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'User-Agent': 'Zoom-api-Jwt-Request',
          'content-type': 'application/json'
        }
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }

module.exports.zoomuserInfo = zoomuserInfo
module.exports.createZoomMeeting = createZoomMeeting
module.exports.updateMeeting = updateMeeting
module.exports.deleteMeeting = deleteMeeting
module.exports.getMeeting = getMeeting