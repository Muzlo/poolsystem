// eg:2019-04-07T16:00:00.000+0000
import Vue from 'vue'
Vue.filter('myTime', function (date) {
    var arr = date.split("T");
    var d = arr[0];
    var darr = d.split("-");

    var t = arr[1];
    var tarr = t.split(".000");
    var marr = tarr[0].split(":");

    var dd =
    parseInt(darr[0]) +
    "/" +
    parseInt(darr[1]) +
    "/" +
    parseInt(darr[2]) +
    " " +
    parseInt(marr[0]) +
    ":" +
    parseInt(marr[1]) +
    ":" +
    parseInt(marr[2]);
    return dd;
})

Vue.filter('formatDateTime', function (date) {
    var time = new Date(Date.parse(date));
    time.setTime(time.setHours(time.getHours() + 8));
    let addZero=function (num){
        return num < 10 ? '0' + num : num;
    }
    var Y = time.getFullYear() + '-';
    var  M = addZero(time.getMonth() + 1) + '-';
    var D = addZero(time.getDate()) + ' ';
    var h = addZero(time.getHours()) + ':';
    var m = addZero(time.getMinutes()) + ':';
    var  s = addZero(time.getSeconds());
    return Y + M + D + h +m +s;
})