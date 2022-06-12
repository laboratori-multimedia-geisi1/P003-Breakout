$.fn.flashUnlimited=function(){
    $(this).fadeTo(700,0.1,function(){
        $(this).fadeTo(500,1, $(this).flashUnlimited); 
    });
}

$(document).ready(function() {
    $("#jugar").flashUnlimited();

    spawnCanvas();
    
    $("#jugar").on("click",function(){
        $("#init").hide(); $("#principal").show();
        
        let myCanvas=document.getElementById("joc");
        let ctx=myCanvas.getContext("2d");
        joc=new Joc(myCanvas,ctx);
        joc.velocitat=1;
        joc.inicialitza();
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
    $("#principal").css({
        "height": (h+parseInt($("#principal").css("border-width"))*2) +"px",
        "width":  (w+parseInt($("#principal").css("border-width"))*2) +"px"
    });
}