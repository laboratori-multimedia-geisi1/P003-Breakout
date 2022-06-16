class Bola {
    constructor(puntPosicio, radi, joc) {
        this.joc=joc;  
        this.color="#fff";

        this.radi=radi;
        this.posicio_inicial=new Punt(puntPosicio.x, puntPosicio.y);

        this.coordsX=[0, joc.amplada];

        this.enabled=false
        this.generarRandStart(); 
    };

    draw(ctx) {
        
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    mou(x,y){
        this.posicio.x += x;
        this.posicio.y += y;
    }
    update(){
        
        if(this.enabled){ // !joc.game_over
            let puntActual=this.posicio;
            let puntSeguent=new Punt(this.posicio.x+this.vx,this.posicio.y+this.vy);
            let trajectoria=new Segment(puntActual, puntSeguent);
            let exces;
            let xoc=false;
            let xoc_inferior=false;

            // START Xoc amb les cantonades del canvas
            if(trajectoria.puntB.y + this.radi > joc.alcada){

                exces=(trajectoria.puntB.y + this.radi - joc.alcada)/this.vy;
                this.posicio.x=trajectoria.puntB.x - exces*this.vx;
                this.posicio.y=joc.alcada - this.radi;
                xoc=true;
                this.vy=-this.vy;
                
                xoc_inferior=true;
            }

            if(trajectoria.puntB.y - this.radi < 0){
                // exces= (trajectoria.puntB.y - this.radi)/this.vy;
                // this.posicio.x = trajectoria.puntB.x - exces*this.vx;
                // this.posicio.y = this.radi;
                // xoc = true;
                // this.vy = -this.vy;
                if(sound){
                    console.log("audio is on")
                    audios.levelUp.play();
                } else {
                    console.log("audio is off")
                }

                this.posicio_rand();
                this.joc.nextLevel();
                console.log("next level");


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
                    
                    joc.punts+=5; // cada color == els seus punts.
                    Display.updatePunts(joc.punts);
                    joc.totxos.splice(i, 1);

                    
                }
            }
            // END

            let xocPala = this.interseccioSegmentRectangle(trajectoria, {
                posicio: {
                    x: joc.pala.posicio.x - this.radi, 
                    y: joc.pala.posicio.y - this.radi
                },
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
            if(xoc && sound){
                console.log("audio is on")
                audios.boing.play();
            }
            
            if(xoc_inferior){
                this.restaVida();
                if (joc.vides==0){
                    if(sound) audios.gameOver.play();

                    this.enabled=false;
                    this.joc.gameOver();
                } else if(sound) audios.error.play();
            } else {
                if (!xoc) {
                    this.posicio.x = trajectoria.puntB.x;
                    this.posicio.y = trajectoria.puntB.y;
                }
            }
            
        }else{
            if(!this.coordsX.includes(this.posicio.x)) 
                this.posicio_rand();
        }
    
    }

    interseccioSegmentRectangle(segment, rectangle){
        
        //REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
        //SI EXISTEIX, QUIN ÉS AQUEST PUNT (si hi ha més d'un, el més ajustat)
        let puntI,
            distanciaI,
            puntIMin,
            distanciaIMin=Infinity,
            voraI;

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


    posicio_rand(){
        this.posicio=new Punt(
            this.coordsX[Math.floor(Math.random()*2)],
            this.posicio_inicial.y
        );
    }

    generarRandStart(){
        
        this.posicio_rand();
        this.vx=1+Math.random()*3;
        this.vy=1+Math.random()*2;

        console.log("vx: "+this.vx+" vy: "+this.vy);
    }

    restaVida(){
        joc.vides-=1;

        Display.updateVides(joc.vides);
        
        $("#principal").css("border-color","#9e1e0f");
        setTimeout(function(){
            $("#principal").css("border-color","white");
        }, 100);
    }
}



