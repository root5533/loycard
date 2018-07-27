/*=========================================================================================
    File Name: dropzone.js
    Description: dropzone
    --------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.2
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
Dropzone.options.dpzSingleFile = {
    paramName: "file",
    maxFiles: 1,
    init: function () {
        this.on("maxfilesexceeded", function (file) {
            this.removeAllFiles();
            this.addFile(file);
        });
    }
};
/********************************************
*               Multiple Files              *
********************************************/
Dropzone.options.dpzMultipleFiles = {
    paramName: "file",
    maxFilesize: 0.5,
    clickable: true
};
/********************************************************
*               Use Button To Select Files              *
********************************************************/
new Dropzone(document.body, {
    url: "#",
    previewsContainer: "#dpz-btn-select-files",
    clickable: "#select-files" // Define the element that should be used as click trigger to select files.
});
/****************************************************************
*               Limit File Size and No. Of Files                *
****************************************************************/
Dropzone.options.dpzFileLimits = {
    paramName: "file",
    maxFilesize: 0.5,
    maxFiles: 5,
    maxThumbnailFilesize: 1,
};
/********************************************
*               Accepted Files              *
********************************************/
Dropzone.options.dpAcceptFiles = {
    paramName: "file",
    maxFilesize: 1,
    acceptedFiles: 'image/*'
};
/************************************************
*               Remove Thumbnail                *
************************************************/
Dropzone.options.dpzRemoveThumb = {
    paramName: "file",
    maxFilesize: 1,
    addRemoveLinks: true,
    dictRemoveFile: " Trash"
};
/*****************************************************
*               Remove All Thumbnails                *
*****************************************************/
Dropzone.options.dpzRemoveAllThumb = {
    paramName: "file",
    maxFilesize: 1,
    init: function () {
        // Using a closure.
        var _this = this;
        // Setup the observer for the button.
        $("#clear-dropzone").on("click", function () {
            // Using "_this" here, because "this" doesn't point to the dropzone anymore
            _this.removeAllFiles();
            // If you want to cancel uploads as well, you
            // could also call _this.removeAllFiles(true);
        });
    }
};
