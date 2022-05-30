/*
 - Dibuix dels murs de totxo 
 - Tria de nivell i canvi de nivell per botons 
 - Xoc amb els totxos del mur 
 - Xoc amb la pala 
 - Xoc vora inferior, perd vida i reinicialitza 
 - Detecta el final del mur, passant al següent nivell 
 - Gestiona el temps de l'animació, parant quan es canvia de mur.
*/

class Mur {
    constructor(rows, cols, given_width, given_height, totxo_width, totxo_height, difficulty){
        this.totxo_width=totxo_width;
        this.totxo_height=totxo_height;

        this.playground_width=given_width;
        this.playground_height=given_height;


        // its possible to save all into just 1 array (rows*cols). better solution?
        this.toxtos=[];
        for(let y=0; y<this.rows; y++){
            this.totxos[y]=[];
            let y_cord=(2.5*given_height/4-rows*totxo_height)/(rows+1)*(y+1)+totxo_height*y;
            for(let x=0; x<cols; x++){
                let x_cord=(given_width-cols*totxo_width)/(cols+1)*(x+1)+totxo_width*x;

                this.totxos[y][x]=new Totxo(
                    new Punt(
                        x_cord,
                        y_cord
                    ), 
                    totxo_width, totxo_height, "#00f"
                );
            }
        }
    }

    
}