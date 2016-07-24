;(function () {

		var searchQuery = function () {
			var url = $.url();
			return url.fparam('q') || url.param('q');
		};

		var resultsTemplate = null;

		$('#rhs_block').waitUntilExists(function () {
			chrome.runtime.sendMessage({
	            type: "search_term",
	            data: {
	                term: searchQuery()
	            }
	        });
		});

		$("#rcnt").waitUntilExists(function(){
			$(".srg .g h3.r a").click(function(){
				$container = $(this).closest(".g");
				data = {
					title: $(this).text(),
					url: $(this).attr("data-href") || $(this).attr("href"),
					snippet: $container.find("span.st").text(),
					term: searchQuery()
				};
				chrome.runtime.sendMessage({
					type: "result_visited",
					data: data
				});
			});
		});

		function displayResults(data){
			$("#rhs_block").prepend(searchTemplate({"results": data}))
		}

    function notify(message) {
        switch(message.type){
            case "matching_searches":
                displayResults(message.data);
                break;
            default:
                console.log("Handler not defined for "+message.type)
        }
    }

		function compileTemplate() {
			$.get("chrome-extension://"+chrome.runtime.id+"/ui/search_results.html")
			.done(function(data){
				searchTemplate = Handlebars.compile(data);
				console.debug("search results template loaded");
			})
			.fail(function(data){
				console.error("failed to load search results template");
			});
		}
    /*
    Assign `notify()` as a listener to messages from the content script.
    */
    chrome.runtime.onMessage.addListener(notify);
		compileTemplate();
})();
