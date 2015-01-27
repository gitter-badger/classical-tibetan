define([
  'underscore',
  'backbone',
  'jquery',
  'github',
  'js-yaml',
  'cookies',
  "markdown"
], function(_, Backbone, $, GitHub, JsYaml, Cookies, Markdown){

  var token = "2b0eb792116e96b059744ffdb21ab03a125625d3";
  var uname = "leannenorthrop";
  var repositoryName = "classical-tibetan";
  var branch = "gh-pages";
  var markdown = Markdown;

  var DocumentModel = Backbone.Model.extend({
    defaults: {
      text: "",
      description: "",
      tags: [],
      name: "",
      category: "",
      file: ""
    },
    toFormat: function(format,options) {
      var result = "";
      switch(format) {
        case "html": return toHTML(options); break;
      }
      return result;
    },
    toHTML: function(options) {
        var text = this.get("text");
        if (options.isWylieOnly === true) {
          text = "(alpha mode)\n\n:::\n" + text + ":::\n\n(end)";
        }

        var tree = markdown.parse(text, "ExtendedWylie");
        var jsonml = markdown.toHTMLTree( tree );
        var html = markdown.renderJsonML( jsonml );

        return html;
    },
    load: function(text) {
      // strip any yaml
      if (text && text.indexOf("---") === 0) {
        var endIndex = text.indexOf("---", 4);
        var yaml = text.substring(4,endIndex);
        var json = JsYaml.load(yaml);
        this.set("description", json.description ? json.description : "");
        this.set("category", json.category ? json.category : "");
        this.set("tags", json.tags ? json.tags : "");
        text = text.substring(endIndex+4);
      }
      this.set("text", text);
    },
    open: function(options) {
      var me = this;
      var github = new Github({
        token: token,
        auth: "oauth"
      });
      var repo = github.getRepo(uname, repositoryName);
      repo.read(branch, me.get("file"), function(err, data) {
        if (!err) {
          me.load(data);
        } else {
          console.log(err);
        }
      });
    },
    close: function(options) {
      if (options && options.save) {
        var me = this;
        var github = new Github({
          username: $.cookie('gu'),
          password: $.cookie('gp'),
          auth: "basic"
        });
        /* lib broken var repo = github.getRepo(uname, repositoryName);
        repo.write(branch, '_drafts/'+options.name+".md", this.get("text"), 'updated by javascript api', function(err) {
          console.log(err);
        });*/
      }
    }
  });

  return DocumentModel;
});
