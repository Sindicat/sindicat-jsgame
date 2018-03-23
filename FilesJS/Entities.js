class Entity {
    get myspeed() {
        return this._myspeed;
    }

    set myspeed(value) {
        this._myspeed = value;
    }
    get myname() {
        return this._myname;
    }

    set myname(value) {
        this._myname = value;
    }
    get size_y() {
        return this._size_y;
    }
    get size_x() {
        return this._size_x;
    }
    get pos_x() {
        return this._pos_x;
    }

    set pos_x(value) {
        this._pos_x = value;
    }
    get pos_y() {
        return this._pos_y;
    }

    set pos_y(value) {
        this._pos_y = value;
    }
    set size_x(value) {
        this._size_x = value;
    }
    set size_y(value) {
        this._size_y = value;
    }
    constructor(){
        this._pos_x=0;
        this._pos_y=0;
        this._size_x=0;
        this._size_y=0;
        this._myname=null;
        this._myspeed = null;
    }

}

class Player extends Entity{
    get bullets() {
        return this._bullets;
    }

    set bullets(value) {
        this._bullets = value;
    }
    get lastMove() {
        return this._lastMove;
    }

    set lastMove(value) {
        this._lastMove = value;
    }
    get pos_dy() {
        return this._pos_dy;
    }

    set pos_dy(value) {
        this._pos_dy = value;
    }

    get lifetime() {
        return this._lifetime;
    }

    set lifetime(value) {
        this._lifetime = value;
    }
    get move_y() {
        return this._move_y;
    }

    set move_y(value) {
        this._move_y = value;
    }
    get move_x() {
        return this._move_x;
    }

    set move_x(value) {
        this._move_x = value;
    }
    constructor(){
        super();
        this._lifetime=100;
        this._bullets=14;
        this._move_x=0;
        this._move_y=0;
        this._lastMove=1;
        this._myspeed=2;
        this.myname = "player";
        this._pos_dy=10;
        this.isShooted=false;
    }
    draw(ctx){//рисуем объект
        if(this.move_x===1)
        {
            getSpriteManager().drawSprite(ctx,"dino_right2.png", this.pos_x, this.pos_y)//рисуем динозавра
            let sprite = getSpriteManager().getSprite("dino_right2.png");
            this.size_x=sprite.w; //задаем размеры спрайта
            this.size_y=sprite.h;//задаем размеры спрайта
        }
        if(this.move_x===-1)
        {
            getSpriteManager().drawSprite(ctx,"dino_left2.png", this.pos_x, this.pos_y)//рисуем динозавра
            let sprite = getSpriteManager().getSprite("dino_left2.png");
            this.size_x=sprite.w; //задаем размеры спрайта
            this.size_y=sprite.h;//задаем размеры спрайта
        }
        if(this.move_x===0)
        {
            if(this.lastMove===1)
            {
                getSpriteManager().drawSprite(ctx,"dino_right2.png", this.pos_x, this.pos_y)//рисуем динозавра
                let sprite = getSpriteManager().getSprite("dino_left2.png");
                this.size_x=sprite.w; //задаем размеры спрайта
                this.size_y=sprite.h;//задаем размеры спрайта
            }
            else if(this.lastMove===-1)
            {
                getSpriteManager().drawSprite(ctx,"dino_left2.png", this.pos_x, this.pos_y)//рисуем динозавра
                let sprite = getSpriteManager().getSprite("dino_left2.png");
                this.size_x=sprite.w; //задаем размеры спрайта
                this.size_y=sprite.h;//задаем размеры спрайта
            }
        }
    }
    update(){
        if(this.pos_x <= 0)
        {
           this.pos_x=0;
        }
        if(this.pos_x+this.size_x>= getMapManager().mapSize.x)
        {
            this.pos_x=getMapManager().mapSize.x-this.size_x;
        }
        getPhysicsManager().update(this); //тип в книге так было
    }
    onTouchEntity(obj){ //Обработка встречи спрепятствием
        //console.log(obj.myname);
            if(obj.myname.match(/needle[\d*]/))// || obj.myname.match(/cactus[\d*]/))
            {
                this.kill();//игрок погибает
            }
        if(obj.myname.match(/cactus[\d*]/))
        {
            this.kill();//игрок погибает
        }
        if(obj.myname.match(/bonus[\d*]/))
        {
            getSoundManager().play("sounds/pickup_cut.mp3", {looping:false, volume:1});
            this.bullets +=5;
            obj.kill();
        }
    }
    onTouchMap(tsAhead, tsUnder){
        if(tsAhead===51 || tsUnder===51 || tsUnder===undefined) //каснулись лавы
        {
            this.kill()
            return null; //игрок умер
        }
        if(tsAhead===4 || tsAhead===28) return "land";

        if(tsUnder===28 && getGameManager().player.pos_x>getMapManager().mapSize.x-192)
        {
            getGameManager().state=2;//уровень пройден

        }

        return "background";

    }
    kill(){//унитожение объекта
        getGameManager().laterKill.push(this);
        getGameManager().state=0; //игрок убит
    }

