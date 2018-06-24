
var rowCount = 20;
var play = false;
var step = false;
var input_div = false;
var output = false;

var cell_left_offset = 0;

function setEditorLines(count) 
{
    var lines = "";
    for (var i = 1; i <= count; lines += i + "\n", i++) { }
    $("#editor_line").val(lines);
}

$(document).ready(function () 
{
    setEditorLines(20);
    renderCells();
    initSamples();

    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })  

    $("#editor").scrollTop(0);
    rowCount = parseInt( $("#editor").attr("rows") );

    //console.log( "delay : "+Math.floor( ( (delay-min_delay)/(max_delay-min_delay) )*100 ) );
    //$("#delay").val( ( (delay-min_delay)/(max_delay-min_delay) ) );

    $("button").click(function(){
        $(this).tooltip('hide');
    });

    $("#editor").bind('input propertychange', function() {

        var text = $("#editor").val();
        var lines = text.split(/\r|\r\n|\n/);
        var count = lines.length;

        setEditorLines( Math.max( rowCount, count ) );
    });

    $("#editor").scroll(function()
    {
        $("#editor_line").scrollTop($("#editor").scrollTop());
    });

    $("#play").click(function(){

        play = !play;
        if( play==true )
        {
            $(this).html( "<i class='material-icons'>crop_square</i>" );
            playCode( $("#editor").val() );
        }
        else
        {
            $(this).html( "<i class='material-icons' id='play-stamp'>change_history</i>" );
        }

    });

    $("#reset").click(function()
    {
        renderCells();
        reset();
    });

    $("#steps").click(function()
    {
        if( play == true )
        {
            $("#play").trigger("click");
            reset();
            iterate();
        }
        else if( step == false )
            playCode( $("#editor").val() );
        else
            iterate();
        step = true;
    });

    $("#output").click(function()
    {
        get_output( $("#editor").val() );
        console.log("output terminated");
    });

    $("#input-div").submit(function(e)
    {
        e.preventDefault();
        fetchInput();
    });

    $("#toggle-input").click(function()
    {
        toggleInput();
        console.log("toggling input");
    });

    $("#deci").on('input',function(){
        return validate_input( parseInt( $("#deci").val() ) );
    });

    $("#hexa").on('input',function(){
        return validate_input( hexa2deci( $("#hexa").val() ) );
    });

    $("#octa").on('input',function(){
        return validate_input( octa2deci( $("#octa").val() ) );
    });

    $("#binary").on('input',function(){
        return validate_input( binary2deci( $("#binary").val() ) );
    });

    $("#shift-right").click(function(){
        
        cell_count = Math.floor( document.getElementById('cell-sub-div').offsetWidth/(2) );
        shift( -cell_count );
    });

    $("#shift-left").click(function(){
        
        cell_count = Math.floor( document.getElementById('cell-sub-div').offsetWidth/(2) );
        shift( cell_count );
    });

    $("#delay").change(function(){

        delay = min_delay + ($(this).val()/100.0)*(max_delay-min_delay);
        pointer_delay = pointer_min_delay + ($(this).val()/100.0)*(pointer_max_delay-pointer_min_delay);
        $("#pointer").css( "transition", "all "+pointer_delay+"s" ); 

        console.log( "delay : "+delay );
    });

    $("#empty-console").click(function(){
        $("#console").html("");
    });

    $("#copy-console").click(function(){

        var text = $("#console").html(), temp, raw_text="";
        text = text.split( "</span>" );
        

        for( var i=0; i<text.length; i++ )
        {
            temp = text[i];
            temp = temp.split("<span");

            raw_text += temp[0];
        }

        console.log( text+" <-> "+raw_text );
        copyToClipboard(raw_text);
    });

    reset();
});

function validate_input( num )
{
    console.log( num );

    if( isNaN(num) )
    {
        $("#deci").val("");
        update_input_values(); 
        return false;
    }
    else if( num < 0 )
        num = 0;
    else if( num > 255 )
        num = 255;

    if( num >=0 && num <=255 )
    {
        $("#deci").val( num );
        update_input_values();

        console.log( "num : "+num );
        return true;
    }
    else
        return false;
}

