/* initialise variables */

var emailInput = document.querySelector("#email");
var saveBtn = document.querySelector("#saveBtn");
var form = document.getElementById("configForm");

function isValid() {
    if (form.checkValidity()) {
        saveBtn.removeAttribute('disabled');
    } else {
        saveBtn.setAttribute('disabled','true');
    }
}
function saveConfig(event) {
    if (form.checkValidity()) {
        var email = emailInput.value;
        chrome.storage.local.set({"email": email}, function () {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
            }
            chrome.runtime.sendMessage({
              type: "update_user"
            });
        });
    }
}

function clearConfig(event) {
  emailInput.value = null;
  chrome.storage.local.remove("email", function(){
    chrome.runtime.sendMessage({
      type: "update_user"
    });
    init();
  });
}

saveBtn.addEventListener('click', saveConfig);
document.querySelector("#clearBtn").addEventListener('click', clearConfig);
emailInput.addEventListener('keyup',isValid);
emailInput.addEventListener('change',isValid);

function init() {
    chrome.storage.local.get("email", function (result) {
      if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }else{
        if(!!result.email){
          emailInput.value = result.email;
          isValid();
        }
      }
    });
}

init();
