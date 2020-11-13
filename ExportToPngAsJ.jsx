function exportFileToPNG24 (destPath, resolution, bounds) {
	var fileSpec = new File(destPath);
    var captureOpts = new ImageCaptureOptions; // this is needed to turn on anti aliasing
    captureOpts.matte = false; // to give transparent areas some color. default is white.
    captureOpts.antiAliasing = true;
    captureOpts.transparency = false;
    captureOpts.resolution = resolution;
    app.activeDocument.imageCapture (fileSpec, bounds, captureOpts);
}

function n(n){
    return n > 9 ? n : "0" + n;
}

var dlg = new Window("dialog", "Export to PNG", undefined);
var dlg_inputs_group = dlg.add("group");
	dlg_inputs_group.orientation = "row";
	dlg_inputs_group.add("statictext {text: 'Resolution'}")
var dlg_dropdown = dlg_inputs_group.add("dropdownlist", undefined, [72, 150, 300]);
	dlg_dropdown.preferredSize.width = 110;
	dlg_dropdown.selection = 0;
var dlg_buttons_group = dlg.add("group");
	dlg_buttons_group.orientation = "row";
var dlg_ok = dlg_buttons_group.add("button", undefined, "OK");
var dlg_cancel = dlg_buttons_group.add("button", undefined, "Cancel");

dlg_ok.onClick = function(){
	var jref;
	var destPath;
	var bounds;
	var resolution = dlg_dropdown.selection.text;
	var _break = false;

	var doc = app.activeDocument;
	var re1 = new RegExp(/^([jJ][^0aA-zA]\d{1,6}(?:[bB]|))(?:_)/g);
	var re2 = new RegExp(/(?:_)([jJ][^0aA-zZ]\d{1,6}(?:[bB]|))(?:\.pdf)$/g);

	if (doc.name.match(re1)) {
		jref = re1.exec(doc.name)[1];
	} else if (doc.name.match(re2)) {
		jref = re2.exec(doc.name)[1];
	} else {
		_break = true;
		alert("No reference found. Not exporting.");
	}
	
	if (!_break) {
		for (i=0; i<doc.artboards.length; i++) {
			bounds = doc.artboards[i].artboardRect;
			for (i2=0; i2<bounds.length; i2++) {
				if (i2 == 1 || i2 == 2) {
					bounds[i2] += 14.5;
				} else {
					bounds[i2] -= 14.5;
				}
			}
			destPath = "S:/"+jref+"-"+n(i+1)+".png";
			exportFileToPNG24 (destPath, resolution, bounds);
		}
	}
	
	dlg.close();
};

dlg.show();