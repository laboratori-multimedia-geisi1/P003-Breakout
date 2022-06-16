class Joc{
    constructor(canvas,ctx) {
        this.levels();      

        this.canvas=canvas; this.ctx=ctx;
        this.vides=4; this.punts=0;
        this.game_over=false; 
        this.prev_go=!(this.game_over);
        this.start=true;
        this.restart=false;        

        this.key={
            LEFT:{code:37,pressed:false},
            RIGHT:{code:39,pressed:false},
            SPACE:{code:32 },
            R:{code:82 }
        };

        this.username=$("#user").val();
        this.starting_level=parseInt($("input[name=nivell]:checked").val());
        this.level=this.starting_level;
        console.log("starting level: ",this.level)

        this.mides();
        this.spawn_elements();

        this.setupRecords();

        Display.updatePunts(this.punts)
        Display.updateVides(this.vides)
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
                    if(e.data.joc.start) e.data.joc.start_game();
                    else e.data.joc.restart_game();
                    
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

        this.pala.draw(this.ctx);

        if(this.bola.enabled) {
            this.bola.draw(this.ctx);
        }
        this.totxos.forEach(totxo => {
            totxo.draw(this.ctx)
        });
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.amplada, this.alcada)
    }

    update(){
        if(this.game_over!==this.prev_go){
            if(this.start){
                Display.showScreen("#start");
                Display.hideScreen("#game_over");
            }else{
                Display.hideScreen("#start");
            }

            if(this.start || this.game_over){
                this.bola.enabled=false;
            }
        }


        this.prev_go=this.game_over;
        this.update_elements();
        this.draw();
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
        this.bola=new Bola(
            new Punt(
                this.amplada/2,
                2*this.alcada/3
            ),
            this.radi_bola,
            this
        );
        this.pala=new Pala(
            new Punt(
                (this.amplada-this.pala_amplada)/2, 
                this.alcada-40
            ),
            this.pala_amplada,
            this.pala_alcada
        );
        this.mur=new Mur(
            this.amplada,
            this.alcada/3,
            this.totxoalcada
        );
        this.totxos=this.mur.generate_totxos(this.lvls[this.level%this.lvls.length]);
    }

    update_elements(){
        this.pala.update(this.ctx);
        this.bola.update(this.ctx);
    }

    restart_game(){
        this.restart=true;
        this.level=this.starting_level;
        Display.updateLevel(1);

        console.log("restarted")
        this.game_over=!this.prev_go;
        this.start=true;
        

        this.vides=4; 
        Display.updateVides(this.vides);

        this.punts=0;
        Display.updatePunts(this.punts);

        this.totxos=this.mur.generate_totxos(this.lvls[this.level%this.lvls.length]);
    }

    start_game(){
        this.bola.enabled=true;

        this.game_over=false; 
        this.start=false;
        this.restart=false;

        Display.hideScreen("#start");
    }

    gameOver(){
        Display.showScreen("#game_over");
        this.updateRecord();
        this.restart_game();
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

    nextLevel(){
        this.spawn_elements();

        this.restart=true;
        this.start=true;
        
        this.level+=1;
        Display.updateLevel(this.level+1-this.starting_level);
        this.totxos=this.mur.generate_totxos(this.lvls[this.level%this.lvls.length]);
    }



    levels(){ 
        this.lvls=[
            {
                color:null, // a cada lletra li assignem un color different.
                pos:[
                    "rrr",
                    "ggg",
                    "bbb"
                ],
            },
            {
                color:null,
                pos:[
                    "uuuu",
                    "ukku",
                    "ukku",
                    "uuuu"
                ],
            },
            {
                color:null,
                pos:[
                    " ggg ",
                    "gu ug",
                    " ggg ",
                    "yoyoy",
                    "rrrrr"
                ],
            },
            {
                color:null, 
                pos:[
                    "rrrrrrr",
                    "ry   yr",
                    "r o o r",
                    "r  r  r",
                    "r o o r",
                    "ry   yr",
                    "rrrrrrr"
                ],
            },
            {
                color:null, 
                pos:[
                    "rrrrrrr",
                    "       ",
                    "ooooooo",
                    "       ",
                    "yyyyyyy",
                    "       ",
                    "gggggggg"
                ],
            },
            {
                color:null,
                pos:[
                    "rrrrrr",
                    "rrrrrr",
                    "oooooo",
                    "oooooo",
                    "gggggg",
                    "gggggg",
                    "yyyyyy",
                    "yyyyyy"
                ],
            }
        ]
    }

}