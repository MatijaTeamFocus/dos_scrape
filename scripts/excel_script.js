const csv = require('fast-csv');
const XLSX = require('xlsx');
const request = require('request');
const fs = require('fs');

var url = "CryptoCalendar.xls";

var buf = fs.readFileSync(url);
var wb = XLSX.read(buf, {type:'buffer'});

// console.log(wb);
// console.log(Object.getOwnPropertyNames(wb));
// console.log(Object.getOwnPropertyNames(wb.Sheets))
//console.log(Object.getOwnPropertyNames(wb.Sheets.Sheet1));
//console.log(wb.Sheets.Sheet1['B91'].w);
// console.log(wb.Sheets.Sheet1);

var elements = wb.Sheets.Sheet1;
var letters = ['A','B','C','D','E','F','G','H','I'];
var urls = [];

for(var r = 1;r<92;r++){
    var print = '';
    for(var l = 0;l<letters.length;l++){
        var index = letters[l]+r;

        var element = elements[index];

        if(element){
            print = print + ' ' + element.w;
            if(letters[l] === 'I' && r !== 1){
                urls.push(element.w);
            }
        }

    }
    // console.log(print);
}
// console.log(urls);

var posts = [];
var problems = [];
for(var u = 0;u<urls.length;u++){
    request(urls[u] + ".json", function (error, response, body) {
        if(error !== null ){
            if(error.errno !== 'ETIMEDOUT') {
                console.log('error:', error); // Print the error if one occurred
            }
        }
        if(response) {
            if (response.statusCode) {
                if (response.statusCode !== 200) {
                    console.log('response: ',response.request.uri.href);
                    problems.push(response.request.uri.href);
                }else{
                    posts.push(body);
                }
            }
        }
    });

}

setTimeout(() => {
    var json = JSON.parse(posts[0]);

    // console.log(json[0].data.children[0]);

    for (var i = 0; i < posts.length; i++) {
        var json = JSON.parse(posts[i]);

        // console.log(json[0].data.children[0].data);
        // return;
        fs.writeFile('files/'+(json[0].data.children[0].data.title) + '.json', JSON.stringify(json), (callback) => {
            if(callback !== null) {
                console.log(callback);
            }
        });
    }

    // fs.appendFile('files/' + date_folder + '/problematic.json', JSON.stringify(urls), (callback) => {
    //     if(callback !== null) {
    //         console.log(callback);
    //     }
    // });

    console.log("Extracted posts: "+posts.length);
    console.log("Problematic ones: "+problems.length);
}, 10000);