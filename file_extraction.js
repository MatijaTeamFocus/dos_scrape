const fs = require('fs');
var json;

var raw_subreddits = fs.readFileSync('subreddits/subreddits.json');
var subreddits = JSON.parse(raw_subreddits);

var d = new Date();
var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
var day = days[d.getDay()];
var months = ["january","february","march","april","may","june","july", "august","september","october","november","december"];
var month = months[d.getMonth()];
var date = d.getDate();
var date_folder = day+'_'+month+'_'+date;

var topics = ["new","hot","top"];

//FROM FILE TO JSON OBJECT
var rawdata_new,data_new,rawdata_hot,data_hot,rawdata_top,data_top;
for(var s=0;s<subreddits.length;s++) {
    rawdata = fs.readFileSync('files/' + date_folder + '/' + subreddits[s] + '/posts.json');
    data = JSON.parse(rawdata);

    // console.log(data.length);
//EXTRACTING ARRAY OF SUB-REDDIT OBJECTS FROM URL OBJECT

    var posts = [];
    for(var d=0;d<data.length;d++){
        for(var c=0;c<data[d].data.children.length;c++) {
            posts.push(data[d].data.children[c].data);
        }
    }

// //EXTRACTING SUB-REDDIT POST DATA OBJECTS AND PUTTING THEM IN AN ARRAY
//
//     var posts_data = [];
//     // console.log(posts[0]);
//     // throw new Error("THE END");
//     for (var p=0;p<posts.length;p++) {
//         try {
//             posts_data.push(posts[p].data);
//         }catch (err){
//             console.log(posts.length);
//             console.log(subreddits[s]);
//             console.log(p);
//             console.log(posts[p]);
//             throw new Error("THE END");
//         }
//     }

//One array without repeat!!!

    var without_repeat = [];
    for (var i = 0; i < posts.length; i++) {
        var repeat = 0;
        for (var j = i; j < posts.length; j++) {
            if (posts[i].title === posts[j].title) {
                repeat++;
            }
        }
        if (repeat === 1) {
            without_repeat.push(posts[i]);
        }
    }
    console.log("Without repeat " + subreddits[s] + ": " + without_repeat.length);

    fs.writeFile('files/' + date_folder + '/' + subreddits[s] + '/without_repeat.json', JSON.stringify(without_repeat), (callback) => {
        if(callback !== null) {
            console.log("Error in writing in no_repeat file:" + callback);
        }
    });

    var urls = [];
    for (var i = 0; i < without_repeat.length; i++) {
        var url = "https://www.reddit.com" + without_repeat[i].permalink;
        urls.push(url);
    }
    console.log("URLS: " + urls.length);

    fs.writeFile('files/' + date_folder + '/' + subreddits[s] + '/urls.json', JSON.stringify(urls), (callback) => {
        if(callback !== null) {
            console.log("Error in writing in url file:" + callback);
        }
    });
}
//PRIVATE

//PLAYING WITH SUBREDDITS

// var count_new = 0;
// var countS_new = 0;
//
// for (var j = 0; j < subredits_data_new.length; j++) {
//     if (subredits_data_new[j].domain !== "self.Stellar"){
//         count_new++;
//     }
//     if(subredits_data_new[j].domain === "self.Stellar"){
//         // console.log(subredits_data_new[j].title);
//         countS_new++;
//     }
// }
// console.log("\n"+"NEW:");
// console.log("\n"+"NEW subreddits count: "+subredits_data_new.length);
// console.log("Not Stellar count: "+count_new);
// console.log("Stellar count: "+countS_new);
//
//
// var count_hot = 0;
// var countS_hot = 0;
//
// for (var j = 0; j < subredits_data_hot.length; j++) {
//     if (subredits_data_hot[j].domain !== "self.Stellar"){
//         count_hot++;
//     }
//     if(subredits_data_hot[j].domain === "self.Stellar"){
//         // console.log(subredits_data_hot[j].title);
//         countS_hot++;
//     }
// }
// console.log("\n"+"HOT:");
// console.log("\n"+"HOT subreddits count: "+subredits_data_hot.length);
// console.log("Not Stellar count: "+count_hot);
// console.log("Stellar count: "+countS_hot);
//
//
// var count_top = 0;
// var countS_top = 0;
//
// for (var j = 0; j < subredits_data_top.length; j++) {
//     if (subredits_data_top[j].domain !== "self.Stellar"){
//         count_top++;
//     }
//     if(subredits_data_top[j].domain === "self.Stellar"){
//         // console.log(subredits_data_top[j].title);
//         countS_top++;
//     }
// }
// console.log("\n"+"TOP:");
// console.log("\n"+"TOP subreddits count: "+subredits_data_top.length);
// console.log("Not Stellar count: "+count_top);
// console.log("Stellar count: "+countS_top);