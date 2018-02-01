const request = require('request');
const fs = require('fs');

//GETING ALL SUBREDDITS
var raw_subreddits = fs.readFileSync('subreddits/subreddits.json');
var subreddits = JSON.parse(raw_subreddits);

//MAKING A DATE FOLDER STRING
var d = new Date();
var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
var day = days[d.getDay()];
var months = ["january","february","march","april","may","june","july", "august","september","october","november","december"];
var month = months[d.getMonth()];
var date = d.getDate();
var date_folder = day+'_'+month+'_'+date;

//GOING THROUGH SUBREDDIT ARRAY
var arr = []
for(var s=0;s<subreddits.length;s++) {

    var raw_data = fs.readFileSync('files/'+date_folder+'/'+subreddits[s]+'/urls.json');
    var data = JSON.parse(raw_data);

    for (var i = 0; i < data.length; i++) {
        var elements = data[i].split("/");

        request(data[i] + ".json", function (error, response, body) {
            if(error !== null) {
                console.log('error:', error); // Print the error if one occurred
            }
            if(response.statusCode !== 200) {
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }
            // console.log(body); // Print the HTML for the Google homepage.
            arr.push(body)
        });
    }
}
setTimeout(() => {
    var json = JSON.parse(arr[0]);
    // console.log(json[0].data.children[0].data.subreddit);
    // console.log(json[0].data.children[0].data.id);

    // throw new Error("THE END");
    for (var i = 0; i < arr.length; i++) {
        var json = JSON.parse(arr[i]);
        fs.writeFile('files/'+date_folder+'/' + json[0].data.children[0].data.subreddit + '/comments/' + json[0].data.children[0].data.id + '.json', arr[i], (callback) => {
            if(callback !== null) {
                console.log(callback);
            }
        });
    }
    console.log(arr.length);
}, subreddits.length*3500)