
var cells = [];
var pointer = 0;
var cellSize = 1000;

var row=0;
var col=0;
var text = "";
var text_count = -1;

var delay = 400, max_delay=1500, min_delay=10;
var pointer_delay = 0.2, pointer_max_delay=0.5, pointer_min_delay=0.0;
var brackets = {};
var current_col = -1;

var error = { "msg":[], "count":0 }
console.log( error );

$.fn.selectRange = function(start, end) {
    var e = document.getElementById($(this).attr('id')); // I don't know why... but $(this) don't want to work today :-/
    if (!e) return;
    else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */ 
    else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
    else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
};

function reset() 
{
    cells = [];
    for (var i = 0; i < cellSize; i++) {
        cells.push(0);
    }
    pointer = 0;
    play = false;
    step = false;
    output = false;
    input_div = false;
    error = { "msg":[], "count":0 };
    move(0);
    shift(0);
    text_count = -1;
    
    hide_error();
    hide_input();
    $("#play").html( "<i class='material-icons' id='play-stamp'>change_history</i>" );
    $( "#console" ).html("");

    text = "";
    current_col = -1;
}

function soft_reset()
{
    input_div = false;
    move(0);
    $( "#console" ).val("");
    current_col = -1;
    text_count = -1;
    
    renderCells();
    
    cells = [];
    for (var i = 0; i < cellSize; i++) {
        cells.push(0);
    }
    pointer = 0;
}

function compile( text )
{
    var temp = [], num_rows=0;

    brackets = {}
    for( var i=0; i<text.length; i++ )
    {
        if( text.charAt(i) == "[" )
        {
            temp.push( i );
        }
        if( text.charAt(i) == "]" )
        {
            if( temp.length == 0 )
            {                    
                error["msg"].push( "Misplaced closing bracket ]" );
                error["count"] += 1;

                alert_error();
                return false;                    
            }

            var data = temp.pop();
            brackets[data] = i;
            brackets[i] = data;
        }
        if( text.charAt(i)=="\n" )
            num_rows++;
    }

    if( temp.length != 0 )
    {                    
        error["msg"].push( "Misplaced open bracket ]" );
        error["count"] += 1;

        alert_error();
        return false;                    
    }

    return true;
}

function get_output( code )
{
    var temp;
    if( output == false )
    {
        reset();
        text_count=0;
    }

    output = true;
    text = code;

    if( compile( text ) == false )
        return;

    for( ; text_count<text.length; text_count++ )
    {
        parse();
        if( text.charAt(text_count)==',' )
            return;
    }

    output = false;
}

function playCode( code )
{
    step =true;
    
    if( code.length == 0 )
    {
        reset();
        return;
    }

    text = code;

    if( compile( text ) == false )
        return;

    iterate();
}

function iterate()
{
    if( increment() == true )
        if( parse() == false )
            return;

    if( play == true )
        setTimeout( function(){ iterate(text) }, delay );
}

function increment()
{
    text_count++;
    if( text_count>text.length )
    {
        soft_reset();
        if( play == true )
        {
            console.log( "finished @ "+text_count+" "+text.length );
            text_count = -1;
            $("#play").trigger( "click" );
        }
        step = false;
        return false;
    }
    
    return true;
}

function parse() 
{
    for ( ; text.charAt(text_count).search( /[\[\]\<\>\+\-\,\.]/ ) == -1 ; )
    {
        if( increment() == false )
            return;
    }
    var char = text.charAt(text_count);

    $("#editor").selectRange( text_count, text_count+1 );
    rich_editor( true );

    if (char == "[")    
    {
        if( cells[pointer]==0 )
        {
            text_count = brackets[ text_count ];
        }
    }   

    if (char == "]")
    {
        if(cells[pointer]!=0)
        {
            text_count = brackets[ text_count ];
        }
            
    }
    if (char == ">")
        move(pointer + 1);
    
    if (char == "<")
        move(pointer - 1);

    if (char == "+")
        set( pointer, +1 );
    
    if (char == "-")
        set( pointer, -1 );

    if (char == ".")
        display( pointer );

    if (char == ",")
    {
        read( pointer );
        col--;
    }
}