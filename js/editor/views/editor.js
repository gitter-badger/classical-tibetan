define(["jquery",
        "backbone",
        "marionette",
        "editor/views/ace",
        "editor/views/editorToolbar",
        "editor/models/editor",
        "editor/models/ace",
        "editor/models/document",
        "text!templates/editor_layout.html",
        "editor/behaviours/editorMode"],

function($, Backbone, Marionette, AceView, ToolbarView,
         EditorModel, AceModel, DocumentModel, Template,
         OnEditorModeChange) {
  var template = Template;
  var EditorView = Backbone.Marionette.LayoutView.extend({
    modelEvents: {
      "change:editor": function() {
        var aceModel = this.model.get("editor");
        this.listenTo(aceModel, "change:text", function() {
          this.model.get("currentDocument").set("text", this.model.get("editor").get("text"));
        });
      }
    },
    behaviors: {
      EditorModeChange: {
        behaviorClass: OnEditorModeChange,
        app: this.app
      }
    },
    initialize: function(options) {
      if (!this.model) {
        this.model = new EditorModel();
      }
      this.app = options.app;
    },
    getTemplate: function(){
      return template;
    },
    regions: {
      toolbar: "#editor-toolbar",
      editor: "#editor-area"
    },
    onShow: function() {
      this.model.set("currentDocument", new DocumentModel());
      this.model.set("editor", new AceModel());
      this.getRegion('toolbar').show(new ToolbarView({editorModel: this.model}));
      this.getRegion('editor').show(new AceView({model: this.model.get("editor"), app: this.app}));
    }
  });

  return EditorView;
});
