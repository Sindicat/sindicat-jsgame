class MapManager {
    constructor() {
        this.mapData = null; // Хранение карты
        this.tLayer = null; //Хранение ссылки на блоки (необходимо будет разместить весь JSON с типом tilelayer
        this.xCount = 0; // кол-во блоков по горизонтали
        this.yCount = 0; //кол-во блоков по вертикали
        this.tSize = {x: 0, y: 0}; // tile size
        this.mapSize = {x: 0, y: 0}; // map size in pixels
        this.tilesets = new Array();
        this.imgLoaded = false;//сомнительные строки
        this.jsonLoaded = false;//сомнительные строки
        this.layers = null;
        this.view = new View(0,0,1000,800);//Отображаемая область
    }

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width; //Ширина карты в блоках
        this.yCount = this.mapData.height; //Высота карты в блоках
        this.tSize.x = this.mapData.tilewidth; //Разрешение блока в пикселах по ширине
        this.tSize.y = this.mapData.tileheight;//Разрешение блока в пикселах по высоте
        this.mapSize.x = this.xCount * this.tSize.x; //размер карты в пикселах
        this.mapSize.y = this.yCount * this.tSize.y; //размер карты в пикселах по ширине
        this.imgLoaded = false; //Все изображение загружены
        this.jsonLoaded = false; //json описание загружено

        let imgLoadCount = 0; //Кол-во загруженных изображений
        for (let i = 0; i < this.mapData.tilesets.length; i++) { // Загружаем из JSON в массив tileset
            let img = new Image;
            img.onload = () => {
                imgLoadCount++;
                if (imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;

                }
            }
            img.src = this.mapData.tilesets[i].image;

            let t = this.mapData.tilesets[i];
            let objTileSet = new ObjTileSet(t.firstgid, img, t.name, Math.floor(t.imagewidth / this.tSize.x), Math.floor(t.imagewidth / this.tSize.y));
            this.tilesets.push(objTileSet);
        }
        this.jsonLoaded = true; //распарсили весь JSON
    }

    draw(ctx) {
        if (!this.imgLoaded && !this.jsonLoaded) {
            setTimeout(() => {
                this.draw(ctx);
            }, 50);
        }
        else {
                for (let id = 0; id < this.mapData.layers.length; id++) //проходим по всем слоям
                {
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") //Пропускаем, если не tilelayer
                    {
                        this.tLayer = layer;
                        break;
                    }
                }
                for (let i = 0; i < this.tLayer.data.length; ++i)//Пройти по всей карте
                {
                    if (this.tLayer.data[i] !== 0) { //Если нет данных, пропускаем
                        let tile = this.getTile(this.tLayer.data[i]) // реализовать функцию gettile, поучение блока по индексу
                        let pX = (i % this.xCount) * this.tSize.x; //Вычисляем x в пикселах
                        let pY = Math.floor(i / this.xCount) * this.tSize.y;
                        if(!this.isVisible(pX,pY,this.tSize.x, this.tSize.y)) continue;
                        pX-=this.view.x;
                        pY-=this.view.y;
                        ctx.drawImage(tile._img, tile._px, tile._py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);//35 page
                    }
                }
        }
    }

    isVisible(x,y,width,height)//не рисуем за пределами видимой зоны
    {
        if(x+width < this.view.x || y+height<this.view.y || x>this.view.x +this.view.w || y>this.view.y + this.view.h)
        {
            return false; //
        }
        else
        {
            return true;
        }
    }

    getTile(index){
        let tileset = this.getTileset(index);
        let id = index - tileset.firstgid;//Индекс блока в tileset
        let x = id%tileset.xCount; //т.к. блок прямоугольный, остаток от деления на xCount дает  X в tileset
        let y = Math.floor(id/tileset.xCount);//округление от деления на xCount дает Y в tileset
        let _px = x*this.tSize.x;
        let _py = y*this.tSize.y;
        let tile = new Tile(tileset.image, _px, _py);
        return tile; // вернем блок для отображения
    }

    getTileset(index){
        for(let i = this.tilesets.length-1; i>=0;--i)
        {
            //в tilesets[i].firstgid - число, с которого начинается нумерация блоков
            if(this.tilesets[i].firstgid <= index)
            {
                return this.tilesets[i]; // Если индекс первого блока меньше либо равен искомому, знаит этот tileset и нужен нам
            }
            return null;
        }
    }

    loadMap(path) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    }

    parseEntities(){
        if(!this.imgLoaded && !this.jsonLoaded)
        {
            setTimeout(()=>this.parseEntities(),100);
        }
        else
        {
            for(let j=0; j<this.mapData.layers.length; ++j)
            {
                if(this.mapData.layers[j].type()==='objectgroup') // Просмотрим все слои
                {
                    let entities = this.mapData.layers[j];
                    for (let i =0; i<entities.objects.length; i++){
                        let e = entities.objects[i];
                        try
                        {
                            let gameManeger = new GameManager();
                            let obj = gameManeger.factory[e.type];//Новый объект на карте
                            obj.name = e.name;//имя объекта
                            obj.pos_x = e.x; //координата
                            obj.pos_y = e.y;//координата
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            gameManeger.entities.push(obj);
                            if (obj.name === "player") {
                                gameManeger.initPlayer(obj); //игрок, которымм управляет пользователь
                            }
                        }
                        catch(ex)
                        {
                            console.log("Error while creating:["+e.gid+"]"+e.type+","+ex);
                        }
                    }
                }
            }
        }
    }
    getTilesetIdx(x,y){ //возвращает блок из массива data с индексом (idx)
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY/this.tSize.y) * this.xCount + Math.floor(wX/this.tSize.x);
        return this.tLayer.data[idx];
    }

    centerAt(x,y){ //Центрирование области mapManager относительно положения игрока X,Y
        if(x<this.view.w/4)//Центрирование по горизонтали
        {
            this.view.x=0;
        }
        else
        {
            if(x>this.mapSize.x-this.view.w/4)
            {
                this.view.x=this.mapSize.x-this.view.w;
            }
            else
            {
                this.view.x=x-(this.view.w/4);
            }
        }
        if(y<this.view.h/2){//Центрирование по вертикали
        this.view.y=0;
        }
        else
        {
            if(y>this.mapSize.y-this.view.h/2)
            {
                this.view.y = this.mapSize.y - this.view.h;
            }
            else
            {
                this.view.y=y-(this.view.h/2);
            }
        }
    }
}
