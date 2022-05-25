$(document).ready(function() {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

    joc = new Joc(myCanvas,ctx);
    joc.velocitat=1;
    joc.inicialitza();
  

});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);
}