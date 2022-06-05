class Bola {
    constructor(puntPosicio, radi) {
        this.radi=radi;
        this.posicio_principal=new Punt(puntPosicio.x, puntPosicio.y);
        this.posicio=new Punt(this.posicio_principal.x, this.posicio_principal.y);
        this.vx=1;
        this.vy=3;
        
        this.enabled=false
       
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    reset(){
        console.log("new pos")
        this.posicio=this.posicio_principal;
    }

    mou(x,y){
        this.posicio.x += x;
        this.posicio.y += y;
    }
    update(){
        if(this.enabled){
            let puntActual=this.posicio;
            let puntSeguent=new Punt(this.posicio.x+this.vx,this.posicio.y+this.vy);
            let trajectoria=new Segment(puntActual, puntSeguent);
            let exces;
            let xoc=false;
            let xoc_inferior=false;

            // START Xoc amb les cantonades del canvas
            if(trajectoria.puntB.y + this.radi > joc.alcada){
                //FALTA: restar 1 al contador de vides
                xoc_inferior=true;
            }
            if(trajectoria.puntB.y - this.radi < 0){
                exces= (trajectoria.puntB.y - this.radi)/this.vy;
                this.posicio.x = trajectoria.puntB.x - exces*this.vx;
                this.posicio.y = this.radi;
                xoc = true;
                this.vy = -this.vy;

            }

            if(trajectoria.puntB.x +this.radi > joc.amplada){
                exces = (trajectoria.puntB.x + this.radi - joc.amplada)/this.vx;
                this.posicio.x = joc.amplada - this.radi;
                this.posicio.y = trajectoria.puntB.y -exces * this.vy;
                xoc = true;
                this.vx = -this.vx;
            }

            if(trajectoria.puntB.x -this.radi < 0){
                exces= (trajectoria.puntB.x -this.radi)/this.vx;
                this.posicio.x = this.radi;
                this.posicio.y = trajectoria.puntB.y -exces *this.vy;
                xoc = true;
                this.vx = -this.vx;
            }
            // END


            //Xocs amb totxos
            
            for(let i=joc.totxos.length-1; i>=0; --i){
                let xocTotxo = this.interseccioSegmentRectangle(trajectoria, {
                    posicio: {x: joc.totxos[i].posicio.x - this.radi, y: joc.totxos[i].posicio.y - this.radi},
                    amplada: joc.totxos[i].amplada + 2 * this.radi,
                    alcada: joc.totxos[i].alcada+2*this.radi
                });
        
                if (xocTotxo){
                    xoc=true;
                    this.posicio.x=xocTotxo.pI.x;
                    this.posicio.y=xocTotxo.pI.y;
                    switch(xocTotxo.vora){
                        case "superior":
                        case "inferior": 
                            this.vy = -this.vy;
                            break;
                        case "esquerra":
                        case"dreta": 
                            this.vx = -this.vx;
                            break;
                    }
                    
                    joc.totxos.splice(i, 1);
                }
            }
            // END

            //Xocs amb palas
            /* de moment joc no adaptat a més duna pala
            for(let i=joc.palas.length-1; i>=0; --i){
                let xocPala = this.interseccioSegmentRectangle(trajectoria, {
                    posicio: {x: joc.palas[i].posicio.x - this.radi, y: joc.palas[i].posicio.y - this.radi},
                    amplada: joc.palas[i].amplada + 2 * this.radi,
                    alcada: joc.palas[i].alcada+2*this.radi
                });

                if (xocPala){
                    xoc=true;
                    this.posicio.x=xocPala.pI.x;
                    this.posicio.y=xocPala.pI.y;
                    switch(xocPala.vora){
                        case "superior":
                        case "inferior":
                            this.vy = -this.vy;
                            break;
                        case "esquerra":
                        case"dreta":
                            this.vx = -this.vx;
                            break;
                    }
                }
            }*/

            let xocPala = this.interseccioSegmentRectangle(trajectoria, {
                posicio: {x: joc.pala.posicio.x - this.radi, y: joc.pala.posicio.y - this.radi},
                amplada: joc.pala.amplada + 2 * this.radi,
                alcada: joc.pala.alcada+2*this.radi
            });

            if (xocPala){
                xoc=true;
                this.posicio.x=xocPala.pI.x;
                this.posicio.y=xocPala.pI.y;
                switch(xocPala.vora){
                    case "superior":
                    case "inferior":
                        this.vy = -this.vy;
                        break;
                    case "esquerra":
                    case"dreta":
                        this.vx = -this.vx;
                        break;
                }
            }

            // END

            // Xocs amb boles
            /* de moment inutil
            for(let i=joc.boles.length-1; i>=0; --i){
                let xocBola = this.interseccioSegmentRectangle(trajectoria, {
                    posicio: {x: joc.boles[i].posicio.x - this.radi, y: joc.boles[i].posicio.y - this.radi},
                    amplada: joc.boles[i].radi*2,
                    alcada: joc.boles[i].radi*2
                });

                if (xocBola){
                    xoc=true;
                    this.posicio.x=xocBola.pI.x;
                    this.posicio.y=xocBola.pI.y;
                    switch(xocBola.vora){
                        case "superior":
                        case "inferior":
                            this.vy = -this.vy;
                            break;
                        case "esquerra":
                        case"dreta":
                            this.vx = -this.vx;
                            break;
                    }
                }
            } */
            // END

            // Interpretació del xoc
            if(xoc){ //(!xoc && this.enabled)
                this.update()
            }
            else if(xoc_inferior){
                this.posicio =new Punt(this.posicio_principal.x, this.posicio_principal.y);
                this.enabled=false;
                this.vx=1;
                this.vy=3;
            }
            else {
                this.posicio.x = trajectoria.puntB.x;
                this.posicio.y = trajectoria.puntB.y;
            }
        }
    
    }

    interseccioSegmentRectangle(segment, rectangle){

        //REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
        //SI EXISTEIX, QUIN ÉS AQUEST PUNT
        //si hi ha més d'un, el més ajustat
        let puntI;
        let distanciaI;
        let puntIMin;
        let distanciaIMin=Infinity;
        let voraI;

        //calcular punt d'intersecció amb les 4 vores del rectangle
        //necessitem coneixer els 4 segments del rectangle
        //vora superior
        let segmentVoraSuperior = new Segment(
            rectangle.posicio,
            new Punt(
                rectangle.posicio.x + rectangle.amplada, 
                rectangle.posicio.y
            )
        );
        //vora inferior
        let segmentVoraInferior = new Segment(
            new Punt(
                rectangle.posicio.x,
                rectangle.posicio.y+rectangle.alcada
            ),
            new Punt(
                rectangle.posicio.x + rectangle.amplada,
                rectangle.posicio.y+rectangle.alcada
            )
        );

        //vora esquerra
        let segmentVoraEsquerra = new Segment(
            rectangle.posicio,
            new Punt(rectangle.posicio.x , rectangle.posicio.y + rectangle.alcada)
        );


        //vora dreta
        let segmentVoraDreta = new Segment(
            new Punt(
                rectangle.posicio.x+rectangle.amplada,
                rectangle.posicio.y
            ),
            new Punt(
                rectangle.posicio.x+rectangle.amplada,
                rectangle.posicio.y+rectangle.alcada
            )
        );

      
     
        //vora superior
        puntI = segment.puntInterseccio(segmentVoraSuperior);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "superior";
            }
        }
        //vora inferior
        puntI = segment.puntInterseccio(segmentVoraInferior);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "inferior";
            }
        }
        //vora esquerra
        puntI = segment.puntInterseccio(segmentVoraEsquerra);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "esquerra";
            }
        }
        //vora dreta
        puntI = segment.puntInterseccio(segmentVoraDreta);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "dreta";
            }
        }

        if(voraI){
            return {pI: puntIMin, vora: voraI};
        }
    }
}

