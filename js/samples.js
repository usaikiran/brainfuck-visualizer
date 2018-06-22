
var sampleList = [], index = 0;

function filtter_code(text)
{
    var open=-1, close=-1, ignore=false, code="";

    for( var i=0; i<text.length; i++ )
    {
        if( text.charAt(i).search( /[\[\]\<\>\+\-\,\.]/ )!=-1 )
        {
            if( text.charAt(i) == "[" && open==-1 )
            {
                ignore=true;
            }
            if( text.charAt(i) == "]" && ignore==true )
            {
                ignore=false;
                continue;
            }
            open++;

            if( ignore==false )
                code += text.charAt(i);
        }
    }

    return code;
}

function readText(file, func) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                //alert( allText );
                setTimeout(func(allText), 1);
            }
        }
    }
    rawFile.send(null);
}

function displaySample(text) 
{
    var htmlText = $("#samples-div").html();
    var raw_title = sampleList[index].split(".")[0];
    var title = sampleList[index].split(".")[0].replace(/_/g, " ");
    var desc = text.split("\n")[0];

    index += 1;

    var code = encode( filtter_code( text ) );

    htmlText += "<div class='panel panel-default sample'>\
        <div class='panel-heading sample-title'><a href='#' class='link'>"+ title + "</a></div>\
        <div class='panel-body sample-desc'><a href='#' class='link'>"+ desc + "</a> </div>\
        <div class='line-break'></div>\
        <p id='code-"+raw_title+"' class='code'>"+code+"</p>\
        <div id='"+raw_title+"' class='panel-footer sample-footer'>\
            <button id='download-"+raw_title+"' class='btn action-btn' data-toggle='tooltip' title='Download' ><i class='material-icons' style='transform: rotate(90deg)'>arrow_forward</i></button>\
            <button id='edit-"+raw_title+"' class='btn action-btn' data-toggle='tooltip' title='Edit Code'><i class='material-icons'>code</i></button>\
            <button id='copy-"+raw_title+"' class='btn action-btn' data-toggle='tooltip' title='Copy Code'><i class='material-icons'>filter_none</i></button>\
        </div>\
        </div>";

    $("#samples-div").html(htmlText);
    $("#copy-"+raw_title).attr( "onclick", "copyCode('code-"+raw_title+"')" );
    $("#edit-"+raw_title).attr( "onclick", "editCode('code-"+raw_title+"')" );
    $("#download-"+raw_title).attr( "onclick", "downloadCode('code-"+raw_title+"')" );
}

function readSamples(text) {

    sampleList = text.split("\n");
    index = 0;

    for (var i = 0; i < sampleList.length; i++) 
    {
        readText("file:///media/test/WorkSpace/Codes/PROJECT%20BRAINX/Ver_3.0/data/" + sampleList[i], displaySample);
    }
}

function decode( code )
{
    var raw_code = code.split("</span>"), temp;
    code = "";

    console.log( "raw_code : "+raw_code );
    for( var i=0; i<raw_code.length; i++ )
    {
        temp = raw_code[i].charAt( raw_code[i].length-1 );
        
        if( temp==";" )
        {
            if( raw_code[i].charAt( raw_code[i].length-3 ) == "g" )
                temp = ">";
            else
                temp = "<";
        }

        code += temp;
    }

    console.log( "code : "+code );
    return code;
}

function loadEditor( text )
{
    $( "#editor" ).val( text );
    window.scrollTo(0,0);
}

function downloadCode( id )
{
    var name = id.split("-")[1]+".b";

    $('html, body').animate({
        scrollTop: $("#editor").offset().top
      }, 800, function(){
   
      });
}

function copyCode( id )
{
    var code = $("#"+id).html();
    copyToClipboard( decode(code) );
}

function editCode( id )
{
    var name = id.split("-")[1]+".b";
    readText("file:///media/test/WorkSpace/Codes/PROJECT%20BRAINX/Ver_3.0/data/" + name, loadEditor);
}

function initSamples() 
{
    readText("file:///media/test/WorkSpace/Codes/PROJECT%20BRAINX/Ver_3.0/samples.dat", readSamples);
}