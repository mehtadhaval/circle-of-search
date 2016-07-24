;(function () {

		var searchQuery = function () {
			var url = $.url();
			return url.fparam('q') || url.param('q');
		};

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

    function notify(message) {
        switch(message.type){
            case "matching_searches":
                console.log(message.data);
                break;
            default:
                console.log("Handler not defined for "+message.type)
        }
    }
    /*
    Assign `notify()` as a listener to messages from the content script.
    */
    chrome.runtime.onMessage.addListener(notify);
})();
