//jshint esversion:6

module.exports.getDate=function (){
    let today=new Date();
    let currentDay=today.getDay();
    let options={
        weekday:"long",
        day: "numeric",
        month:"long"
    }
    let day=today.toLocaleString('en-us',options);
    return day;
}

module.exports.getDay=function (){
    let today=new Date();
    let currentDay=today.getDay();
    let options={
        weekday:"long",
    }
    let day=today.toLocaleString('en-us',options);
    return day;
}

