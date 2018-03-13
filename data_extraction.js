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


for(var s=0;s<subreddits.length;s++) {

    var filesFolder = 'files';
    var files = [];
    fs.readdirSync(filesFolder).forEach(file => {
        files.push(file);
    });
    var date_folder = day+'_'+month+'_'+date;
    date_folder = files.length + '_' + date_folder;

    var testFolder = 'files/' + date_folder + '/' + subreddits[s] + '/comments';

    var posts = [];
    fs.readdirSync(testFolder).forEach(file => {
        posts.push(file);
    })

    var posts_data = [];
    for (var p = 0; p < posts.length; p++) {
        var raw_data = fs.readFileSync(testFolder + '/' + posts[0]);
        var data = JSON.parse(raw_data);

        var object_data = data[0].data.children[0].data;
        var post = new Object();
        post.domain = object_data.domain;
        post.subreddit = object_data.subreddit;
        post.url = object_data.url;
        post.id = object_data.id;
        post.title = object_data.title;
        post.selftext = object_data.selftext;
        post.num_comments = object_data.num_comments;
        post.edited = object_data.edited;
        post.created = object_data.created;
        post.ups = object_data.ups;
        post.downs = object_data.downs;
        post.score = object_data.score;
        post.comments = [];

        var comments_array = data[1].data.children;

        for (var i = 0; i < comments_array.length - 1; i++) {
            var comment = new Object();
            comment.body = comments_array[i].data.body;
            comment.ups = comments_array[i].data.ups;
            comment.downs = comments_array[i].data.downs;
            comment.score = comments_array[i].data.score;
            comment.created = comments_array[i].data.created;
            comment.depth = comments_array[i].data.depth;
            comment.comments = [];

            var replies = comments_array[i].data.replies;

            if (replies) {
                comment.comments = recursion(replies);
            } else {
                comment.comments = replies;
            }
            post.comments.push(comment);
        }

        posts_data.push(post);
    }

    var folder = 'files/' + date_folder + '/' + subreddits[s] + '/extracted_data/data.json';
    fs.writeFile(folder, JSON.stringify(posts_data), (callback) => {
        if (callback !== null) {
            console.log("Error in writing in data.json file:" + callback);
        }
    });
}
function recursion(replies) {
    var array_data = replies.data.children;
    var comments = [];

    for(var i = 0; i < array_data.length;i++){
        var comment = new Object();
        comment.body = array_data[i].data.body;
        comment.ups = array_data[i].data.ups;
        comment.downs = array_data[i].data.downs;
        comment.score = array_data[i].data.score;
        comment.created = array_data[i].data.created;
        comment.depth = array_data[i].data.depth;
        comment.comments = new Array();

        var comment_replies = array_data[i].data.replies;

        if(comment_replies) {
            comment.comments = recursion(comment_replies);
        }else{
            comment.comments = comment_replies;
        }
        comments.push(comment);
    }
    return comments;
}