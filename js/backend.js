
var cells = [];
var pointer = 0;
var cellSize = 1000;

var row=0;
var col=0;
var text = "";
var text_count = 0;

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
    text_count = 0;
    
    hide_error();
    hide_input();
    $("#play").html( "<i class='material-icons' id='play-stamp'>change_history</i>" );
    $( "#console" ).html("");

    row = 0;
    col = -1;
    text = "";
    current_col = -1;
}

function soft_reset()
{
    input_div = false;
    move(0);
    $( "#console" ).val("");
    row = 0;
    col = -1;
    current_col = -1;

    renderCells();
    
    cells = [];
    for (var i = 0; i < cellSize; i++) {
        cells.push(0);
    }
    pointer = 0;
}

function compile( text )
{
    var temp = [], count=0;

    brackets = {}
    for( var i=0; i<text.length; i++ )
    {
        for( var j=0; j<text[i].length; j++ )
        {
            if( text[i].charAt(j) == "[" )
            {
                temp.push( {0:i, 1:j, 2:count} );
            }
            if( text[i].charAt(j) == "]" )
            {
                if( temp.length == 0 )
                {                    
                    error["msg"].push( "Misplaced closing bracket ] at "+i+":"+j );
                    error["count"] += 1;

                    alert_error();
                    return false;                    
                }

                var data = temp.pop();

                brackets[data[0]+":"+data[1]] = [ i, j, count ];
                brackets[i+":"+j] = [ data[0], data[1], data[2] ];
            }
            count++;
        }
    }

    if( temp.length != 0 )
    {                    
        error["msg"].push( "Misplaced open bracket ] at "+temp[0][0]+":"+temp[0][1] );
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
        row=0;
        col=0;
    }

    output = true;
    text = code;
    text = text.split("\n");

    if( compile( text ) == false )
        return;

    for( ; row<text.length; row++ )
    {
        for( ; col<text[row].length; col++ )
        {
            parse();

            if( text[row].charAt(col+1)==',' )
                return;
        }
    }

    output = false;
}

function playCode( code )
{
    soft_reset();
    step =true;
    
    if( code.length == 0 )
    {
        reset();
        return;
    }

    text = code;
    text = text.split("\n");

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
    col++;
    if( col>=text[row].length )
    {
        row++;
        col=0;
    }
    if( row>=text.length )
    {
        if( play == true )
        {
            row = 0;
            col = -1;
            //console.log( "finished @ "+row+" "+col );
            $("#play").trigger( "click" );
        }
        step = false;
        return false;
    }
    text_count++;
    return true;
}

function parse() 
{
    for ( ; text[row].charAt(col).search( /[\[\]\<\>\+\-\,\.]/ ) == -1 ; )
    {
        if( increment() == false )
            return;
    }

    //$("#editor").selectRange( text_count-1, text_count );

    if (text[row].charAt(col) == "[")    
    {
        if( cells[pointer]==0 )
        {
            temp_row = brackets[ row+":"+col ][0];
            temp_col = brackets[ row+":"+col ][1];

            row = temp_row;
            col = temp_col;

            text_count += brackets[ row+":"+col ][2];
        }
        //brackets.push( { "row":row, "col":col } );
    }   

    if (text[row].charAt(col) == "]")
    {
        if(cells[pointer]!=0)
        {
            temp_row = brackets[ row+":"+col ][0];
            temp_col = brackets[ row+":"+col ][1];

            row = temp_row;
            col = temp_col;

            text_count -= brackets[ row+":"+col ][2]+1;
        }
        else
        {
            //brackets.pop();
        }
            
    }
    if (text[row].charAt(col) == ">")
        move(pointer + 1);
    
    if (text[row].charAt(col) == "<")
        move(pointer - 1);

    if (text[row].charAt(col) == "+")
        set( pointer, +1 );
    
    if (text[row].charAt(col) == "-")
        set( pointer, -1 );

    if (text[row].charAt(col) == ".")
        display( pointer );

    if (text[row].charAt(col) == ",")
    {
        read( pointer );
        col--;
    }
}