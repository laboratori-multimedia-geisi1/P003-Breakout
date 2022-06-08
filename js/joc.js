class Joc{
    constructor(canvas,ctx) {
        this.levels();

        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;

        this.totxoalcada = 10;

        this.pala_alcada=this.alcada*0.025;
        this.pala_amplada=this.pala_alcada*3;

        // this.bola=new Bola(new Punt(this.amplada/2,2*this.alcada/3),3);
        this.boles=[new Bola(new Punt(this.amplada/2,2*this.alcada/3),3)];

        this.pales = [new Pala(new Punt((this.amplada-this.pala_amplada)/2,this.alcada-40),this.pala_amplada,this.pala_alcada)];
        
        this.mur=new Mur(this.levels[0],this.amplada,this.alcada/2,this.totxoalcada);
        this.totxos=this.mur.generate_totxos()

        this.key={
            LEFT:{code:37,pressed:false},
            RIGHT:{code:39,pressed:false},
            SPACE:{code:32 },
            R:{code:82 }
        };
    }

    draw(){
        this.clearCanvas();
        this.pales.forEach(pala => {
            pala.draw(this.ctx);
        });
        this.boles.forEach(bola => {
            bola.draw(this.ctx);
        });
        this.totxos.forEach(totxo => {
            totxo.draw(this.ctx)
        });
    }
    clearCanvas(){
        this.ctx.clearRect(0,0,this.amplada, this.alcada)
    }

    inicialitza(){
        this.pales.forEach(pala => {
           pala.draw(this.ctx)
        });
        $(document).on("keydown",{joc:this}, function(e){
            switch(e.keyCode){
                case e.data.joc.key.LEFT.code:
                    e.data.joc.key.LEFT.pressed=true;
                    break;
                case e.data.joc.key.RIGHT.code:
                    e.data.joc.key.RIGHT.pressed=true;
                    break;
                case e.data.joc.key.SPACE.code:
                    e.data.joc.boles.forEach(bola => {
                        bola.enabled=true;
                    });
                    break;
            }
        });

        $(document).on("keyup", {joc:this}, function(e){
            switch(e.keyCode){
                case e.data.joc.key.LEFT.code:
                    e.data.joc.key.LEFT.pressed=false;
                    break;
                case e.data.joc.key.RIGHT.code:
                    e.data.joc.key.RIGHT.pressed=false;
                    break;
                
            }
        });
        requestAnimationFrame(animacio);
    }

    update(){
        this.pales.forEach(pala => {
            pala.update(this.ctx);
        });
        this.boles.forEach(bola => {
            bola.update(this.ctx);
        });

        this.totxos.forEach(element => {
            element.draw(this.ctx)
        });

        this.draw();
    }

    levels(){        
        this.levels=[
            {
                color:"#f00",
                pos:[
                    "rrrrrrrrr",
                    "rrrrrrrrr",
                    "ooooooooo",
                    "ooooooooo",
                    "ggggggggg",
                    "ggggggggg",
                    "yyyyyyyyy",
                    "yyyyyyyyy"
                ],
            },
            {
                color:"#0f0",
                pos:[
                    "  k  ",
                    " u u ",
                    "u u u",
                    "b b b",
                    " b b "
                ],
            },
            {
                color:"#00f",
                pos:[
                    " ggg ",
                    "gu ug",
                    " ggg ",
                    "yoyoy",
                    "rrrrr"
                ],
            },
            {
                color:"#ff0", 
                pos:[
                    "y   y",
                    " o o ",
                    "  r  ",
                    " o o ",
                    "y   y"
                ],
            }
        ]
    }
}