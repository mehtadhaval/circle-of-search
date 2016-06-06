var ES_URL = "https://10.40.11.114:9200"
var indexData = function(index, type, data){
    $.ajax({
        url: ES_URL+"/"+index+"/"+type,
        data: JSON.stringify(data),
        method: "POST",
        contentType: "application/json",
        dataType: "json"
    });
}