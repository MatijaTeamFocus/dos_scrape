const request = require('request');
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

var topics = ["new","hot","top","controversial","rising"];
// var topics = ["new","hot","top"];

//DIRECTORY CREATION
if (!fs.existsSync('files/'+date_folder)) {
    fs.mkdirSync('files/'+date_folder);
}
for(var s=0;s<subreddits.length;s++) {
    if (!fs.existsSync('files/' + date_folder + '/' + subreddits[s])) {
        fs.mkdirSync('files/' + date_folder + '/' + subreddits[s]);

        if (!fs.existsSync('files/' + date_folder + '/' + subreddits[s]+'/comments')) {
            fs.mkdirSync('files/' + date_folder + '/' + subreddits[s]+'/comments');
        }
    }
}

//EXTRACTING DATA FROM URL!!!

var posts =[];

for(var sub=0;sub<subreddits.length;sub++) {
    for (var t = 0; t < topics.length; t++) {
        var subreddit = subreddits[sub];
        var topic = topics[t];

        console.log('https://www.reddit.com/r/'+subreddit+'/'+topic+'.json');
        request('https://www.reddit.com/r/'+subreddit+'/'+topic+'.json', function (error, response, body) {
            if(error !== null) {
                console.log('error:', error); // Print the error if one occurred
            }
            if(response.statusCode !== 200) {
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }
                // console.log(body ,undefined,2); // Print the HTML for the Google homepage.
            posts.push(JSON.parse(body));
        });
    }
}

setTimeout(() => {
    //console.log(posts[0].data.children[0].data.subreddit);

    // var counter = 0;
    for(var s=0;s<subreddits.length;s++) {
        var file_posts = [];
        var index = 0;
        for (var i = 0; i < posts.length; i++) {
            if(subreddits[s] === posts[i].data.children[0].data.subreddit){
                index = i;
                file_posts.push(posts[i]);
            }
        }

        fs.appendFile('files/' + date_folder + '/' + posts[index].data.children[0].data.subreddit + '/posts.json', JSON.stringify(file_posts), (callback) => {
            if(callback !== null) {
                console.log(callback);
            }
        });
    }
    console.log("Topic posts: "+posts.length);
}, subreddits.length*2500);