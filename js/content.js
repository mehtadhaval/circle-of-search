;(function () {
	
	var searchQuery = function () {
		var url = $.url();
		return url.fparam('q') || url.param('q');
	};

    var iterateResults = function(callbackfunction){
        $("#ires").find(".g").each(function(index){
            var data = {
                "href": $(this).find(".r a").attr("href"),
                "title": $(this).find(".r a").text(),
                "description": $(this).find(".s").find(".st").text()
            };
            callbackfunction(data);
        });
    }
    
    var parseResults = function () {
        iterateResults(function(data){
            console.log(data);
        });
    }
    
    var saveSearchTerm = function () {
        indexData("cos", "search_term", {
            email: "dhaval.mehta@ishisystems.com",
            term: searchQuery()
        });
    }
    
	$('#rhs_block').waitUntilExists(function () {
		chrome.runtime.sendMessage({
            type: "search_term",
            data: {                
                term: searchQuery()
            }
        });
	});
})();