    shoot()
    {
        if(!this.isShooted && this.bullets!==0)
        {
            let bullet = new Bullet();
            this.bullets-=1;
            let explode = new Explode();
            if(this.lastMove===1) //стреляем вправо
            {
                bullet.move_x=1;
                bullet.pos_x=this.pos_x+bullet.size_x+this.size_x-35;
                bullet.pos_y=this.pos_y + this.size_y/2+35;
                explode.pos_x=bullet.pos_x;
                explode.pos_y=bullet.pos_y;
            }
            if(this.lastMove===-1)//стреляем влево
            {
                bullet.move_x=-1;
                bullet.pos_x=this.pos_x-bullet.size_x+20;
                bullet.pos_y=this.pos_y + this.size_y/2+35;
                explode.pos_x=bullet.pos_x;
                explode.pos_y=bullet.pos_y;
            }
            getGameManager().addEntity(bullet);
            getGameManager().addEntity(explode);
            this.isShooted=true;
            getSoundManager().play("sounds/shoot_cut.mp3",{looping:false, volume:1});
            setTimeout(()=>this.isShooted=false,200);
        }
    }
}

class Cactus extends Entity{
    get timeoutShoot() {
        return this._timeoutShoot;
    }

    set timeoutShoot(value) {
        this._timeoutShoot = value;
    }
    get walkAround() {
        return this._walkAround;
    }

    set walkAround(value) {
        this._walkAround = value;
    }
    get pos_norm() {
        return this._pos_norm;
    }

    set pos_norm(value) {
        this._pos_norm = value;
    }
    get pos_dy() {
        return this._pos_dy;
    }

    set pos_dy(value) {
        this._pos_dy = value;
    }
    constructor()
    {
        super();
        this.lifetime=100; //жизнь кактуса
        this.myspeed=0; //скорость движения кактуса
        this._pos_dy=10; //это наальное ускорение кактуса при его падении(он у меня умеет падать), но это не используется
        this.myname=null; //Должно быть уникальным
        this.iSshooted = false; //стрелял ли кактус(чтобы он не стрелял одну за одной пулей)
        this.shootToSide=0; //в какую сторону стрелять 0 -не стрелять, 1 - стрелять вправо, -1 - стрелять влево
        this._walkAround=0; //на сколько далеко в px кактус может уходить, гуляя. Отсет от позиции pos_norm (ниже объявлена)
        this.view=0; //на каком расстоянии кактус может обнаружить игрока в px
        this._lastMove=1; //в какую сторону двигался кактус на последней итерации
        this._pos_norm=0; //центр, вокруг которого гуляет кактус, смещаясь по радиусу walkAround
    }
    draw(ctx)
    {
        if(this.move_x===1 || this.shootToSide===1)
        {
            getSpriteManager().drawSprite(ctx,"cactus_right2.png", this.pos_x, this.pos_y)//рисуем кактус
            let sprite = getSpriteManager().getSprite("cactus_right2.png");
            this.size_x=sprite.w; //задаем размеры спрайта
            this.size_y=sprite.h;//задаем размеры спрайта
        }
        if(this.move_x===-1 || this.shootToSide===-1) //С РАВЕНСТВОМ НУЛЮ НУЖНО ПОРЕШАТЬ С РАВЕНСТВОМ НУЛЮ НУЖНО ПОРЕШАТЬ С РАВЕНСТВОМ НУЛЮ НУЖНО ПОРЕШАТЬ С РАВЕНСТВОМ НУЛЮ НУЖНО ПОРЕШАТЬ
        {
            getSpriteManager().drawSprite(ctx,"cactus_left2.png", this.pos_x, this.pos_y)//рисуем кактус
            let sprite = getSpriteManager().getSprite("cactus_left2.png");
            this.size_x=sprite.w; //задаем размеры спрайта
            this.size_y=sprite.h;//задаем размеры спрайта
        }
    }
    update()
    {
        if(getGameManager().player.pos_x < this.pos_x - this.view || getGameManager().player.pos_x > this.pos_x + this.view)
        {
            if(this.pos_x>=this.pos_norm + this.walkAround)
            {
                this.move_x= -1;
                this.shootToSide=-1
            } //кактус просто гуляет по локации
            if(this.pos_x<=this.pos_norm - this.walkAround)
            {
                this.move_x = 1;
                this.shootToSide=1
            }
        }

        if(getGameManager().player.pos_x > this.pos_x - this.view && getGameManager().player.pos_x < this.pos_x )
        {
            this.shootToSide=-1; //стреляет влево
            this.shoot();
            if(this.pos_x>=this.pos_norm - this.walkAround)
            {
                this.move_x=-1; //идет на игрока
            }
            else
            {
                this.move_x=0;
            }

        }
        if(getGameManager().player.pos_x < this.pos_x + this.view && getGameManager().player.pos_x > this.pos_x )
        {
            this.shootToSide=1;
            this.shoot();
            if(this.pos_x<=this.pos_norm + this.walkAround)
            {
                this.move_x=1; //идет на игрока
            }
            else
            {
                this.move_x=0;
            }
        }
        getPhysicsManager().update(this);
    }
    onTouchEntity(obj)
    {
        if(obj.myname.match(/bullet[\d*]/))
        {
            this.kill();
        }
    }

