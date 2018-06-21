
var app = angular.module('brainApp', []);

var rowCount = 20;
var play = false;
var step = false;
var input_div = false;
var output = false;

var cell_left_offset = 0;

app.controller('brainCtrl', function ($scope) 
{
    setEditorLines(20);
});

function setEditorLines(count) 
{
    var lines = "";
    for (var i = 1; i <= count; lines += i + "\n", i++) { }
    $("#editor_line").val(lines);
}

$(document).ready(function () 
{
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })  

    $("#editor").scrollTop(0);
    rowCount = parseInt( $("#editor").attr("rows") );

    delay = min_delay + ($(this).val()/100.0)*(max_delay-min_delay);

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

    $("#input-div").submit(function()
    {
        fetchInput();
    });

    $("#toggle-input").click(function()
    {
        toggleInput();
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
    });

    renderCells();
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
    out = $( "#console" ).html();
    $( "#console" ).html( out+String.fromCharCode(cells[index]) );
    //console.log(out+String.fromCharCode(cells[index]) );
}

function toggleInput( )
{
    if( input_div == true )
    {
        $("#input-div").css( "bottom", "-100px" );
    }
    else
        $("#input-div").css( "bottom", "10px" );
    
    input_div = !input_div;
}

function read( index )
{
    $("#input-div").css( "bottom", "10px" );
    input_div = true;
}

function fetchInput()
{
    var value = $("#deci").val();

    if( value != NaN && value>=0 && value<256 )
    {
        $("#input-div").css( "bottom", "-100px" );
        input_div = false;

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

    reset();
    console.log(msg);
    $( "#error-msg" ).html( msg );
    $( "#error-div" ).css( "top", "10px" );
}

function hide_error()
{
    $( "#error-div" ).css( "top", "-100px" );
}