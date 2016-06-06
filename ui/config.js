/* initialise variables */

var emailInput = document.querySelector("#email");
var saveBtn = document.querySelector("#saveBtn");
var form = document.getElementById("configForm");
saveBtn.addEventListener('click', saveConfig);

function saveConfig(event){
    if(!form.checkValidity())
        return;
    var email = emailInput.value;
    chrome.storage.local.set({ "email" : email }, function() {
        if(chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
    });
}

function init(){
    chrome.storage.local.get("email", function(result) {        
        emailInput.value = result.email;
    });
}
                      
init();