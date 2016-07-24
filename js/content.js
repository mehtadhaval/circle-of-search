;(function () {

		var searchQuery = function () {
			var url = $.url();
			return url.fparam('q') || url.param('q');
		};

		function searchResultURLs() {
			return _.map($(".srg .g h3.r a"), function(url){
				var $url = $(url);
				return $url.attr("data-href") || $url.attr("href");
			});
		}

		var templates = {
			"search_results": {"url": "/ui/search_results.html", "compiled": null},
			"urls_visited": {"url": "/ui/urls_visited.html", "compiled": null}
		};

		$('#rhs_block').waitUntilExists(function () {
			chrome.runtime.sendMessage({
	        type: "search_term",
	        data: {
	            term: searchQuery()
	        }
	    });
		});

		$("#rcnt").waitUntilExists(function() {
			chrome.runtime.sendMessage({
        type: "search_url",
        data: {
          urls: searchResultURLs()
				}
	    });

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
			$("#rhs_block").prepend(templates["search_results"].template({"results": data}))
		}

		function displayVisitedURLs(data){
			_($(".srg .g")).forEach(function(searchResult){
				$searchResult = $(searchResult);
				$url = $searchResult.find("h3.r a");
				url = $url.attr("data-href") || $url.attr("href");
				result = data[url];
				if(!result){
					return true;
				}
				$searchResult.append(templates["urls_visited"].template(result));
			});
		}

    function notify(message) {
      switch(message.type){
        case "matching_searches":
          displayResults(message.data);
          break;
				case "matching_urls":
					displayVisitedURLs(message.data);
					break;
        default:
          console.log("Handler not defined for "+message.type)
      }
    }

		function compileTemplate() {
			_(templates).forEach(function(template, name){
				$.get("chrome-extension://"+chrome.runtime.id+template.url)
				.done(function(data){
					templates[name].template = Handlebars.compile(data);
					console.debug(name, "template loaded");
				})
				.fail(function(data){
					console.error("failed to load template", name);
				});
			});
		}
    /*
    Assign `notify()` as a listener to messages from the content script.
    */
    chrome.runtime.onMessage.addListener(notify);
		compileTemplate();
})();
