$(function(){

    timer();
})

function addZero(n){
    if(n <= 9) n = '0'+n;
    return n;
}

function printDate(str1, str2){

    $('p.date').remove();
    $('.box_date').append(`
        <p class="date">${str1}</p>
        <p class="date">${str2}</p>
    `);
}

function timer(){
    var h = setTimeout(function(){

        var date = new Date();
        var yyyy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var ss = date.getSeconds();
        var hh = date.getHours();
        var min = date.getMinutes();
    
        mm = addZero(mm);
        dd = addZero(dd);
        ss = addZero(ss);
        min = addZero(min);

        printDate(yyyy+'년 '+ mm+'월 '+ dd+'일 ', hh+':'+min+':'+ss);
        timer();
    }, 1000);
}