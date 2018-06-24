
var cursor_pos = 0;

$(document).ready(function () 
{
    cursor_pos = getCursorPos().start;
    rich_editor();

    $("#editor").on( "click mouseup mousedown mousemove keyup keydown copy cut", function(e)
    {
        rich_editor();
        return true;
    });

});

function editor_span( operator, select )
{
    var span_html = "", ext_class="";

    if( isNaN( select ) )
        select = false;
    else if( select == true )
        ext_class = "select";
    
    if( operator.search( /[\[\]\.\,\+\-\<\>]/ )!=-1 )
        span_html = "<span class='editor-text "+names[operator]+" "+ext_class+" '>"+operator+"</span>";
    else
    {
       /* if( operator==" " )
            operator="&nbsp;";*/
        span_html = "<span class='editor-text "+names['o']+" "+ext_class+" '>"+operator+"</span>";
    }

    return span_html;
}

function rich_editor()
{
    var text = $("#editor").val(), span_text="", encoded="";
    var cursor = getCursorPos();
    var cur_pos = cursor.end, i=0;
    var selection = false, bool=false;

    if( cursor.start != cursor.end )
        selection = true;

    for( i=0; i<text.length; i++ )
    {        
        if( i == cur_pos )
            encoded += "<span class='cursor'></span>";

        /*if( text.charAt(i) == "\n" )
            encoded += "<br/>";*/
        
        if( selection==true && i>=cursor.start && i<cursor.end )
            bool = true;

        encoded += editor_span( text.charAt(i), bool );
        bool = false;
    }

    if( i == cur_pos )
        encoded += "<span class='cursor'></span>";

    $("#pseudo-editor").html( encoded );
}

function getCursorPos() 
{
    var input = $("#editor")[0];

    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0;
                     rng.compareEndPoints("EndToStart", rng) > 0;
                     rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len };
                     rng.compareEndPoints("EndToStart", rng) > 0;
                     rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}