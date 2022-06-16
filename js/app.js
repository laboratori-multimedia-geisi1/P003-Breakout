var joc=null,
    sound=true;

var audios={
    boing:new Audio("audios/pong.mp3"),
    background:new Audio("audios/background.mp3"),
    error:new Audio("audios/error.mp3"),
    levelUp:new Audio("audios/level_up.mp3"),
    gameOver:new Audio("audios/game_over.mp3")
}
audios.background.loop=true;
audios.background.volume=0.3;


$.fn.flashUnlimited=function(){
    $(this).fadeTo(700,0.1,function(){
        $(this).fadeTo(500,1, $(this).flashUnlimited); 
    });
}

$(document).ready(function() {
    
    $("#game-menu-start").flashUnlimited();

    $("#game-menu-start").click(function(){
        spawnMenu();
        audios.background.play();
    });
    
    $(".tria_nivell").click(function(){
        $(".tria_nivell").parent().find("label").removeClass("selected");
        $(this).parent().find("label").addClass("selected");
    });

    $("#play").click(function(){
        spawnMain();
    });

    

    $("#sound_val").click(function(){
        if(sound){
            audios.background.pause();
        } else {
            audios.background.currentTime=0;
            audios.background.play();
        }
        
        sound=!sound;
        Display.setSound(sound);
    });
});


function animacio() {
    joc.update();
    requestAnimationFrame(animacio);
}
function spawnCanvas(){
    h=371;
    w=parseInt(h/1.2);
    $("#joc-holder").html("<canvas id=\"joc\" width=\""+w+"px\" height=\""+h+"px\" ></canvas> ");
    $("#principal-holder").css({
        "height": (h+parseInt($("#principal").css("border-width"))*2+100) +"px",
        "width":  (w+parseInt($("#principal").css("border-width"))*2) +"px"
    });
    $("#principal").css({
        "height": (h+parseInt($("#principal").css("border-width"))*2) +"px",
        "width":  (w+parseInt($("#principal").css("border-width"))*2) +"px"
    });
}

function records2table(records){
    let table="";
    if(!records){
        table="<td>---</td>";
    } else {
        records=JSON.parse(records);
        if (records.length>0){
            records.sort((a,b) => b.points-a.points);
            for (let i=0;i<Math.min(records.length, 3); i++){
                table+="<tr>";
                table+="<td>"+(i+1)+".</td>";
                table+="<td class='player_name'>"+records[i].username+"</td>";
                table+="<td>"+records[i].points+"pts</td>";
                table+="<td class='elim'>X</td>";
                table+="</tr>";
            }
        } else table="<td>---</td>";
    }
    
    $("#records-table").html(table);
}

function eliminarRecords(elem){
    let string_recs=localStorage.getItem("records")
        records=string_recs,
        parent=$(elem).parent(),
        username=parent.find(".player_name").text(),
        pr=0;
    
    console.log(records)
    if(records){
        console.log("deleting ",username);

        records=JSON.parse(records);
        pr=records.map(r=>r.username).indexOf(username);
        records.splice(pr,1);

        string_recs=JSON.stringify(records);
        localStorage.setItem("records", string_recs);
        records2table(string_recs);
    } else {
        console.log("no records")
    }
}

function spawnMain(){
    let username=$("#user").val();
    if(username){  
        spawnCanvas();
        $("#go_back").show();
        $("#go_back").click(function(){
            spawnMenu()
        });

        let myCanvas=document.getElementById("joc");
        let ctx=myCanvas.getContext("2d");
        joc=new Joc(myCanvas,ctx);
        joc.velocitat=1;
        joc.inicialitza();
        
        $("#game-menu").hide(); 
        $("#principal-holder").show();
    } else {
        $("#user").css("border-color", "red");
        console.log("no username was provided.");
    }

   
}

function spawnMenu(){
    records2table(localStorage.getItem("records"));

    $(".elim").click(function(){
        console.log("this");
        eliminarRecords(this);
        console.log($(".elim"));
    });
        
    $("#init").hide();
    $("#go_back").hide();
    $("#principal-holder").hide();
    $("#game-menu").show();
    $("#sound").show();
}