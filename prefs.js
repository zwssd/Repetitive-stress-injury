const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Extension = imports.misc.extensionUtils.getCurrentExtension();

const Gettext = imports.gettext;
const _ = Gettext.domain('repetitive-stress-injury').gettext;

const Fields = {
    TIME_LENGTH: 'time-length',
    AUTO_RUN: 'auto-run',
};

const SCHEMA_NAME = 'org.gnome.shell.extensions.clipboard-indicator';

const getSchema = function () {
    let schemaDir = Extension.dir.get_child('schemas').get_path();
    let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir, Gio.SettingsSchemaSource.get_default(), false);
    let schema = schemaSource.lookup(SCHEMA_NAME, false);

    return new Gio.Settings({ settings_schema: schema });
};

const SettingsSchema = getSchema();

function init() {
    let localeDir = Extension.dir.get_child('locale');
    if (localeDir.query_exists(null))
        Gettext.bindtextdomain('repetitive-stress-injury', localeDir.get_path());
}

const App = new Lang.Class({
    Name: 'Repetitive-stress-injury.App',
    _init: function() {
  	this.main = new Gtk.Grid({
            margin: 10,
            row_spacing: 12,
            column_spacing: 18,
            column_homogeneous: false,
            row_homogeneous: false
        });
        this.field_length = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 14400,
                step_increment: 1
            })
        });
        this.field_auto_run = new Gtk.Switch();

        let lengthLabel     = new Gtk.Label({
            label: _("Set the length of time (minute)"),
            hexpand: true,
            halign: Gtk.Align.START
        });
        let autoRunLabel  = new Gtk.Label({
            label: _("Set auto run"),
            hexpand: true,
            halign: Gtk.Align.START
        });

        this.main.attach(lengthLabel        , 2, 1, 2 ,1);
        this.main.attach(autoRunLabel       , 2, 2, 2 ,1);

        this.main.attach(this.field_length                 , 4, 1, 2, 1);
        this.main.attach(this.field_auto_run           , 4, 2, 2, 1);

        SettingsSchema.bind(Fields.TIME_LENGTH, this.field_length, 'value', Gio.SettingsBindFlags.DEFAULT);
        SettingsSchema.bind(Fields.AUTO_RUN, this.field_auto_run, 'active', Gio.SettingsBindFlags.DEFAULT);

        this.main.show_all();
    }
});

function buildPrefsWidget(){
    let widget = new App();
    return widget.main;
}