    onTouchMap(tsAhead, tsUnder) {
        if(tsAhead===51 || tsUnder===51 || tsUnder===undefined) //каснулись лавы
        {
            this.kill()
            return null; //кактус умер
        }
        if(tsAhead===4 || tsAhead===28) return "land";
        return "background";
    }
    kill(){
        getSoundManager().play("sounds/cactus_die_cut.mp3", {looping:false, volume:1});
        getGameManager().laterKill.push(this)
    }
    shoot(){
        if(!this.iSshooted)
        {
            let needle = new Needle();
           getSoundManager().play("sounds/throw_needle_cut.mp3", {looping:false, volume:1});
            if(this.shootToSide===1) //стреляем вправо
            {
                needle.move_x=1;
                needle.pos_x=this.pos_x+needle.size_x+this.size_x-15;
                needle.pos_y=this.pos_y+40;// + this.size_y/2;
                this.iSshooted=true;
            }
            if(this.shootToSide===-1)
            {
                needle.move_x=-1;
                needle.pos_x=this.pos_x+needle.size_x-25;
                needle.pos_y=this.pos_y+40;// + this.size_y/2;
                this.iSshooted=true;
            }
            getGameManager().addEntity(needle);
            setTimeout(()=>this.iSshooted=false, 1700)
        }
    }

}

class Bullet extends Entity{
    get damage() {
        return this._damage;
    }

    set damage(value) {
        this._damage = value;
    }
    get move_y() {
        return this._move_y;
    }

    set move_y(value) {
        this._move_y = value;
    }
    get move_x() {
        return this._move_x;
    }

    set move_x(value) {
        this._move_x = value;
    }
    constructor(){
        super();
        this._damage=50;
        this.move_x=0;
        this.move_y=0;
        this.myspeed=40;
        this.myname="bullet"+getLoader().getNextBulletNum();
        let sprite = getSpriteManager().getSprite("bullet_right.png");
        this.size_x=sprite.w; //задаем размеры спрайта
        this.size_y=sprite.h;//задаем размеры спрайта
    }
    draw(ctx){
        if(this.move_x===1)
        {
            getSpriteManager().drawSprite(ctx,"bullet_right.png", this.pos_x, this.pos_y)//рисуем пулю
        }
        if(this.move_x===-1)
        {
            getSpriteManager().drawSprite(ctx,"bullet_left.png", this.pos_x, this.pos_y)//рисуем пулю
        }
    }
    update()
    {
        getPhysicsManager().update(this); //обновляем координаты пули
    }
    onTouchEntity(obj){
        if(obj.myname.match(/cactus[\d*]/)) //Кактус исчезает
        {
            obj.lifetime-=this.damage;
            if(obj.lifetime <= 0)
            {
                obj.kill();
                let bonus = new Bonus();
                bonus.pos_x = obj.pos_x+obj.size_x/2;
                bonus.pos_y = obj.pos_y + 100;
                getGameManager().addEntity(bonus);
            }
            this.kill(); //
        }
    }
    onTouchMap(tsAhead,tsUnder){
            if ((tsAhead !== 48 && tsAhead!==undefined) || this.pos_x > getMapManager().mapSize.x || this.pos_x < 0) {
                this.kill(); //yнитожить пулю при попадании в препятствие
                return null;
            }
        return "background";
        }
    kill(){
        getGameManager().laterKill.push(this)
    }
}

class Bonus extends Entity{
    constructor(){
        super();
        this.pos_x=0;
        this.pos_y=0;
        this.myname = "bonus" + getLoader().getNextBonusNum();
        let sprite = getSpriteManager().getSprite("bullets.png");
        this.size_x=sprite.w; //задаем размеры спрайта
        this.size_y=sprite.h;//задаем размеры спрайта
    }
    draw(ctx){
        getSpriteManager().drawSprite(ctx,"bullets.png", this.pos_x, this.pos_y)//рисуем пули
    }

    update(){
        getPhysicsManager().update(this);
    }

    onTouchEntity(obj){
    }
    kill(){

        getGameManager().laterKill.push(this);
    };
}

