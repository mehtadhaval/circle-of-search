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

saveBtn.addEventListener('click', saveConfig);
emailInput.addEventListener('keyup',isValid);

function init() {
    chrome.storage.local.get("email", function (result) {
        emailInput.value = result.email;
    });
}
                      
init();