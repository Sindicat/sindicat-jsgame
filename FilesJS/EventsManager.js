class EventsManager{
    constructor(){
        this.bind =[]//сопоставление клавиш
        this.action=[]; //действия
    }
    setup(){
        this.bind[32]='shoot';//стрелять
        //alert(this.bind[32]);
        this.bind[38]='jump';//прыжок
        this.bind[39]='right';//направо
        this.bind[37]='left';//налево
       // this.bind[40]='down';//вниз
        //alert("В setup():" + this.bind[39]);
        //console.log(this.bindStore.forEach());
        //alert(this.bindStore);
        document.body.addEventListener("keydown",this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    }
    onKeyDown(event){

            let curaction =getEventsManager().bind[event.keyCode];
        if(curaction!==undefined && getLoader().firstTime)
        {
            getLoader().timeStart = performance.now();//время в миллисекундах
            getLoader().firstTime = false;
        }

        if(curaction)
        {
            getEventsManager().action[curaction]=true;//согласились выполнять действие
        }
    }

    onKeyUp(event){
        let curaction =getEventsManager().bind[event.keyCode];
        if(curaction) getEventsManager().action[curaction]=false;
    }
}