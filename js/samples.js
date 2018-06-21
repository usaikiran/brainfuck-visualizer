
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
    console.log( "entered : "+sampleList);

    var htmlText = $("#samples-div").html();
    var title = sampleList[index].split(".")[0].replace(/_/g, " ");
    var desc = text.split("\n")[0];

    index += 1;

    var code = encode( filtter_code( text ) );

    htmlText += "<div class='panel panel-default sample'>\
        <div class='panel-heading sample-title'><a href='#' class='link'>"+ title + "</a></div>\
        <div class='panel-body sample-desc'><a href='#' class='link'>"+ desc + "</a> </div>\
        <div class='line-break'></div>\
        <p class='code'>"+code+"</p>\
        <div class='panel-footer sample-footer'>\
            <button class='btn action-btn'><i class='material-icons' style='transform: rotate(90deg)'>arrow_forward</i></button>\
            <button class='btn action-btn'><i class='material-icons'>code</i></button>\
        </div>\
        </div>";

    $("#samples-div").html(htmlText);

}

function readSamples(text) {

    sampleList = text.split("\n");
    index = 0;

    for (var i = 0; i < sampleList.length; i++) 
    {
        console.log( "processing : "+sampleList[i] );
        readText("file:///media/test/WorkSpace/Codes/PROJECT%20BRAINX/Ver_3.0/data/" + sampleList[i], displaySample);
    }
}

$(document).ready(function () {
    readText("file:///media/test/WorkSpace/Codes/PROJECT%20BRAINX/Ver_3.0/samples.dat", readSamples);
});