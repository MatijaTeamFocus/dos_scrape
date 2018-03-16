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

var testFolder = 'files';
var files = [];
fs.readdirSync(testFolder).forEach(file => {
    files.push(file);
});

date_folder = files.length+'_'+date_folder;

//FROM FILE TO JSON OBJECT
for(var s=0;s<subreddits.length;s++) {
    var rawdata,data,rawdata_new,data_new;


    if(fs.existsSync('files/' + date_folder + '/' + subreddits[s] + '/new_posts.json')) {
        rawdata_new = fs.readFileSync('files/' + date_folder + '/' + subreddits[s] + '/new_posts.json');
        data_new = JSON.parse(rawdata_new);
    }else{
        rawdata = fs.readFileSync('files/' + date_folder + '/' + subreddits[s] + '/posts.json');
        data = JSON.parse(rawdata);
    }
//EXTRACTING ARRAY OF SUB-REDDIT OBJECTS FROM URL OBJECT
    //IF WE HAVE NEW POSTS
    if(data_new) {
        var posts_new = [];
        for (var d = 0; d < data_new.length; d++) {
            for (var c = 0; c < data_new[d].data.children.length; c++) {
                if (data_new[d]) {
                    if (data_new[d].data) {
                        if (data_new[d].data.children) {
                            if (data_new[d].data.children[c]) {
                                if (data_new[d].data.children[c].data) {
                                    posts_new.push(data_new[d].data.children[c].data);
                                }
                            }
                        }
                    }
                }
            }
        }
    }else{
        var posts = [];
        for(var d=0;d<data.length;d++){
            for(var c=0;c<data[d].data.children.length;c++) {
                if(data[d]){
                    if(data[d].data){
                        if(data[d].data.children){
                            if(data[d].data.children[c]){
                                if(data[d].data.children[c].data){
                                    posts.push(data[d].data.children[c].data);
                                }
                            }
                        }
                    }
                }
            }
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

    if(data_new) {
        var without_repeat_new = [];

        for (var i = 0; i < posts_new.length; i++) {
            var repeat = 0;
            for (var j = i; j < posts_new.length-1; j++) {
                if (posts_new[i].title === posts_new[j].title) {
                    repeat++;
                }
            }
            if (repeat <= 1) {
                without_repeat_new.push(posts_new[i]);
            }
        }
        console.log("Without repeat from post_new " + subreddits[s] + ": " + without_repeat_new.length);

        // for(var p = 0;p<without_repeat_new.length;p++){
        //     var repeat = 0;
        //     for(var n=0;n<without_repeat_new.length;n++){
        //         if(without_repeat_new[p].title === without_repeat_new[n].title){
        //             repeat++;
        //         }
        //     }
        //     if(repeat === 0){
        //         without_repeat_new.push(without_repeat_new[p]);
        //     }
        // }
    }else{

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

    }

    // fs.writeFile('files/' + date_folder + '/' + subreddits[s] + '/without_repeat.json', JSON.stringify(without_repeat), (callback) => {
    //     if(callback !== null) {
    //         console.log("Error in writing in no_repeat file:" + callback);
    //     }
    // });

    if(data_new){
        var new_urls = [];
        for (var i = 0; i < without_repeat_new.length; i++) {
            var url = 'https://www.reddit.com'+without_repeat_new[i].permalink;
            new_urls.push(url);
        }
        console.log("New posts URLS: " + new_urls.length);

        var old_urls = fs.readFileSync('files/' + date_folder + '/' + subreddits[s] + '/urls.json');
        var old_urls_data = JSON.parse(old_urls);

        var length = old_urls_data.length;
        for(var n=0;n<new_urls.length;n++){
            var exist = 0;
            for(var o=0;o<length;o++){
                if(new_urls[n] === old_urls_data[o]){
                    exist = 1;
                    break;
                }
            }
            if(exist === 0){
                old_urls_data.push(new_urls[n]);
            }
        }

        console.log("Added URLS: "+(old_urls_data.length-new_urls.length));

        fs.writeFile('files/' + date_folder + '/' + subreddits[s] + '/urls.json', JSON.stringify(old_urls_data), (callback) => {
            if(callback !== null) {
                console.log("Error in writing in url file:" + callback);
            }
        });
    }else{
        var urls = [];
        for (var i = 0; i < without_repeat.length; i++) {
            var url = 'https://www.reddit.com'+without_repeat[i].permalink;
            urls.push(url);
        }
        console.log("URLS: " + urls.length);

        fs.writeFile('files/' + date_folder + '/' + subreddits[s] + '/urls.json', JSON.stringify(urls), (callback) => {
            if(callback !== null) {
                console.log("Error in writing in url file:" + callback);
            }
        });
    }

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