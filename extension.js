const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Mainloop   = imports.mainloop;

const Gettext = imports.gettext;
const _ = Gettext.domain('repetitive-stress-injury').gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let text, text_time;
let TIMEOUT_MS = 1000;
//一个小时，按秒计算，可以自己调整时间
let maxtime = 10;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    if (!text) {
        text = new St.Label({
            style_class: 'rest-label',
            text: _("Time is up, please have a rest.")
        });
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

function init(extensionMeta) {
    let localeDir = Me.dir.get_child('locale');
    Gettext.bindtextdomain('repetitive-stress-injury', localeDir.get_path());

    let msg;
    let minutes;
    let seconds;

    text_time = new St.Label({
        style_class: 'panel-label'
    });

    this._timeout = Mainloop.timeout_add(TIMEOUT_MS, function () {
        if(maxtime>0)
        {
            minutes = Math.floor(maxtime/60);
            seconds = Math.floor(maxtime%60);
            msg = _("The distance is over ")+minutes.toString()+" "+ _("Minutes") +" "+seconds.toString()+" "+_("Seconds");
            if(maxtime == 5*60) msg = _("Attention, five minutes!");
            maxtime = maxtime-1;
            text_time.text = msg;
            return true;
        }
        else if(maxtime<=0)
        {
            msg = _("Time is up, the countdown is over!");
            _showHello();
            text_time.text = msg;
            return false;
        }
    });

    text_time.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(text_time, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(text_time);
}
