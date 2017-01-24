
function Display( Flag )
{
    var Prop = "";
    if( Flag === true )
    {
        console.log("Entered Display");
        document.getElementById("Tutorials").style.display = "block";
        document.getElementById("Git").style.display = "block";
        document.getElementById("Title").style.display = "block";
        document.getElementById("Canvas").style.display = "run-in";
        document.getElementById("LArrow").style.display = "run-in";
        document.getElementById("RArrow").style.display = "run-in";
        document.getElementById("Editor").style.display = "run-in";
        document.getElementById("Console").style.display = "run-in";
        document.getElementById("EditorLabel").style.display = "block";
        document.getElementById("ConsoleLabel").style.display = "block";
        document.getElementById("Reset").style.display = "block";
        document.getElementById("Run").style.display = "run-in";
        document.getElementById("Output").style.display = "run-in";
        document.getElementById("StatusBar").style.display = "run-in";
        /*document.getElementById().style.display = "none";
        document.getElementById().style.display = "none";
        document.getElementById().style.display = "none";
        document.getElementById().style.display = "none";*/
    }
}
