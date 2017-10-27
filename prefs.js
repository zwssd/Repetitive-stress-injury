const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Extension = imports.misc.extensionUtils.getCurrentExtension();

const Gettext = imports.gettext;
const _ = Gettext.domain('clipboard-indicator').gettext;

const Fields = {
    HISTORY_SIZE       : 'history-size',
    PREVIEW_SIZE       : 'preview-size',
    CACHE_FILE_SIZE    : 'cache-size',
    CACHE_FILE_DISABLE : 'cache-disable',
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
        Gettext.bindtextdomain('clipboard-indicator', localeDir.get_path());
}

const App = new Lang.Class({
    Name: 'ClipboardIndicator.App',
    _init: function() {
  	this.main = new Gtk.Grid({
            margin: 10,
            row_spacing: 12,
            column_spacing: 18,
            column_homogeneous: false,
            row_homogeneous: false
        });
        this.field_size = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 50,
                step_increment: 1
            })
        });
        this.field_preview_size = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 10,
                upper: 100,
                step_increment: 1
            })
        });
        this.field_cache_size = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 512,
                upper: Math.pow(2, 14),
                step_increment: 1
            })
        });
        this.field_cache_disable = new Gtk.Switch();

        let sizeLabel     = new Gtk.Label({
            label: _("History Size"),
            hexpand: true,
            halign: Gtk.Align.START
        });
        let previewLabel  = new Gtk.Label({
            label: _("Preview Size (characters)"),
            hexpand: true,
            halign: Gtk.Align.START
        });
        let cacheSizeLabel  = new Gtk.Label({
            label: _("Max cache file size (kb)"),
            hexpand: true,
            halign: Gtk.Align.START
        });
        let cacheDisableLabel  = new Gtk.Label({
            label: _("Disable cache file"),
            hexpand: true,
            halign: Gtk.Align.START
        });

        this.main.attach(sizeLabel          , 2, 1, 2 ,1);
        this.main.attach(previewLabel       , 2, 2, 2 ,1);
        this.main.attach(cacheSizeLabel     , 2, 4, 2 ,1);
        this.main.attach(cacheDisableLabel  , 2, 5, 2 ,1);
        //this.main.attach(deleteLabel        , 2, 4, 2 ,1);

        this.main.attach(this.field_size                   , 4, 1, 2, 1);
        this.main.attach(this.field_preview_size           , 4, 2, 2, 1);
        this.main.attach(this.field_cache_size             , 4, 4, 2, 1);
        this.main.attach(this.field_cache_disable          , 4, 5, 2, 1);

        SettingsSchema.bind(Fields.HISTORY_SIZE, this.field_size, 'value', Gio.SettingsBindFlags.DEFAULT);
        SettingsSchema.bind(Fields.PREVIEW_SIZE, this.field_preview_size, 'value', Gio.SettingsBindFlags.DEFAULT);
        SettingsSchema.bind(Fields.CACHE_FILE_SIZE, this.field_cache_size, 'value', Gio.SettingsBindFlags.DEFAULT);
        SettingsSchema.bind(Fields.CACHE_FILE_DISABLE, this.field_cache_disable, 'active', Gio.SettingsBindFlags.DEFAULT);

        this.main.show_all();
    }
});

function buildPrefsWidget(){
    let widget = new App();
    return widget.main;
}


