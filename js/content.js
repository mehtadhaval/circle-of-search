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
    
    function notify(message) {
        switch(message.type){
            case "search_term_available":
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