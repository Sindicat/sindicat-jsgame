class GameTime{
    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
    }
    get sec() {
        return this._sec;
    }

    set sec(value) {
        this._sec = value;
    }
    get ms() {
        return this._ms;
    }

    set ms(value) {
        this._ms = value;
    }
    constructor(){
        this._ms=0;
        this._sec=0;
        this._min=0;
    };


}