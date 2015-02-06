define(['editor/app'],
function(App, AlertView) {

  App.reqres.setHandler("convert", function(doc, srcFormat, dstFormat){
    var result = "";
    if (doc) {
      try {
        var options = {};
        options.isWylieOnly = srcFormat === "plain-wylie";
        result = doc.toFormat(dstFormat, options);
      } catch(e) {
        console.log("Unable to convert document. Error:");
        console.log(e);
      }
    }
    return result;
  });

  App.process = function() {
    try {
      var editorView = App.editor;
      var editorModel = editorView.model;
      var doc = editorModel.get("currentDocument");
      var srcFormat = editorModel.get("mode");
      var dstFormat = "html";

      var result = App.reqres.request("convert", doc, srcFormat, dstFormat);
      App.preview.update(result);
    } catch (e) {
      console.log("Unable to update preview. Error:");
      console.log(e);
    }
  };

});