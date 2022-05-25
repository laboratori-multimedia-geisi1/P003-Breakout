class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = 1;
        this.vy = 3;
        this.color = "#0095DD";
       
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    mou(x,y){
        this.posicio.x += x;
        this.posicio.y += y;
    }

    update(){
        let puntActual = this.posicio;
        let puntSeguent= new Punt(this.posicio.x+this.vx, this.posicio.y+this.vy);
        let trajectoria= new Segment(puntActual, puntSeguent);
        let exces;
        let xoc = false;

         //Xoc amb les cantonades del canvas

         // xoc inferior
         if(trajectoria.puntB.y + this.radi > joc.alcada){
            exces= (trajectoria.puntB.y + this.radi - joc.alcada)/this.vy;
            this.posicio.x = trajectoria.puntB.x - exces*this.vx;
            this.posicio.y = joc.alcada - this.radi;
            xoc = true;
            this.vy = -this.vy;

        }
        //xoc adalt
        if(trajectoria.puntB.y - this.radi < 0){
            exces= (trajectoria.puntB.y - this.radi)/this.vy;
            this.posicio.x = trajectoria.puntB.x - exces*this.vx;
            this.posicio.y = this.radi;
            xoc = true;
            this.vy = -this.vy;

        }

        //xoc dreta
        if(trajectoria.puntB.x +this.radi > joc.amplada){
            exces = (trajectoria.puntB.x + this.radi - joc.amplada)/this.vx;
            this.posicio.x = joc.amplada - this.radi;
            this.posicio.y = trajectoria.puntB.y -exces * this.vy;
            xoc = true;
            this.vx = -this.vx;
        }
        //xoc esquerra
        if(trajectoria.puntB.x -this.radi < 0){
            exces= (trajectoria.puntB.x -this.radi)/this.vx;
            this.posicio.x = this.radi;
            this.posicio.y = trajectoria.puntB.y -exces *this.vy;
            xoc = true;
            this.vx = -this.vx;
        }

        //Xoc amb un totxo
        let xocTotxo = this.interseccioSegmentRectangle(trajectoria, {
            posicio: {x: joc.totxo.posicio.x-this.radi, y: joc.totxo.posicio.y-this.radi},
            amplada: joc.totxo.amplada + 2*this.radi,
            alcada: joc.totxo.alcada + 2*this.radi
        });

        if (xocTotxo){
            xoc = true;
            this.posicio.x = xocTotxo.pI.x;
            this.posicio.y = xocTotxo.pI.y;
            switch(xocTotxo.vora){
                case "superior":
                case "inferior": this.vy = -this.vy;
                    break;
                case "esquerra":
                case"dreta": this.vx = -this.vx;
                    break;
            }

        }

        //Xoc amb la pala
        let xocPala = this.interseccioSegmentRectangle(trajectoria, {
            posicio: {x: joc.pala.posicio.x-this.radi, y: joc.pala.posicio.y-this.radi},
            amplada: joc.pala.amplada + 2*this.radi,
            alcada: joc.pala.alcada + 2*this.radi
        });

        if (xocPala){
            console.log("xocPala");
            xoc=true;
            this.posicio.x = xocPala.pI.x;
            this.posicio.y = xocPala.pI.y;

            switch(xocPala.vora){
                case "inferior": 
                    console.log("inferior")
                case "superior":
                    console.log("superior")
                    this.vy=-this.vy;
                    break;
                case "esquerra":
                    console.log("esquerra")
                case"dreta": 
                    console.log("dreta")
                    this.vx=-this.vx;
                    break;
            }

        }

        if (!xoc){
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }    
            
    }

    interseccioSegmentRectangle(segment, rectangle){

        //REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
        //SI EXISTEIX, QUIN ÉS AQUEST PUNT
        //si hi ha més d'un, el més ajustat
        let puntI;
        let distanciaI;
        let puntIMin;
        let distanciaIMin = Infinity;
        let voraI;

        //calcular punt d'intersecció amb les 4 vores del rectangle
        // necessitem coneixer els 4 segments del rectangle
        //vora superior
        let segmentVoraSuperior = new Segment(rectangle.posicio,
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y));
        //vora inferior
        let segmentVoraInferior = new Segment(
            new Punt(rectangle.posicio.x,
                    rectangle.posicio.y+rectangle.alcada),
            new Punt(rectangle.posicio.x + rectangle.amplada,
                rectangle.posicio.y+rectangle.alcada));

        //vora esquerra
        let segmentVoraEsquerra = new  Segment(rectangle.posicio,
            new Punt(rectangle.posicio.x , rectangle.posicio.y + rectangle.alcada));


        //vora dreta
        let segmentVoraDreta = new Segment(
            new Punt(rectangle.posicio.x + rectangle.amplada,
                rectangle.posicio.y),
            new Punt(rectangle.posicio.x + rectangle.amplada,
                rectangle.posicio.y+rectangle.alcada));

      
     
        //vora superior
        puntI = segment.puntInterseccio(segmentVoraSuperior);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
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

