class GameManager{
    get maxLevel() {
        return this._maxLevel;
    }

    set maxLevel(value) {
        this._maxLevel = value;
    }
    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }
    constructor(){
        this.factory =  {}; //хранилище объектов эталонных
        this.entities = []; //не убитые объекты, которые может увидеть игрок
        this.player=null; //указатель на игрока
        this.laterKill =[]; //объекты отложенного удаления
        this._state=1; // 1 - игра продолжается, 0 - игрок умер, 2 - перейти на следующий уровень, 3 - игра пройдена
        this._maxLevel=2; //для определения завершения игры

    }

    kill(obj){
        this.laterKill.push(obj);
    }

    addEntity(obj)
    {
        this.entities.push(obj);
    }
    update(ctx){
        if(this.player===null) return;
        this.player.move_x=0;
        this.player.move_y=0;
        if(getEventsManager().action['right'])
        {
            this.player.lastMove=1;
            this.player.move_x = 1;
        }
        if(getEventsManager().action['left'])
        {
            this.player.lastMove=-1;
            this.player.move_x = -1;
        }
        if(getEventsManager().action['jump']) this.player.move_y = -1;
        if(getEventsManager().action['shoot']) this.player.shoot();

        this.entities.forEach((e)=>{
            try{
                e.update()
            }catch(ex){}
        });

        for(let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if(idx > -1)
                this.entities.splice(idx, 1);
        }

        if(this.laterKill.length > 0) {
            this.laterKill.length = 0;
        }
        //this.clear(getContext());

        getMapManager().draw(ctx); //рисуем карту
        this.draw(ctx);
        getMapManager().centerAt(this.player.pos_x, this.player.pos_y);
    }
    draw(ctx){ //отображение игрового поля игроку
        for(let i=0; i<this.entities.length; ++i)
        {
            this.entities[i].draw(ctx);
           // console.log("LENGTH:"+this.entities.length);
        }
    }
    clear(ctx){
        ctx.clearRect(0,0,1000,800);
    }

    saveRecord(level){ //сама проверяет был ли рекорд установлен
        //if (storageAvailable('localStorage')) { return false; }
       // alert("Прошли менеджер2");
        let min =  localStorage.getItem('min_level_'+level.toString());
        let sec =  localStorage.getItem('sec_level_'+level.toString());
        let ms =   localStorage.getItem('ms_level_'+level.toString());
        console.log(min);
        console.log(sec);
        console.log(ms);
        if(min!==null || sec!==null || ms!==null)
        {
            let currentMin = getLoader().gameTime.min; //получчаем врямя, за которое был пройден уровень
            let currentSec = getLoader().gameTime.sec;
            let currentMs = getLoader().gameTime.ms;

            if(currentMin<=parseInt(min))
            {
                if(currentSec<=parseInt(sec))
                {
                    if(currentMs<parseInt(ms))
                    {
                        localStorage.setItem("min_level_"+level.toString(),currentMin);
                        localStorage.setItem("sec_level_"+level.toString(),currentSec);
                        localStorage.setItem("ms_level_"+level.toString(),currentMs);
                    }
                }
            }
        }
        else if(min===null || sec===null || ms===null)
        {
            let currentMin = getLoader().gameTime.min; //получчаем врямя, за которое был пройден уровень
            let currentSec = getLoader().gameTime.sec;
            let currentMs = getLoader().gameTime.ms;
            localStorage.setItem("min_level_"+level.toString(),currentMin);
            localStorage.setItem("sec_level_"+level.toString(),currentSec);
            localStorage.setItem("ms_level_"+level.toString(),currentMs);
        }
        return true;
    }

showRecordsTable(){
    document.getElementById('info').innerHTML="";
    for( let i=1; i<3; ++i) {
        let min = localStorage.getItem('min_level_' + i.toString());
        let sec = localStorage.getItem('sec_level_' + i.toString());
        let ms = localStorage.getItem('ms_level_' + i.toString());
        console.log(min);
        console.log(sec);
        console.log(ms);
        if(min!==null && sec!==null && ms!==null)
        {
            document.getElementById('info').innerHTML +="<div>" + "Level " + i.toString() + " record: " + min.toString() + "min " + sec.toString() + "sec " + ms.toString() + "ms" + "</div>";
        }

        //console.log("Level " + i.toString() + " record: " + min.toString() + "min " + sec.toString() + "sec " + ms.toString() + "ms");
    }
    document.getElementById('record').style.display='block';
}
}

