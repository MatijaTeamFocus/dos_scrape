const XLSX = require('xlsx');
const request = require('request');
const fs = require('fs');

var url = "CryptoCalendar.xls";

var buf = fs.readFileSync(url);
var wb = XLSX.read(buf, {type:'buffer'});

var elements = wb.Sheets.Sheet1;
var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];

var folder = 'data/data.json';
var raw_data = fs.readFileSync(folder);
var data = JSON.parse(raw_data);

var minus = 2;

var new_data = [];

for(var d = 0;d<data.length-1;d++){

    for(var p = d+1;p<data.length;p++){
        if(data[d].created < data[p].created){
            var help = data[d];
            data[d] = data[p];
            data[p] = help;
        }
    }
}

for(var r = 2;r<139;r++){
    var row = {};

    row.id = elements['A'+r].v;
    row.date = elements['B'+r].w;
    row.open = elements['C'+r].v;
    row.high = elements['D'+r].v;
    row.low = elements['E'+r].v;
    row.close = elements['F'+r].v;
    row.volume = elements['G'+r].v;
    row.market_cap = elements['H'+r].v;

    if(elements['I'+r]){

        if(r == 50){
            console.log(row.date);
            console.log(data[r - minus].created);
        }
        // if(data[r-minus]) {
            row.ups = data[r - minus].ups;
            row.downs = data[r - minus].downs;
            row.score = data[r - minus].score;
            row.num_comments = data[r - minus].num_comments;
            row.created = data[r - minus].created;
        // }
    }else{
        minus++;
    }

    new_data.push(row);
}

// for(var i = 0;i<new_data.length;i++){
//     console.log(new_data[i].id);
//     console.log(new_data[i].date);
// }
// return;

var txtFile = 'data.txt';

fs.writeFile(txtFile,"id\tdate\tlow\topen\tclose\thigh\tvolume\tmarket_cap\tups\tdowns\tscore\tnum_comments\tcreated", (callback) => {
    if (callback !== null) {
        console.log("Error in writing in data.txt file:" + callback);
    }
});

for(var i = 0;i<new_data.length;i++) {
    var element = new_data[i];

    var t = new Date(new_data[i].created * 1000);
    var time = t + '';
    var hours = time.split(' ')[4];

    var data = ('\n' + element.id + '\t' +
        element.date + '\t' +
        element.low + '\t' +
        element.open + '\t' +
        element.close + '\t' +
        element.high + '\t' +
        element.volume + '\t' +
        element.market_cap + '\t' +
        element.ups + '\t' +
        element.downs + '\t' +
        element.score + '\t' +
        element.num_comments + '\t' +
        hours
    );
    if (i == 0) {
        var first = data;
    }
    fs.appendFileSync(txtFile, data);
}

fs.appendFileSync(txtFile,first);
