/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/

var email = "test@example.com";
var ES_URL = "https://127.0.0.1:9200"

function loadUserData() {
    chrome.storage.local.get("email", function(result) {
        if(chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }else{
            email = result.email;
        }
    });
}

function search(query, index, type) {
    return $.ajax({
        url: ES_URL+"/"+index+"/"+type+"/_search",
        data: JSON.stringify(query),
        method: "POST",
        contentType: "application/json",
        dataType: "json"
    });
}

function processSearchSearchTermResponse(result){
    return result.aggregations.emails.emails.buckets;
}

var contextualizeData = function(data){
    data['email'] = email;
    data['timestamp'] = Date.now();
}

var indexData = function(index, type, data){
    contextualizeData(data);
    console.log(data);
    $.ajax({
        url: ES_URL+"/"+index+"/"+type,
        data: JSON.stringify(data),
        method: "POST",
        contentType: "application/json",
        dataType: "json"
    });
}

function findSearchTerms(searchTerm){
    query = {
      "aggs": {
        "email": {
          "terms": {
            "field": "email",
            "order": {
              "avg_score": "desc"
            }
          },
          "aggs": {
            "avg_score": {
              "avg": {
                "script": "_score"
              }
            },
            "last_searched": {
              "max": {
                "field": "timestamp"
              }
            },
            "top_searches": {
              "terms": {
                "field": "term.raw",
                "order": {
                  "avg_score": "desc"
                }
              },
              "aggs": {
                "avg_score": {
                  "avg": {
                    "script": "_score"
                  }
                }
              }
            }
          }
        }
      },
      "query": {
        "filtered": {
          "query": {
            "function_score": {
              "query": {
                "fuzzy": {
                  "term": searchTerm
                }
              },
              "functions": [
                {
                  "gauss": {
                    "timestamp": {
                      "origin": "now",
                      "scale": "3d",
                      "offset": 0,
                      "decay": 0.99
                    }
                  }
                }
              ]
            }
          },
          "filter": {
            "not": {
              "term": {
                "email": email
              }
            }
          }
        }
      },
      "size": 0
    };
    console.log("search query : ", query);
    search(query, "cos", "search_term").done(function(result){

        results = _.map(result.aggregations.email.buckets, function(bucket){
          return {
            "email": bucket.key,
            "last_searched": bucket.last_searched.value,
            "search_terms": _.map(bucket.top_searches.buckets, function(top_search){
              return {
                "key": top_search.key,
                "count": top_search.doc_count
              }
            })
          }
        });

        if(!results.length){
          return;
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "matching_searches",
            data: results
          });
        });
    })
}

function notify(message) {
    switch(message.type){
        case "search_term":
            indexData("cos", "search_term", message.data);
            findSearchTerms(message.data.term);
            break;
        case "update_user":
            loadUserData();
            break;
        case "result_visited":
            indexData("cos", "result_visited", message.data);
            break;
        default:
            console.log("Handler not defined for "+message.type)
    }
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
chrome.runtime.onMessage.addListener(notify);