class Needle extends Entity{
    get damage() {
        return this._damage;
    }

    set damage(value) {
        this._damage = value;
    }
    constructor() {
        super();
        this.move_x = 1;
        this._damage=50;
        this.move_y = 0;
        this.myspeed = 35;
        this.myname = "needle" + getLoader().getNextNeedleNum();
        let sprite = getSpriteManager().getSprite("needle_left.png");
        this.size_x = sprite.w; //задаем размеры спрайта
        this.size_y = sprite.h;//задаем размеры спрайта
    }
    draw(ctx){
        if(this.move_x===1)
        {
            getSpriteManager().drawSprite(ctx,"needle_right.png", this.pos_x, this.pos_y)//рисуем иголку

        }
        if(this.move_x===-1)
        {
            getSpriteManager().drawSprite(ctx,"needle_left.png", this.pos_x, this.pos_y)//рисуем иголку
        }
    }
    update()
    {
        getPhysicsManager().update(this); //обновляем координаты иголки
    }
    onTouchEntity(obj){
        if(obj.myname.match(/player/)) //Игрок убит
        {
            obj.lifetime-=this.damage;
            getSoundManager().play("sounds/moan_cut.mp3", {looping:false, volume:1});
            if(obj.lifetime <= 0)
            {
                obj.kill();
            }
            this.kill(); //Иголка исчесзает
        }
    }
    onTouchMap(tsAhead,tsUnder){
            if((tsAhead !== 48 && tsAhead!==undefined) || this.pos_x>getMapManager().mapSize.x || this.pos_x<0)
            {
                this.kill(); //нитожить иглу при попадании в препятствие
               // console.log("Игла уничтожена")
                return null;
            }
        return "background";
    }

    kill(){
        getGameManager().laterKill.push(this)
    }
}

class Explode extends Entity{
    constructor(){
        super();
        this.myname = "explode" + getLoader().getNextExplodeNum();
        let sprite = getSpriteManager().getSprite("flare_right.png");
        this.size_x = sprite.w; //задаем размеры спрайта
        this.size_y = sprite.h;//задаем размеры спрайта
    }
    draw(ctx){
        if(getGameManager().player.lastMove===1) //вспышка справа
        {
            getSpriteManager().drawSprite(ctx,"flare_right.png", this.pos_x, this.pos_y-10)//рисуем взрыв
           // console.log("Cghfdf dscnhtk")
        }
        if(getGameManager().player.lastMove===-1) //вспышка слева
        {
            getSpriteManager().drawSprite(ctx,"flare_left.png", this.pos_x-20, this.pos_y-10)//рисуем взрыв
        }
        setTimeout(()=>this.kill(),40);
    }
    update()
    {
       // getPhysicsManager().update(this);
    }
    kill(){
        getGameManager().laterKill.push(this);
    }
}

class NumBullets{
    constructor() {
        this.num=0;
    }

    update()
    {
        this.num = getGameManager().player.bullets;
    }

    draw()
    {
        getContext().font="italic 25pt Arial";
        getContext().fillStyle = "#ffffff";
        getContext().fillText("Bullets: "+ this.num.toString(),5,80);
    }
}

class Level{
    constructor(level)
    {
        this.level= level;
    }
    draw()
    {
        getContext().font="italic 25pt Arial";
        getContext().fillStyle = "#ffffff";
        getContext().fillText("Level: "+ this.level.toString(),5,40);
    }
}

class MyTime
{
    constructor()
    {
    }
    draw()
    {
        if(!getLoader().firstTime)
        {
            let now =performance.now();
            let allMS = (now  - getLoader().timeStart).toFixed(0);//все миллисекунды
            let ms = allMS % 1000; //миллисекунды игры
            let allSEC = (allMS-ms)/1000 ;
            let sec = allSEC % 60;//секунды игры
            let min = (allSEC- sec)/60;
            getLoader().gameTime.min=min;
            getLoader().gameTime.sec=sec;
            getLoader().gameTime.ms=ms;
            console.log(getLoader().gameTime.min);
            console.log(getLoader().gameTime.sec);
            console.log(getLoader().gameTime.ms);
            getContext().font="italic 25pt Arial";
            getContext().fillStyle = "#ffffff";
            getLoader().timeResult = "Time: "+min.toString()+":"+sec.toString()+":"+ms.toString();
            getContext().fillText(getLoader().timeResult,5,120);
        }
        else
        {
            getContext().fillText("Time: 00:00:000",5,120);
        }
    }
    update(){}
}

class Lifetime{
    constructor(){}

    draw(){
        getContext().font="italic 25pt Arial";
        getContext().fillStyle = "#ffffff";
        getContext().fillText("Lifetime: "+ getGameManager().player.lifetime.toString(),5,160);
    }

    update(){}
}