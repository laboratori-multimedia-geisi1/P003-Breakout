class Joc{
    constructor(canvas,ctx) {
        this.levels();

        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;


        this.totxoamplada = 55;
        this.totxoalcada = 10;

        this.bola=new Bola(new Punt(this.canvas.width/2,2*this.canvas.height/3),3);
        
        this.pala=new Pala(new Punt((this.canvas.width-60)/2,this.canvas.height-15),60,4);
        this.mur=new Mur(this.levels[0],this.amplada,this.alcada/2,this.totxoamplada,this.totxoalcada);
        this.totxos=this.mur.generate_totxos()

        this.key={
            LEFT:{code:37,pressed:false},
            RIGHT:{code:39,pressed:false},
            SPACE:{code:32 }
        };
       

    }

    draw(){
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);

        this.totxos.forEach(element => {
            element.draw(this.ctx)
        });
    }
    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    inicialitza(){

        this.pala.draw(this.ctx);
        $(document).on("keydown",{joc:this}, function(e){
            switch(e.keyCode){
                case e.data.joc.key.LEFT.code:
                    e.data.joc.key.LEFT.pressed=true;
                    break;
                case e.data.joc.key.RIGHT.code:
                    e.data.joc.key.RIGHT.pressed=true;
                    break;
                case e.data.joc.key.SPACE.code:
                    e.data.joc.bola.enabled=!e.data.joc.bola.enabled;
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
        this.bola.update();
        this.pala.update();

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
                    "rrrrr",
                    "ggggg",
                    "bbbbb",
                    "ooooo",
                    "uuuuu"
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