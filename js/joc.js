class Joc{
    constructor(canvas,ctx) {
        this.levels();

        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;

        console.log(this.amplada, this.alcada)

        this.totxoamplada = 50;
        this.totxoalcada = 10; // MIDES DEL TOTXO EN PÍXELS
        this.totxocolor = "#0ad";

        this.bola = new Bola(new Punt(this.canvas.width/2,this.canvas.height/2),3);
        this.pala = new Pala(new Punt((this.canvas.width-60)/2,this.canvas.height-15),60,4);
        this.mur = new Mur(this.levels[1], this.amplada, this.alcada, this.totxoamplada ,this.totxoalcada);
        this.totxos=this.mur.generate_totxos()
        console.log(this.totxos)

        this.key = {
            LEFT:{code:37, pressed:false},
            RIGHT:{code:39, pressed:false}
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
            if(e.keyCode == e.data.joc.key.LEFT.code){
                e.data.joc.key.LEFT.pressed = true;
            }
            else if(e.keyCode == e.data.joc.key.RIGHT.code){
                e.data.joc.key.RIGHT.pressed = true;
            }
        });
        $(document).on("keyup", {joc:this}, function(e){
            if(e.keyCode == e.data.joc.key.RIGHT.code){
                e.data.joc.key.RIGHT.pressed = false;
            }
            else if(e.keyCode == e.data.joc.key.LEFT.code){
                e.data.joc.key.LEFT.pressed = false;
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
                    "aaaaa",
                    "aaaaa",
                    "aaaaa",
                    "aaaaa",
                    "aaaaa"
                ],
            },
            {
                color:"#0f0",
                pos:[
                    "  a  ",
                    " a a ",
                    "a a a",
                    "a a a",
                    " a a "
                ],
            },
            {
                color:"#00f",
                pos:[
                    " a a ",
                    "a   a",
                    " a a ",
                    "a a a",
                    "aaaaa"
                ],
            },
            {
                color:"#ff0",
                pos:[
                    "a   a",
                    " a a ",
                    "  a  ",
                    " a a ",
                    "a   a"
                ],
            }
        ]
    }
}