class Totxo{
    constructor(puntPosicio,w,h,color){
        this.posicio=puntPosicio;
        this.amplada=w; 
        this.alcada=h;
        this.color=color;

        this.punts=5;
    }    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);
        ctx.restore();

    }
};