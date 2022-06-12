
// localStorage.removeItem("records");
console.log(localStorage.getItem("records"))

$.fn.flashUnlimited=function(){
    $(this).fadeTo(700,0.1,function(){
        $(this).fadeTo(500,1, $(this).flashUnlimited); 
    });
}

$(document).ready(function() {
    $("#game-menu-start").flashUnlimited();
    spawnCanvas();

    // get all records
    records2table(localStorage.getItem("records"));
    

    $("#game-menu-start").on("click",function(){
        $("#init").hide(); $("#game-menu").show();
    });

    $("#play").on("click",function(){
        let username=$("#user").val();
        if(username){  
            let myCanvas=document.getElementById("joc");
            let ctx=myCanvas.getContext("2d");
            joc=new Joc(myCanvas,ctx, username);
            joc.velocitat=1;
            joc.inicialitza();
            
            $("#game-menu").hide(); $("#principal-holder").show();
        } else {
            console.log("no username was provided.");
            $("#user").css("border-color", "red");
        }
    });

    $(".elim").on("click",function(){
        let string_recs=localStorage.getItem("records")
            records=string_recs,
            parent=$(this).parent(),
            username=parent.find(".player_name").text(),
            pr=0;
            
        if(records){
            console.log("deleting ",username);

            records=JSON.parse(records);
            pr=records.map(r=>r.username).indexOf(username);
            records.splice(pr,1);

            string_recs=JSON.stringify(records);
            localStorage.setItem("records", string_recs);
            records2table(string_recs);
        }
    });
});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);
}
function spawnCanvas(){
    // aquest tamany semble tenir menys errors.
    h=371; // parseInt(window.innerHeight*0.5); 
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
        records.sort((a,b) => b.points-a.points);
        for (let i=0;i<Math.min(records.length, 3); i++){
            table+="<tr>";
            table+="<td>"+(i+1)+".</td>";
            table+="<td class='player_name'>"+records[i].username+"</td>";
            table+="<td>"+records[i].points+"pts</td>";
            table+="<td class='elim'>X</td>";
            table+="</tr>";
        }
    }
    
    $("#records-table").html(table);
}