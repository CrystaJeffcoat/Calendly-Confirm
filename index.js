const fs = require('fs');
const Papa = require('papaparse');
const Moment = require('moment')

// reads csv file 
const file = fs.createReadStream('events-export.csv');

// holds an array of session data 
var csvData;

// turns csv file into JSON object
Papa.parse(file, {
  delimiter: "",
  header: true,
  complete: function (results, file) {
    // creates new object with necessary data
    const newData = results.data.map(obj => {

      // splits start date string to use for moment.js
      const currDate = obj['Start Date & Time'].split(' ')
      const time = Moment(currDate[1].concat(currDate[2]), 'hh:mm a').format('h:mmA');
      const timeZone = obj['Invitee Time Zone'].replace(' - US & Canada', '')
      // creates return object for new array
      return {
        firstName: obj['Invitee First Name'],
        email: obj['Invitee Email'],
        timeZone: timeZone,
        date: Moment(currDate[0].replace('-', '').replace('-', ''), "YYYYMMDD").format('dddd, MMMM Do, YYYY'),
        // changes time for student timezones
        time: checkTimeZone(timeZone, time)
      }
    })
    csvData = newData;

    console.log(csvData)

  }
});

function checkTimeZone(timeZone, time) {

  if (timeZone == 'Central Time') {
    // -1 from time
    let newTime = Moment(time, 'hh:mma').subtract(1, 'hours').format('h:mma')
    return newTime + ' CST';

  } else if (timeZone == "Mountain Time") {
    // -2 from time 
    let newTime = Moment(time, 'hh:mma').subtract(2, 'hours').format('h:mma');
    return newTime + ' MT';

  } else if (timeZone == "Eastern Time") {
    // time stays the same
    let newTime = time;
    //let newTime = Moment(time, 'hh:mma').format('hh:mma')
    return time + ' EST'

  } else {
    console.log('there is no time zone')
    return
  }
}

// parse date string. moment? 
// if timeZone === 'mountain time' -2 hours from time
// if timezone === central -1 hour from time

// 

