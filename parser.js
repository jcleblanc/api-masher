parser = function(){
    //property instantiation
    var qlioPublicQueryURI = "http://ql.io/q?s=";
    var widgetStack = [];
    var currString, resultFormat, queryInsert;
	
    /************************************************************
    * Method: Get Data
    * Description: Use the query provided to make a cross domainrequest to 
    *              ql.io endpoint to capture data
    ************************************************************/
    var getData = function(query){
        //concatinate query uri
        var sURL = qlioPublicQueryURI + encodeURIComponent(query);
        
        $.ajax({
            type: 'GET',
            url: sURL,
            success: function(data){ parseResults(data[0]); },
            dataType: 'jsonp'
        });
    }
	
    /************************************************************
    * Method: Parse Results
    * Description: Using the result set, parse the results
    *			   into display mode
    ************************************************************/
    var parseResults = function(results){
        //return data instantiation
        var html = "";
        
        for(var i = 0; i < results.length; i++){
            html += Mustache.render(resultFormat, results[i]);
        }
		
        document.getElementById(queryInsert).innerHTML = html;
        parser.render();
    }

    /************************************************************
    * Method: Public Function Return
    ************************************************************/
    return {
        //push widget on the load stack
        push: function(query, format, insertEl){
            //validate widget variables
            if (query == null || format == null || insertEl == null){
                if (window.console){ console.log('Missing query, return format or insert element'); }
                return null;
            }
			
            //push widget load on the stack
            widgetStack.push(function(){ parser.init(query, format, insertEl); });
        },
		
        //pop widget off the load stack and execute
        render: function(){ if (widgetStack.length > 0){ widgetStack.pop()(); } },
	
        //widget initialization
        init: function(query, format, insertEl){ 
            resultFormat = format; queryInsert = insertEl;
            return getData(query);
        }
    }
}();