/*
	A simple class for displaying file information and progress
	Note: This is a demonstration only and not part of SWFUpload.
	Note: Some have had problems adapting this class in IE7. It may not be suitable for your application.
*/

// Constructor
// file is a SWFUpload file object
// targetID is the HTML element id attribute that the FileProgress HTML structure will be added to.
// Instantiating a new FileProgress object with an existing file will reuse/update the existing DOM elements
function FileProgress(file, targetID) {
	this.fileProgressID = file.id;

	this.opacity = 100;
	this.height = 0;

	this.fileProgressWrapper = document.getElementById(this.fileProgressID);
	if (!this.fileProgressWrapper) {
		this.fileProgressWrapper = document.createElement("div");
		this.fileProgressWrapper.className = "progressWrapper";
		this.fileProgressWrapper.id = this.fileProgressID;

		this.fileProgressElement = document.createElement("div");
		this.fileProgressElement.className = "progressContainer";

		var imageHolder = document.createElement("div");
		imageHolder.className = "imageHolder";
		imageHolder.id = this.fileProgressID + "_image";
		imageHolder.appendChild(document.createTextNode(" "))

		var progressCancel = document.createElement("a");
		progressCancel.className = "progressCancel";
		progressCancel.href = "#";
		progressCancel.style.visibility = "hidden";
		progressCancel.appendChild(document.createTextNode(" "));

		var progressText = document.createElement("div");
		progressText.className = "progressName";
		progressText.appendChild(document.createTextNode(file.name));

		var progressBar = document.createElement("div");
		progressBar.className = "progressBarPending";
		progressBar.innerHTML = "<img src=\"/images/placer.gif\" />";

		var progressStatus = document.createElement("div");
		progressStatus.className = "progressBarStatus progressBar";
		progressStatus.innerHTML = "&nbsp;";

		this.fileProgressElement.appendChild(imageHolder);
		this.fileProgressElement.appendChild(progressCancel);
		this.fileProgressElement.appendChild(progressText);
		this.fileProgressElement.appendChild(progressStatus);
		this.fileProgressElement.appendChild(progressBar);

		this.fileProgressWrapper.appendChild(this.fileProgressElement);

		document.getElementById(targetID).appendChild(this.fileProgressWrapper);
	} else {
		this.fileProgressElement = this.fileProgressWrapper.firstChild;
	}

	this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.SetProgress = function (percentage) {
	this.fileProgressElement.className = "progressContainer green";
	this.fileProgressElement.childNodes[4].className = "progressBarInProgress";
//	this.fileProgressElement.childNodes[4].style.width = percentage + "%";
};
FileProgress.prototype.SetComplete = function (image) {
	this.fileProgressElement.className = "progressContainer blue";
	this.fileProgressElement.childNodes[4].className = "progressBarComplete";
//	this.fileProgressElement.childNodes[4].style.width = "";
	this.fileProgressElement.childNodes[0].innerHTML = image;
	
/*
	var oSelf = this;
	setTimeout(function () {
		oSelf.Disappear();
	}, 10000);
*/

	//instead of getting rid of the box, who the picture.

};
FileProgress.prototype.SetError = function () {
	this.fileProgressElement.className = "progressContainer red";
	this.fileProgressElement.childNodes[4].className = "progressBarComplete";

/*
	var oSelf = this;
	setTimeout(function () {
		oSelf.Disappear();
	}, 5000);
*/
};

FileProgress.prototype.SetCancelled = function () {
	this.fileProgressElement.className = "progressContainer";
	this.fileProgressElement.childNodes[4].className = "progressBarError";
	this.fileProgressElement.childNodes[4].style.width = "";

	var oSelf = this;
	setTimeout(function () {
		oSelf.Disappear();
	}, 2000);
};
FileProgress.prototype.SetStatus = function (status) {
	this.fileProgressElement.childNodes[3].innerHTML = status;
};

// Show/Hide the cancel button
FileProgress.prototype.ToggleCancel = function (show, swfUploadInstance) {
	this.fileProgressElement.childNodes[1].style.visibility = show ? "visible" : "hidden";
	if (swfUploadInstance) {
		var fileID = this.fileProgressID;
		this.fileProgressElement.childNodes[1].onclick = function () {
			swfUploadInstance.cancelUpload(fileID);
			return false;
		};
	}
};

// Fades out and clips away the FileProgress box.
FileProgress.prototype.Disappear = function () {

	var reduceOpacityBy = 15;
	var reduceHeightBy = 4;
	var rate = 30;	// 15 fps

	if (this.opacity > 0) {
		this.opacity -= reduceOpacityBy;
		if (this.opacity < 0) {
			this.opacity = 0;
		}

		if (this.fileProgressWrapper.filters) {
			try {
				this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
			} catch (e) {
				// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
				this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + this.opacity + ")";
			}
		} else {
			this.fileProgressWrapper.style.opacity = this.opacity / 100;
		}
	}

	if (this.height > 0) {
		this.height -= reduceHeightBy;
		if (this.height < 0) {
			this.height = 0;
		}

		this.fileProgressWrapper.style.height = this.height + "px";
	}

	if (this.height > 0 || this.opacity > 0) {
		var oSelf = this;
		setTimeout(function () {
			oSelf.Disappear();
		}, rate);
	} else {
		this.fileProgressWrapper.style.display = "none";
	}
};