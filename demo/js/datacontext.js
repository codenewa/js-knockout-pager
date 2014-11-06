window.demo = window.demo || {};

window.demo.datacontext = (function(){
	var datacontext = {
		GetData = GetData
	};

	return datacontext;


	function GetData(params){
		params = params || {};
		return ajaxRequest(GetDataUrl(), JSON.stringify(params));
	}

	function ajaxRequest(url, data) {
        var options = {
            type: "POST",
            dataType: "json",
            data: data ? data : null,
            cache: false,
            contentType: "application/json; charset=utf-8"
        };
        return $.ajax(url, options);
    }

    function ajaxRequestSync(url, data) {
        var options = {
            type: "POST",
            dataType: "json",
            data: data ? data : null,
            cache: false,
            contentType: "application/json; charset=utf-8",
            async: false
        };
        return $.ajax(url, options);
    }

    function DataURL(){return "";}
})();