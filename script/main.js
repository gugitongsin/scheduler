//Global variables
var User = {
    //name
    //data
};
const SERVER_IP = "114.129.111.24:987";
//const SERVER_IP = "http://127.0.0.1:987";

//onload entry
$(function(){
    $(".btn_find").on("click", function(){
        User.name = $(".ipt_id").val()
        getHTTP(SERVER_IP+"/userinfo");

        $(".box_calender").addClass("on")
    })

    $("a.col").on("click", function(){
        $(".box_detail").addClass("on")
        postHTTP(SERVER_IP+"/userinfo");
    })

    $(".btn_close").on("click", function(){
        $(".box_detail").removeClass("on");
    })
})


//http Get request function
var getHTTP = (target) => {
    $.ajax({
        url : target,
        type : "GET",
        cache : false,
        data: "name="+User.name,
        success : function(data){
            User.data = data;
            console.log("300:"+data)
        },
        error : function(request, status, error){
            var msg = "ERROR: get request failed"+ error;
            console.log(msg);
        }
    })
}

var postHTTP = (target, json) => {
    $.ajax({
        url: target,
        type : "POST",
        cache : false,
        data : {
            type : "WLC",
            targetDate : 6,
            name: User.name,
            W: "1h bkr",
            L: "1h as",
            C: "2h ff",
            Comment: "기진석:안녕하세요"
        },
        success : function(data){
            console.log(`POST to ${target}`)
        }
    })
}


//rendering Content
var renderCalender = function(d){
    return 0;
}