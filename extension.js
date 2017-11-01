const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Mainloop = imports.mainloop;
const Util = imports.misc.util;

const Gettext = imports.gettext;
const _ = Gettext.domain('repetitive-stress-injury').gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Prefs = Me.imports.prefs;

let text, text_time;
let TIMEOUT_MS = 1000;
//按分钟计算，可以自己调整时间
let MAXTIME = 10;
let AUTORUN = true;
let maxtime;

function _hideRest() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showRest() {
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
        {
            opacity: 0,
            time: 10,
            transition: 'easeOutQuad',
            onComplete: _hideRest
        });
}

function _prefs() {
    Util.spawn([
        "gnome-shell-extension-prefs",
        Me.uuid
    ]);
}

function _loadSettings() {
    this._settings = Prefs.SettingsSchema;

    this._fetchSettings();
}

function _fetchSettings() {
    MAXTIME = this._settings.get_int(Prefs.Fields.TIME_LENGTH);
    maxtime = MAXTIME*60;
    AUTORUN = this._settings.get_boolean(Prefs.Fields.AUTO_RUN);
}

function init(extensionMeta) {
    let localeDir = Me.dir.get_child('locale');
    if (localeDir.query_exists(null))
        Gettext.bindtextdomain('repetitive-stress-injury', localeDir.get_path());

    let msg;
    let hours;
    let minutes;
    let seconds;
    let result = true;

    _loadSettings();

    text_time = new St.Label({
        style_class: 'panel-label'
    });

    Mainloop.timeout_add(TIMEOUT_MS, function () {
        if (maxtime > 0) {
            hours = Math.floor(maxtime / 3600);
            if(hours<10)
                hours = "0"+hours;
            minutes = Math.floor(maxtime % 3600 / 60);
            if(minutes<10)
                minutes = "0"+minutes;
            seconds = Math.floor(maxtime % 3600 % 60);
            if(seconds<10)
                seconds = "0"+seconds;
            msg = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
            if (maxtime == 5 * 60) msg = _("Attention, five minutes!");
            --maxtime;
            text_time.text = msg;
            result = true;
        }
        else if (maxtime <= 0) {
            msg = _("Time is up, the countdown is over!");
            _showRest();
            text_time.text = msg;
            if(AUTORUN){
                _loadSettings();
                result = true;
            }else{
                result = false;
            }
        }
        return result;
    });

    text_time.reactive = true;
    text_time.connect('button-press-event', _prefs);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(text_time, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(text_time);
}
