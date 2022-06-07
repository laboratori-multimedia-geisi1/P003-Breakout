$(document).ready(function() {
    h=window.innerHeight*0.9;
    w=h*2/3;
    console.log(h,w);
    $("#principal").html("<canvas id=\"joc\" width=\""+w+"px\" height=\""+h+"px\" ></canvas> ")

    let myCanvas=document.getElementById("joc");
    let ctx=myCanvas.getContext("2d");

    joc = new Joc(myCanvas,ctx);
    joc.velocitat=1;
    joc.inicialitza();
});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);
}