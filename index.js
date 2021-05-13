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
      let date = obj['Start Date & Time'].split(' ')
      // console.log(date[1].concat(date[2]))
      // creates return object for new array
      return {
        firstName: obj['Invitee First Name'],
        email: obj['Invitee Email'],
        timeZone: obj['Invitee Time Zone'].replace(' - US & Canada', ''),
        start: function checkTimeZone() {

         let dateObj = {
           date: '',
           time: ''
         }

          if(this.timeZone == 'Central Time'){
            // -1 from time
              // format date to dddd MMMM do YYYY
            dateObj.date = Moment(date[0].replace('-','').replace('-',''), "YYYYMMDD").format('dddd, MMMM do, YYYY'),
            dateObj.time = Moment(date[1].concat(date[2]), 'hh:mm a').format('h:mmA');
            
          } else if(this.timeZone == "Mountain Time") {
            // -2 from time
              // format date to dddd MMMM do YYYY
            dateObj.date = Moment(date[0].replace('-','').replace('-',''), "YYYYMMDD").format('dddd, MMMM do, YYYY'),
            dateObj.time = date[1].concat(date[2])
            
          } else if(this.timeZone == "Eastern Time") {
            // time stays the same
              // format date to dddd MMMM do YYYY
            dateObj.date = Moment(date[0].replace('-','').replace('-',''), "YYYYMMDD").format('dddd, MMMM do, YYYY'),
            dateObj.time = date[1].concat(date[2])
          
          } else {
            console.log('there is no time zone')
          }

          return dateObj;
        }
      }
    })
    csvData = newData;

    console.log(Moment(csvData[0].start().time,'hh:mma').add(2, 'hours').format('hh:mma'))

  }
});



// parse date string. moment? 
// if timeZone === 'mountain time' -2 hours from time
// if timezone === central -1 hour from time

// 

