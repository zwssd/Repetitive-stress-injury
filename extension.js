const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Mainloop   = imports.mainloop;
const Lang = imports.lang;

let text, text_time;
let TIMEOUT_MS = 1000;
let time = 123456;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 10,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function CurentTime()
{
    var now = new Date();

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒

    var clock = "";

    if(hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return(clock);
}

//一个小时，按秒计算，可以自己调整时间
var maxtime = 60*60
function init() {

    text_time = new St.Label({
        style_class: 'panel-label'
    });

    let msg;
    let minutes;
    let seconds;

    this._timeout = Mainloop.timeout_add(TIMEOUT_MS, function () {
        if(maxtime>=0)
        {
            minutes = Math.floor(maxtime/60);
            seconds = Math.floor(maxtime%60);
            msg = "距离结束还有 "+minutes.toString()+" 分 "+seconds.toString()+" 秒";
            if(maxtime == 5*60) msg = '注意，还有5分钟!';
            maxtime = maxtime-1;
        }
        else
        {
            //clearInterval(timer);
            msg = "时间到，结束!";
        }
        text_time.text = msg;
        return true;
    });

    //text_time.text = msg;

    text_time.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(text_time, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
