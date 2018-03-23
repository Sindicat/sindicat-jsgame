//51 лава
//48 фон фиолетовый
//4 земля
//28 белые кубики

class PhysicManager{
    constructor(){
        this.heightJump=0;
    }
    update(obj){ //обновление состояния объекта
        if(obj.myname.match(/cactus[\d*]/)) //для кактуса падение
        {
           // console.log("Cactus X:"+obj.pos_x);
           // console.log("Cactus Y:"+obj.pos_y);
            let tsUnder = getMapManager().getTilesetIdx(obj.pos_x+obj.size_x/2,obj.pos_y+obj.size_y);//Проверяем, есть ли под игроком земля
            //console.log(tsUnder);
            if((tsUnder!==4 && tsUnder!==28) && this.heightJump===0)//земли нет, падаем
            {
                var newY = obj.pos_y+ obj.pos_dy; //если не достигли под собой блока, то падаем
                obj.pos_dy+=1; //падаем с ускорением
                obj.pos_y=newY;
            }
            if(tsUnder===4 || tsUnder===28)
            {
                obj.pos_dy=10;//Восстанавливаем ускорение
            }

            if(obj.move_x!==0)
            {
                var newX = obj.pos_x+ Math.floor(obj.move_x*obj.myspeed);
                obj.pos_x=newX;
            }
        }

        if(obj.myname.match(/player/) ) //для игрока падение
        {
        var tsUnder = getMapManager().getTilesetIdx(obj.pos_x+obj.size_x/2,obj.pos_y+obj.size_y);//Проверяем, есть ли под игроком земля (ПРОВЕРЯТЬ В ЗАВИСИМОСТИ ОТ НАПРАВЛЕНИЯ ДВИЖЕНИЯ
           // console.log("tsUnder: "+tsUnder);
        if((tsUnder!==4 && tsUnder!==28) && this.heightJump===0)//земли нет, падаем
        {
            var newY = obj.pos_y+ obj.pos_dy; //если не достигли под собой блока, то падаем
            if(obj.pos_dy < 80)
            {
                obj.pos_dy+=1; //падаем с ускорением
            }
            obj.pos_y=newY;
        }
        if(tsUnder===4 || tsUnder===28)
        {
            obj.pos_dy=15;//Восстанавливаем ускорение
        }

        if(obj.move_y===-1 && (tsUnder===4 || tsUnder===28)) //если прыжок и мы находимся на земле
        {
            this.heightJump = obj.pos_y - 200; //фиксируем высоту прыжка
            obj.pos_dy=40;
            //console.log("dy: "+obj.pos_dy);
        }
        if(this.heightJump!=0)
        {
            if(obj.pos_y>this.heightJump)
            {
                let newY= obj.pos_y-obj.pos_dy;
                //console.log("dy: "+obj.pos_dy);
                obj.pos_dy= obj.pos_dy - 0.05;
                obj.pos_y=newY;
            }
            else
            {
                this.heightJump=0;
                obj.pos_dy=10;
            }

        }
        } //Конец спец части для игрока

        if(obj.myname.match(/bullet[\d*]/) || obj.myname.match(/player/)|| obj.myname.match(/needle[\d*]/)) //Если это пуля или игрок
        {
            var tsAhead;
                if(obj.lastMove===1 || obj.move_x===1) //lastMove - для игрока move_x для пули и иголки
                {
                   tsAhead = getMapManager().getTilesetIdx(obj.pos_x+obj.size_x-15,obj.pos_y+obj.size_y*3/4);
                }
                else if(obj.lastMove===-1 || obj.move_x===-1)
                {
                    tsAhead = getMapManager().getTilesetIdx(obj.pos_x+15,obj.pos_y+obj.size_y*3/4);
                }
            if(obj.onTouchMap && tsAhead!==null){
                let touch = obj.onTouchMap(tsAhead, tsUnder);
                if(touch===null) return; //если убили
                if(touch==="background") //если каснулись фона и движемся
                {
                    if(obj.move_x!==0)
                    {
                        var newX = obj.pos_x+ Math.floor(obj.move_x*obj.myspeed);
                        obj.pos_x=newX;
                    }
                }
            }
          //  console.log("Pos X:"+obj.pos_x + " Y:"+obj.pos_y);
        }
        let e = this.entityAtXY(obj,obj.pos_x,obj.pos_y); //объект на пути
        if(e !== null && obj.onTouchEntity)//Если есть конфликт ТУТ КАКАЯ_ТО ЕРУНДА С TOUCHENTITY ТУТ КАКАЯ_ТО ЕРУНДА С TOUCHENTITY ТУТ КАКАЯ_ТО ЕРУНДА С TOUCHENTITY ТУТ КАКАЯ_ТО ЕРУНДА С TOUCHENTITY
        {
            obj.onTouchEntity(e);//разбор конфликта
        }
        if(obj.myname.match(/bonus[\d*]/))
            {
                if(getGameManager().player.lastMove===1)
                {
                    if(obj.pos_x-30<=getGameManager().player.pos_x+80 && getGameManager().player.pos_x<=obj.pos_x+30 && obj.pos_y-getGameManager().player.pos_y<=getGameManager().player.size_y-obj.size_y+20 )
                    {
                        getGameManager().player.onTouchEntity(obj);
                    }

                }
                if(getGameManager().player.lastMove===-1)
                {
                    if(obj.pos_x-30<=getGameManager().player.pos_x+30 && getGameManager().player.pos_x<=obj.pos_x && obj.pos_y-getGameManager().player.pos_y<=getGameManager().player.size_y-obj.size_y+20)
                    {
                        getGameManager().player.onTouchEntity(obj);
                    }
                }
        }
    }

    entityAtXY(obj,x,y){ //поиск объект по координатам, определение столкновения x и y - это новые координаты
        for (let i=0; i<getGameManager().entities.length; ++i)
        {
            let e = getGameManager().entities[i]; //объекты карты
            if(e.myname!==obj.myname)//имена должны быть уникальны
            {
                if(x+obj.size_x < e.pos_x || y+obj.size_y < e.pos_y || x>e.pos_x+e.size_x || y>e.pos_y + e.size_y)
                {
                    continue;
                }
               //console.log(`${x}+${obj.size_x} < ${e.pos_x} || ${y+obj.size_y} < ${e.pos_y} || ${x>e.pos_x+e.size_x} || ${y}>${e.pos_y} + ${e.size_y}`);
                return e; //найден объект
            }
        }
        return null; //объект не найден
    }
}
