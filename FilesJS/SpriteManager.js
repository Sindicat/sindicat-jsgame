class SpriteManager{
    constructor(){
        this.image = new Image();
        this.sprites = new Array(); //хранение спрайтов
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }

    loadAtlas(atlasJson, atlasImg){ //в параметрах пути к файлам
        let request = new XMLHttpRequest();
        request.onreadystatechange = ()=>{
            if(request.readyState===4 && request.status===200)
            {
                this.parseAtlas(request.responseText); //Атлас успешно получен
            }
        }
        request.open("GET", atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    }

    loadImg(imgName) //путь к файлу спрайтов
    {
        this.image.onload = ()=>this.imgLoaded=true;
        this.image.src=imgName;
    }

    parseAtlas(atlasJSON){ //парсим спрайты в jsonе
        let atlas = JSON.parse(atlasJSON);
        for(let name in atlas.frames){
            //console.log("Name: "+name);
            let frame = atlas.frames[name].frame; //получение спрайта
            let filename = atlas.frames[name].filename;
            // console.log("Name: "+filename);
            let sprite = new Sprite(filename, frame.x,frame.y,frame.w,frame.h)
            this.sprites.push(sprite);
        }
        this.jsonLoaded = true;
    }

    drawSprite(ctx,name,x,y)//X и Y - координаты для отображения относительно КАРТЫ!
    {
        if(!this.imgLoaded && !this.jsonLoaded){
            setTimeout(()=>this.drawSprite(ctx,name,x,y),100);
        }
        else
        {
            let sprite = this.getSprite(name);//Получить спрайт по имени
            if(!getMapManager().isVisible(x,y,sprite.w,sprite.h)) return;
            x-=getMapManager().view.x;
            y-=getMapManager().view.y;
            ctx.drawImage(this.image, sprite.x,sprite.y,sprite.w,sprite.h,x,y,sprite.w,sprite.h);
        }
    }

    getSprite(name){
        for(let i=0; i<this.sprites.length;i++)
        {
            let s = this.sprites[i]; //объекты типа Sprite
            if(s.myname === name)
            {
                //console.log("Спрайт был найден");
                return s;
            }
        }
        console.log("Спрайт НЕ был найден");
        return null;
    }
}