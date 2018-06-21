
var names = { 
    "[":"open_bracket",
    "]":"close_bracket", 
    "+":"plus",
    "-":"minus", 
    ",":"input", 
    ".":"output", 
    ">":"right", 
    "<":"left" 
};

function span( operator )
{
    return "<span class='operator "+names[operator]+"'>"+operator+"</span>";
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