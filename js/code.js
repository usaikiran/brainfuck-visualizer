
var names = { 
    "[":"open_bracket",
    "]":"close_bracket", 
    "+":"plus",
    "-":"minus", 
    ",":"input", 
    ".":"output", 
    ">":"right", 
    "<":"left",
    "o":"comment"
};

function span( operator, select )
{
    var span_html = "", ext_class="";

    if( isNaN( select ) )
        select = false;
    else if( select == true )
        ext_class = "select";
    
    if( operator.search( /[\[\]\.\,\+\-\<\>]/ )!=-1 )
        span_html = "<span class='operator "+names[operator]+"'>"+operator+"</span>";
    else
    {
        if( operator==" " )
            operator="&nbsp;";
        span_html = "<span class='operator "+names['o']+" "+ext_class+" '>"+operator+"</span>";
    }

    return span_html;
}

function encode( code )
{
    var encoded = "";

    for( var i=0; i<code.length; i++ )
    {
        encoded += span( code.charAt(i) );
    }

    return encoded;
}