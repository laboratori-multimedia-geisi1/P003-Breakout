class Joc{
    constructor(canvas,ctx, username) {
        this.levels();

        this.canvas=canvas; this.ctx=ctx;
        this.vides=4; this.punts=0;
        this.game_over=false; 
        this.prev_go=!(this.game_over);
        this.start=true;

        this.mides();
        this.spawn_elements();
        this.totxos=this.mur.generate_totxos()

        this.key={
            LEFT:{code:37,pressed:false},
            RIGHT:{code:39,pressed:false},
            SPACE:{code:32 },
            R:{code:82 }
        };

        this.username=username;
        this.setupRecords();

        
    }

    inicialitza(){
        $(document).on("keydown",{joc:this}, function(e){
            switch(e.keyCode){
                case e.data.joc.key.LEFT.code:
                    e.data.joc.key.LEFT.pressed=true;
                    break;
                case e.data.joc.key.RIGHT.code:
                    e.data.joc.key.RIGHT.pressed=true;
                    break;
                case e.data.joc.key.SPACE.code:
                    e.data.joc.start_game();
                    // si sesta jugant, fer un "reset"
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

    draw(){
        this.clearCanvas();

        this.pales.forEach(pala => {
            pala.draw(this.ctx);
        });

        this.boles.forEach(bola => {
            if (bola.enabled) {
                bola.draw(this.ctx);
            } 
        });
        this.totxos.forEach(totxo => {
            totxo.draw(this.ctx)
        });
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.amplada, this.alcada)
    }

    update(){
        this.check_game();

        if(this.game_over!==this.prev_go){
            if(this.start){
                Display.showScreen("#start");
            }else{
                Display.hideScreen("#start");
                if(!this.game_over){
                    Display.hideScreen("#game_over");
                }else{
                    Display.showScreen("#game_over");
                    this.updateRecord();
                }
            }
        }


        this.prev_go=this.game_over;
        this.update_elements();
        this.draw();
    }

    levels(){ 
        this.levels=[
            {
                color:null,
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


    // custom functs

    mides() {
        this.amplada=this.canvas.width;
        this.alcada=this.canvas.height;

        this.totxoalcada=10;

        this.pala_alcada=this.alcada*0.025;
        this.pala_amplada=this.pala_alcada*3;

        this.radi_bola=6;
    }


    spawn_elements(){
        this.boles=[
            new Bola(
                new Punt(
                    this.amplada/2,
                    2*this.alcada/3
                ),
                this.radi_bola,
                this
            )
        ];
        this.pales = [
            new Pala(
                new Punt(
                    (this.amplada-this.pala_amplada)/2, 
                    this.alcada-40
                ),
                this.pala_amplada,
                this.pala_alcada
            )
        ];
        this.mur=new Mur(
            this.levels[0],
            this.amplada,
            this.alcada/3,
            this.totxoalcada
        );
    }

    update_elements(){
        this.pales.forEach(pala => {
            pala.update(this.ctx);
        });
        this.boles.forEach(bola => {
            bola.update(this.ctx);
        });

        this.totxos.forEach(totxo => {
            totxo.draw(this.ctx)
        });
    }

    reset_game(){
        // per fer ...
    }

    start_game(){
        this.boles.forEach(bola => {
            bola.enabled=true;
        });
        this.game_over=false; this.start=false
        this.vides=4; Display.updateVides(this.vides);
        this.punts=0; Display.updatePunts(this.punts);
        this.totxos=this.mur.generate_totxos();
    }

    check_game(){
        let g=true;
        this.boles.forEach(bola => {
            if (bola.enabled) g=false;
        });

        if (g!==this.game_over){
            this.game_over=g;
        }
    }

    setupRecords(){
        let records=localStorage.getItem("records");
        this.pr_points=0;
        if(records){
            records=JSON.parse(records);
            let pr=records.map(r=>r.username).indexOf(this.username);
            this.pr_points=(pr>=0) ? records[pr].points : 0;
        }

        $("#personal-best").text(this.pr_points+"pts");
        $("#current-username").text(this.username);
    }

    updateRecord(){
        let records=localStorage.getItem("records"),
            tmp={username:this.username, points:this.punts},
            u=0;

        if(records){
            records=JSON.parse(records);
            let pr=records.map(r=>r.username).indexOf(this.username);

            if(pr>=0) records[pr].points=Math.max(records[pr].points, this.punts);
            else records.push(tmp);
            
            u=(pr<0)?records.length-1:pr;
        } else {
            records=[tmp];
        }
        this.pr_points=records[u].points;
        localStorage.setItem("records", JSON.stringify(records));
        $("#personal-best").text(this.pr_points+"pts");

        console.log("records set", records);
    }
}