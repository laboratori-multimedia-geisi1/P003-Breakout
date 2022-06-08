/*
 - Control de la puntuació 
 - Persistència puntuació

 results
*/

class Display {
    // static?
    static showStartScreen() {
        if($("#start").css("display")=="none"){
            $("#start").css("display", "block");
        }
    }
    static hideStartScreen() {
        if($("#start").css("display")=="block"){
            $("#start").css("display", "none");
        }
    }

    static updatePunts(punts){
        $("#punts").text((punts+1000).toString().slice(1));
    }
    static updateVides(vides){
        $("#vides").text((vides+1000).toString().slice(1));
    }
}