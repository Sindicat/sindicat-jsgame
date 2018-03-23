class Clip{
    get path() {
        return this._path;
    }

    set path(value) {
        this._path = value;
    }
    get buffer() {
        return this._buffer;
    }

    set buffer(value) {
        this._buffer = value;
    }
    get loaded() {
        return this._loaded;
    }

    set loaded(value) {
        this._loaded = value;
    }
    constructor(path,buffer,loaded)
    {
        this._path = path;
        this._buffer = buffer;
        this._loaded = loaded;
    }

    play(volume,loop){ //loop - false/true
        getSoundManager().play(this.path,{looping:loop?loop:false, volume:volume?volume:1});
    }
}