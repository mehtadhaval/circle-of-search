/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    switch(message.type){
        case "search_term": 
            indexData("cos", "search_term", message.data);
            break;
        default:
            console.log("Handler not defined for "+message.type)
    }
}

console.log("test");

/*
Assign `notify()` as a listener to messages from the content script.
*/
chrome.runtime.onMessage.addListener(notify);
