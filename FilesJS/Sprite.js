class Sprite{
    get h() {
        return this._h;
    }

    set h(value) {
        this._h = value;
    }
    get w() {
        return this._w;
    }

    set w(value) {
        this._w = value;
    }
    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }
    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }
    get myname() {
        return this._myname;
    }

    set myname(value) {
        this._myname = value;
    }
    constructor(name,x,y,w,h){
        this._myname=name;
        this._x=x;
        this._y=y;
        this._w=w;
        this._h=h;
    }
}