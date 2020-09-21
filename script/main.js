//전역상수, 변수
const d = new Date();
const YEAR = d.getFullYear();
const MONTH = d.getMonth();
const DATE = d.getDate();
const DAY = d.getDay();
const YEARMONTH = ""+YEAR+addZero(MONTH+1);
var id = "";
var url = "";
var targetDate = "";

//onload entry
$(function(){
    init_timer();
    init_calender();
    
    //event
    $('.btn_find').on('click', function(){
        $('.box_date').addClass('off')
        $('.box_calender').addClass('on')
        id = $('.ipt_id').val();
        url = `../json/${YEARMONTH+id}.json`
        httpGet(url, data => {
            renderData(data);
        }, error => alert("등록되지 않은 사용자") );
    })

    $('a.col').on('click', function(){
        
        targetDate = $(this).find('span.date').text();
        
        if( targetDate.length > 0 ) {
            $('.box_detail').addClass('on');
            httpGet(url, data => {
                var obj = JSON.parse(data);
                const wHour = obj[targetDate].W;
                const lHour = obj[targetDate].L;
                const cHour = obj[targetDate].C;
                const wContent = obj[targetDate].W_Content.split(",");
                const lContent = obj[targetDate].L_Content.split(",");
                const cContent = obj[targetDate].C_Content.split(",");
                $('.t_work .txt_total').text(wHour);
                $('.t_life .txt_total').text(lHour);
                $('.t_career .txt_total').text(cHour);
                $('.c_work .list_content li').remove();
                $('.c_life .list_content li').remove();
                $('.c_career .list_content li').remove();
                for(var i=0; i<wContent.length; i++){
                    $('.c_work .list_content').append(`
                        <li>
                            <span class="content">${wContent[i]}</span>
                            <button class="btn_remove">x</button>
                        </li>
                    `)
                }
                for(var i=0; i<lContent.length; i++){
                    $('.c_life .list_content').append(`
                        <li>
                            <span class="content">${lContent[i]}</span>
                            <button class="btn_remove">x</button>
                        </li>
                    `)
                }
                for(var i=0; i<cContent.length; i++){
                    $('.c_career .list_content').append(`
                        <li>
                            <span class="content">${cContent[i]}</span>
                            <button class="btn_remove">x</button>
                        </li>
                    `)
                }

                $('.btn_remove').on('click', function(){
                    var content = $(this).prev().text();
                    content = content.split('h')[0];
                    var total = $(this).parent().parent().parent().prev().find('.txt_total');
                    var newTotal = total.text() - content;
                    total.text(newTotal);
                    $(this).parent().remove();
                });
                
            }, error => alert("사용자 정보를 불러올 수 없습니다.") );
        }
    })

    

    $('.btn_more').on('click', function(){
        $('.box_detail > div').removeClass('on');
        var idx = $(this).parent().parent().index()-1;
        $('.box_detail > div').eq(idx).addClass('on');
    })

    $('.btn_close').on('click', function(){
        $('.box_detail').removeClass("on");
    })

    $('.btn_add').on('click',function(){
        var h = $('.ipt_hour').val();
        var c = $('.ipt_content').val();
        var full = h + "h " + c;

        $(this).parent().prev().append(
            `<li>
                <span class="content">${full}</span>
                <button class="btn_remove">x</button>
            </li>`
        )

        var total = $(this).parent().parent().prev().find('.txt_total');
        var newTotal = parseInt(total.text(),10) + parseInt(h, 10);
        total.text(newTotal);

        $('.btn_remove').on('click', function(){
            var content = $(this).prev().text();
            content = content.split('h')[0];
            var total = $(this).parent().parent().parent().prev().find('.txt_total');
            var newTotal = total.text() - content;
            total.text(newTotal);
            $(this).parent().remove();
        });
    })


    $('.btn_save').on('click', function(){
        // contents 부분에있는 정보를 json으로 변환
        var strDate = addZero(parseInt(targetDate));
        var wHour = $('.t_work .txt_total').text();
        var lHour = $('.t_life .txt_total').text();
        var cHour = $('.t_career .txt_total').text();
        var wContent = ""
        $('.c_work > ul > li > span').each(function(){
            wContent+= $(this).text()+",";
        });
        var lContent =""
        $('.c_life > ul > li > span').each(function(){
            lContent+= $(this).text()+",";
        });
        var cContent = "";
        $('.c_career > ul > li > span').each(function(){
            cContent+= $(this).text()+",";
        });
        var obj = {
            "date" : strDate,
            "W" :  wHour,
            "L" :  lHour,
            "C" :  cHour,
            "W_Content" : wContent,
            "L_Content" : lContent,
            "C_Content" : cContent,
        }
        var data= JSON.stringify(obj);
        console.log(data)

        var xhr = $.post("http://127.0.0.1:987/json", obj);
    })
})


// function def
var init_calender = function(){
    var first = new Date(YEAR, MONTH, 1);
    var dayFirst = first.getDay();
    var count = 1;
    const initialColumn = 7;

    while( count <= 31 ){
        $('.col').eq(initialColumn + dayFirst + count).prepend(`
        <span class="date">${count}</span>
        <div class="box_content">
            <ul>
                <li>
                    <span class="symbol s_work">W</span>
                    <span class="value v_work"></span>
                </li>
                <li>
                    <span class="symbol s_life">L</span>
                    <span class="value v_life"></span>
                </li>
                <li>
                    <span class="symbol s_career">C</span>
                    <span class="value v_career"></span>
                </li>
            </ul>
            <span class="notice">o</span>
        </div>
    `)
        count++;
    } 
    
}

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

//시간 출력을 위한 함수
function init_timer(){
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
}

//settimeout
function timer(){
    var h = setTimeout(function(){
        init_timer();
    }, 1000);
}
// 사용자 data 요청 ajax
function httpGet(url, successCallback, errorCallback){
    const req = new XMLHttpRequest();
    req.onload = () =>{
        if(req.status >= 200 && req.status < 300){
            successCallback(req.response);
        }else{
            errorCallback(new Error(req.statusText));
        }
    }
    req.error = errorCallback;
    req.open('GET', url);
    req.setRequestHeader('Accept', 'application/json');
    req.send();
}

// json을 스케줄러에 rendering 하는 함수
function renderData(d){
    var obj = JSON.parse(d);
    var first = 0;
    var targetCol = 0;
    var w="", l="", c = "";
    //1일에 해당하는 col eq를 찾습니다.
    $('span.date').each(function(){
        if($(this).text() === '1'){ first = $(this).parent().index();}
    })
    targetCol = first;
    //1일부터 31일까지 사용자의 data를 입력합니다.
    for(var i=1; i<=31; i++){
        if( i !== undefined ){
            w = obj[i.toString()]["W"];
            l = obj[i.toString()]["L"];
            c = obj[i.toString()]["C"];
            notice = obj[i.toString()]["notice"];
            $('a.col').eq(targetCol).find('span.v_work').text(w);
            $('a.col').eq(targetCol).find('span.v_life').text(l);
            $('a.col').eq(targetCol).find('span.v_career').text(c);
            $('a.col').eq(targetCol).find('span.notice').text(notice);
            targetCol++;
        }
    }
}
//content 를 json 형태로 전송
function postData(data){

}
