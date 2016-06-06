/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/

var email = null;
var ES_URL = "https://10.40.11.114:9200"

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
}

var indexData = function(index, type, data){
    contextualizeData(data);
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
          "size": 0,
          "aggs": {
            "emails": {
              "aggs": {
                "emails": {
                  "terms": {
                    "field": "email"
                  }
                }
              },
              "filter": {
                "query_string": {
                  "query": searchTerm,
                  "fields": [
                    "term"
                  ]
                }
              }
            }
          }
        };
    search(query, "cos", "search_term").done(function(result){
        data = result.aggregations.emails.emails.buckets
        
        chrome.notifications.create({
            "type": "basic",
            "iconUrl": chrome.extension.getURL("icons/link-48.png"),
            "title": "Who searched for this !!!",
            "message": JSON.stringify(data)
          });
        /*
        chrome.tabs.sendMessage({
            type: "search_term_available",
            data: data
        });*/
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
        default:
            console.log("Handler not defined for "+message.type)
    }
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
chrome.runtime.onMessage.addListener(notify);
