/*
 - Dibuix dels murs de totxo 
 - Tria de nivell i canvi de nivell per botons 
 - Xoc amb els totxos del mur 
 - Xoc amb la pala 
 - Xoc vora inferior, perd vida i reinicialitza 
 - Detecta el final del mur, passant al següent nivell - ???
 - Gestiona el temps de l'animació, parant quan es canvia de mur. - ???
*/

class Mur {
    constructor(level, given_width, given_height, totxo_width, totxo_height){
        this.colors();

        this.level=level;
        
        this.totxo_width=totxo_width;
        this.totxo_height=totxo_height;

        this.playground_width=given_width;
        this.playground_height=given_height;       
    }

    generate_totxos(){
        let totxos=[];
        for(let y=0; y<this.level.pos.length; y++){
            let y_cord=(this.playground_height-this.level.pos.length*this.totxo_height)/(this.level.pos.length+1)*(y+1)+this.totxo_height*y;
            for(let x=0; x<this.level.pos[y].length; x++){
                if(this.level.pos[y][x]!=" "){
                    let x_cord=(this.playground_width-this.level.pos[0].length*this.totxo_width)/(this.level.pos[0].length+1)*(x+1)+this.totxo_width*x;

                    totxos.push(new Totxo(
                        new Punt(
                            x_cord,
                            y_cord
                        ), 
                        this.totxo_width, this.totxo_height, this.colors[this.level.pos[y][x]]
                    ));
                }
            }
        }
        this.totxos=totxos;
        return totxos;
    }

    colors(){
        this.colors={
            "r":"#f00",
            "g":"#0f0",
            "b":"#00f",
            "y":"#ff0",
            "k":"#f0f",
            "u":"#80f",
            "o":"#ff9000"
        }
    }
}