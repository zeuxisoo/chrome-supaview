// Display current datetime to make sure is loaded
// console.log(new Date());

// Modify node content when observe trigged
function modifyResultAreaNode(node) {
    var resultArea = $(node, "#resultarea");
    var resultBox  = resultArea.find("#resultbox");
    var familyBox  = resultBox.find(".familybox");
    var productBox = familyBox.find(".productbox");

    productBox.find(".current ul.links li").each(function(i, link) {
        var href = $(link).find("a").attr('href');

        $(link).append('<a href="javascript:void(0)" data-url="' + href + '" class="preview-link">Preview</a>');
    });
}

function modifyResultBoxNode(node) {
    var resultBox  = $(node, "#resultbox");
    var familyBox  = resultBox.find(".familybox");
    var productBox = familyBox.find(".productbox");

    productBox.find(".current ul.links li").each(function(i, link) {
        var href = $(link).find("a").attr('href');

        $(link).append('<a href="javascript:void(0)" data-url="' + href + '" class="preview-link">Preview</a>');
    });
}

// Observe target element
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.id === "resultarea") {
                modifyResultAreaNode(node);
            }

            if (node.nodeType === 1 && node.id === "resultbox") {
                modifyResultBoxNode(node);
            }
        });
    });
});

observer.observe($("div#mainbody")[0], {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true
});

// Monitor static or dynamic .preview-link element
$(document).on("click", ".preview-link", function() {
    var url  = $(this).data("url");
    var self = this;

    $(this).html("Loading...");

    $.get(url, function(data) {
        // Get heading
        var pageHeading = $("#content #contenthead h1", data);

        // Find file list block and parse to get all file name
        var downloadList      = $("#dl_filelist", data);
        var fileNameList      = downloadList.find("table tbody tr:nth-child(n+2) td:even");
        var fileNameListBlock = $("<div id='fileNameListBlock'></div>");
            fileNameListBlock.append("<div id='fileNameList' style='height: 500px; overflow-y: auto; text-align: left'></div>");

        fileNameList.each(function(i, fileName) {
            var fileNameText = $(fileName).text();
            var fileNameElement = $("<p>" + fileNameText + "</p>");

            fileNameListBlock.find("#fileNameList").append(fileNameElement);
        });

        // Find proceed download link and parse from javascript
        var proceedDownloadLinkCode    = downloadList.find(".dl_proceed_button script").html(); console.log(proceedDownloadLinkCode);
        var proceedDownloadLinkMatches = /<a\shref=\\"(.*)\\">/i.exec(proceedDownloadLinkCode);
        var proceedDownloadLinkUrl     = proceedDownloadLinkMatches[1];

        if (proceedDownloadLinkUrl != null && proceedDownloadLinkUrl[0] != '/') {
            proceedDownloadLinkUrl = '/' + proceedDownloadLinkUrl;
        }

        fileNameListBlock.append("<div id='proceedDownloadLink' style='margin-top: 10px'><a href='" + proceedDownloadLinkUrl + "'>Proceed Download</a></div>");

        // Show file list
        swal({
            title: pageHeading.html(),
            text : fileNameListBlock.html(),
            html : true
        });

        $(self).html("Preview");
    }).fail(function() {
        swal("Oops!", "Cannot make request to target patches", "error");
    });
});
