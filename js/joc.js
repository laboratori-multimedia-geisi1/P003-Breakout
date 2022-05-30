class Joc{
    constructor(canvas,ctx) {
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


        this.rows=5;
        this.cols=5;
        this.totxos=[];

        for(let y=0; y<this.rows; y++){
            this.totxos[y]=[];
            let y_cord=(2.5*this.canvas.height/4-this.rows*this.totxoalcada)/(this.rows+1)*(y+1)+this.totxoalcada*y;
            for(let x=0; x<this.cols; x++){
                let x_cord=(this.canvas.width-this.cols*this.totxoamplada)/(this.cols+1)*(x+1)+this.totxoamplada*x;

                this.totxos[y][x]=new Totxo(
                    new Punt(
                        x_cord,
                        y_cord
                    ), 
                    this.totxoamplada, this.totxoalcada, "#00f"
                );
            }
        }
       

        this.key = {
            LEFT:{code:37, pressed:false},
            RIGHT:{code:39, pressed:false}
        };
       

      
    }

    draw(){
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);

        for(let y=0; y<this.rows; y++){
            for(let x=0; x<this.cols; x++){
                this.totxos[y][x].draw(this.ctx)
            }
        }
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
        for(let y=0; y<this.rows; y++){
            for(let x=0; x<this.cols; x++){
                this.totxos[y][x].draw(this.ctx)
            }
        }
        this.draw();
    }
}