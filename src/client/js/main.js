// Display current datetime to make sure is loaded
// console.log(new Date());

// Modify node content
function modifyNode(node) {
    var resultArea = $(node, "#resultarea");
    var resultBox  = resultArea.find("#resultbox");
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
                modifyNode(node);
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

//
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