function update_input_values()
{
    var deci = parseInt( $("#deci").val() );

    if( isNaN(deci) )
        deci = "";

    $( "#octa" ).val( deci2octa( deci ) );
    $( "#hexa" ).val( deci2hexa( deci ) );
    $( "#binary" ).val( deci2binary( deci ) );
}

function deci2hexa( num )
{
    return num.toString(16);
}

function deci2octa( num )
{
    return num.toString(8);
}

function deci2binary( num )
{
    return num.toString(2);
}

function hexa2deci( num )
{
    return parseInt(num,16);
}

function octa2deci( num )
{
    return parseInt(num,8);
}

function binary2deci( num )
{
    return parseInt(num,2);
}

function renderCells()
{
    var htmlText = "";

    for( var i=0; i<cellSize; i++ )
    {
        htmlText += "<div id='cell-"+i+"'class='cell'>0</div>";
    }

    $("#cell-sub-div").html( htmlText );
}

function move( to )
{
    if( to<cellSize && to>=0 )
    {
        $( "#pointer" ).css( "margin-left", ""+(52*to)+"px" );
        pointer = to;
    }
    else
    {
        error["msg"].push( "unexpected pointer value : "+to );
        error["count"] += 1;
        alert_error();
    }
}

function set( pointer, fac )
{
    temp = cells[ pointer ]; 
    temp = cells[ pointer ]+fac;

    if( temp<0 )
        temp = 256+temp;
    else if( temp>255 )
        temp = temp%256;

    $( "#cell-"+pointer ).html( temp );
    cells[ pointer ] = temp;
}

function display( index )
{
    var code = symbols[cells[index]];

    console.log( code+" "+isNaN( code ) );
    out = $( "#console" ).html();

    if( code==null )
    {
        code = null;//ext_chars[cells[index]];
        if( cells[index]>127 && cells[index]<256 )
            code = 9617+cells[index]-127;

        if( code == null )
            $( "#console" ).html( out+String.fromCharCode(cells[index]) );
        else
        {
            console.log( "val : "+cells[index]+" code : "+code);
            $( "#console" ).html( out+String.fromCharCode( code ) );
        }
    }
    else
    {
        $("#console").html(out+"<span class='special-symbol select-none'>"+symbols[cells[index]]+"</span>");
    }

}

function toggleInput( )
{
    if( input_div == false )
    {
        show_input();
    }
    else
    {
        hide_input();
    }
}

function hide_input()
{
    $("#input-div").css( "bottom", "-100px" );
    $( "#input-div" ).css( "display", "none" );

    input_div = false;
}

function show_input()
{
    $( "#input-div" ).css( "display", "inline-block" );
    $("#input-div").css( "bottom", "10px" );

    input_div = true;
}

function read( index )
{
    show_input();
}

function fetchInput()
{
    var value = parseInt( $("#deci").val() );

    if( value != NaN && value>=0 && value<256 )
    {
        hide_input();

        cells[pointer] = value;
        $( "#cell-"+pointer ).html( value );
        display( pointer );
        col++;

        if( output == true )
        {
            col++;
            get_output( $("#editor").val() );
        }
    }
}

function shift( offset )
{
    width = document.getElementById('cell-sub-div').offsetWidth;
    cell_count = Math.floor( width/52 );
    temp = Math.min( Math.max( -1*cell_count*cellSize+width, cell_left_offset+offset ),0 );
    cell_left_offset = temp;
    $("#cell-sub-div").css( "left", temp+"px" );
    $("#pointer").css( "left", temp+"px" );
}

function alert_error()
{
    var msg = error["msg"][0];

    //reset();
    console.log(msg);
    $( "#error-msg" ).html( msg );
    $( "#error-div" ).css( "top", "60px" );
    setTimeout( function(){
        $( "#error-div" ).css( "display", "inline-block" );
    },100 );
}

function hide_error()
{
    $( "#error-div" ).css( "top", "-100px" );
    setTimeout( function(){
        $( "#error-div" ).css( "display", "none" );
    }, 500 );
}