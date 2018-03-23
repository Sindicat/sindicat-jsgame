class SoundManager{
    constructor() {
        this.clips = {}; //хранение звуков
        this.context = null;
        this.GainNode = null;
        this.soundsLoaded = false;
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    }


    load(path,callback)
    {
        if(this.clips[path])
        {
            callback(this.clips[path]);
            return;
        }
        this.clips[path] = new Clip(path,null,false);
        var request = new XMLHttpRequest();
        request.open('GET',path,true);
        request.responseType= 'arraybuffer';
        request.onload =()=>{
            this.context.decodeAudioData(request.response,(buffer)=>{
                this.clips[path].buffer = buffer;
                this.clips[path].loaded = true;
                callback(this.clips[path]);
                console.log("Loaded clip");
                //действие после загрузки
            });
        };
        request.send();
    }

    loadArray(array){
        for(let i =0; i<array.length; ++i)
        {
            this.load(array[i] ,()=>{
                if(array.length === Object.keys(this.clips).length)
                {
                    for(let sd in this.clips)
                    {
                        if(!this.clips[sd].loaded) return 0;
                    }
                    this.soundsLoaded=true;
                }
            });
        }

    }

    play(path,settings){
        if(!this.soundsLoaded)
        {
            setTimeout(()=>{this.play(path)}, 1000);
            return;
        }

        let looping = false;
        let volume = 1;
        if(settings.looping)
        {
            looping = settings.looping;
        }
        if(settings.volume)
        {
           volume = settings.volume;
        }

        let track = this.clips[path];
        if(track===null) return false;
        let sound = this.context.createBufferSource();
        sound.buffer = track.buffer;
        sound.connect(getSoundManager().gainNode);
        sound.looping = looping;
        getSoundManager().gainNode.gain.value = volume;
        sound.start(0);
        return true;

    }
}
