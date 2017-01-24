
var Url = "file:///media/sk/WorkSpace/Codes/",
 		Max = 100,
    Size = 40,
    X = 2,
    Y = 11,
    Start_Position = X + 15,
    Offset = 0,
    ShiftLength = 10,
    LineWidth = 1,
		Measures = [],
    Positions = [],
		Pointer_Position = 0,
    Pointer_Pixels,
    Step = 0,
    PointerHeight = Y + Size + 4 + 4,
		Cells = [],
		Executed = 0,
		Stack = [],
    Top = -1,
    Bracket = [],
    OpenBracket = [],
    CloseBracket = [],
		InputBuffer = [],
		ConsoleText = [],
		Input = "",
    InputFlag = false,
		flag = 0,
		ResizeCount = 0,
		CellSize = 40,
    CanvasSize = 0,
		PointerIcon,
		Code = "",
    ConsoleOutput = "",
		Delay = 300,
    i = 0,
    Status = "",
    RunId = 0,
		RunFunc,
		Start = 0,
		Remaining = 0,
    count = 0,
    OutputStartTime = 0;

window.onload = function()
{
		setTimeout( function()
		{
    		$(document).ready(function()
				{
        		$("#Console").prop("readonly", true);

            //Display(true);
            WindowResize();
            //Display(true);
        		SetCrossFeatures();

						Reset();
		        DrawCanvas();
    		});
		}, 100);
};

window.onresize = function()
{
    ResizeCount++;

    setTimeout(function()
		{
        WindowResize();
        SetCrossFeatures();
        window.location.reload();
    }, 10);
};

function WindowResize()
{
  //  $(document).ready(function()
		{
        console.log( "Entered WindowResize" );
		    var Canvas = document.getElementById("Canvas");
		    var Context = Canvas.getContext("2d");

			  var LArrow = document.getElementById("LArrow");
			  var RArrow = document.getElementById("RArrow");

        LArrow.style.width = ((35 * (Size * Context.canvas.clientHeight) / 186) / 40) + "px";
        RArrow.style.height = RArrow.style.width = LArrow.style.height = LArrow.style.width;

        LArrow.style.marginTop = parseInt($("#Canvas").css('margin-top'), 10) + ((Y * Context.canvas.clientHeight) / 186 +
        	(Size * Context.canvas.clientHeight) / 186 - parseInt(LArrow.style.width, 10) + 4) + "px";
			  RArrow.style.marginTop = LArrow.style.marginTop;

        var Editor = document.getElementById("Editor");
        var Console = document.getElementById("Console");
        var StatusBar = document.getElementById("StatusBar");

        Editor.style.height = (398 * $(window).height()) / 738 + 'px';
        Console.style.height = (398 * $(window).height()) / 738 + 'px';

        var Reset = document.getElementById("Reset");
        var Run = document.getElementById("Run");
        var Steps = document.getElementById("Steps");
        var Output = document.getElementById("Output");
        var NewSize = 0,
            Gap = 1,
            EditorHeight = (398 * $(window).height()) / 738;

        Reset.style.height = (40 * EditorHeight) / 398 + 'px';
        Reset.style.width = Reset.style.height;
        Run.style.width = Run.style.height = Reset.style.width;
        Steps.style.width = Steps.style.height = Reset.style.width;
        Output.style.width = Output.style.height = Reset.style.width;

        NewSize = (40 * EditorHeight) / 398;
        Gap = (4 * EditorHeight) / 398;

        if (NewSize < 20)
            NewSize = 20;
        if (Gap < 1)
            Gap = 1;

        Output.style.top = (EditorHeight - NewSize) + 'px';
        Steps.style.top = (EditorHeight - NewSize * 2 - Gap) + 'px';
        Run.style.top = (EditorHeight - NewSize * 3 - Gap * 2) + 'px';
        Reset.style.top = (EditorHeight - NewSize * 4 - Gap * 3) + 'px';

        StatusBar.style.left = $("#Console").position().left+"px" ;
        StatusBar.style.width = parseInt( $("#Console").css("width"), 10 )+"px";
        StatusBar.style.top = EditorHeight - parseInt( $("#StatusBar").css("height"), 10 )+"px";
        console.log( "left : "+$("#Console").position().left );

        EditorLabel.style.left = (parseInt($("#Editor").css('width'), 10) -
            parseInt($("#EditorLabel").css('width'), 10) - parseInt($("#EditorLabel").css('top'), 10)) + "px";

        ConsoleLabel.style.left = (parseInt($("#Console").css('width'), 10) - Editor.getBoundingClientRect().left +
            Console.getBoundingClientRect().left - parseInt($("#ConsoleLabel").css('width'), 10) -
            parseInt($("#EditorLabel").css('top'), 10)) + "px";
    }//);

    $("#Console").prop("readonly", true);
};

function SetCrossFeatures()
{
    var Editor = document.getElementById("Editor");
    var Console = document.getElementById("Console");
    var ConsoleLabel = document.getElementById("ConsoleLabel");
    var EditorLabel = document.getElementById("EditorLabel");

    if (GetPlatform() === "Linux x86_64")
		{
        Editor.style.fontFamily = "monospace";
        Console.style.fontFamily = "monospace";
        ConsoleLabel.style.fontFamily = "monospace";
        EditorLabel.style.fontFamily = "monospace";
    }
		else if (GetPlatform() === "Win32")
		{
        Editor.style.fontFamily = "Consolas";
        Console.style.fontFamily = "Consolas";
        ConsoleLabel.style.fontFamily = "Consolas";
        EditorLabel.style.fontFamily = "Consolas";
    }
}

function PauseRun()
{
    window.clearTimeout(RunId);
    Remaining -= new Date() - Start;
    Status = "Pause";

    document.getElementById("Run").style.backgroundImage = "url('Images/Run.png')";

}

function Run()
{
    if (Status === "Run")
		{
        window.clearTimeout(RunId);
        Remaining -= new Date() - Start;
        Status = "Pause";

        document.getElementById("Run").style.backgroundImage = "url('Images/Run.png')";
    }
		else if (Status === "Pause")
		{
        Start = new Date();
        window.clearTimeout(RunId);
        RunId = window.setTimeout(RunFunc, Remaining);
        Status = "Run";

        document.getElementById("Run").style.backgroundImage = "url('Images/Pause.png')";
    }
		else if (Status === "Steps")
		{
        document.getElementById("Run").style.backgroundImage = "url('Images/Pause.png')";

        Delay = 500;
        Status = "Run";
        Execute();

    }
		else
		{
        ResetCell();
        ResetConsole();
        ResetBuffer();

        document.getElementById("Run").style.backgroundImage = "url('Images/Pause.png')";

        $("#Console").prop("readonly", true);
        Code = document.getElementById("Editor").value;
        Delay = 500;
        i = 0;
        Status = "Run";
        setStatus( "playing code ..." );
        Top = -1;

        MovePointer(0);

        Start = new Date();
        Execute();
    }
}

function Execute()
{
    RunId = setTimeout(RunFunc = function()
		{
        var res = ExecuteStep();

        if (res === false || res === true)
            return;
        else if ((res + 1) <= Code.length)
            Execute();
        else
        {
            document.getElementById("Run").style.backgroundImage = "url('Images/Run.png')";
            setStatus( "" );

            var curTime = new Date(), TimeTaken = curTime-Start;
            AppendToConsole( "\nFinished @["+(TimeTaken/1000)+"s]." );
            ResetBuffer();
        }
    }, Delay);

}

function ExecuteStep()
{
    var Char = GetChar(Code);

    if (Char === '>')
		{
        if (Status === "Output" && Pointer_Position !== 30000)
            Pointer_Position++;
        else if (Pointer_Position !== Max)
            MovePointer(Pointer_Position + 1);
        else
				{
            Error("> Max Limit Exceded\n");
            ResetBuffer();
            return false;
        }
    }
		else if (Char === '<')
		{
        if (Status === "Output" && Pointer_Position !== 0)
            Pointer_Position--;
        else if (Pointer_Position !== 0)
            MovePointer(Pointer_Position - 1);
    }
		else if (Char === '+')
		{
        Cells[Pointer_Position]++;
        if (Status !== "Output")
            DrawText(Pointer_Position, Cells[Pointer_Position]);
    }
		else if (Char === '-')
		{
        Cells[Pointer_Position]--;
        if (Status !== "Output")
            DrawText(Pointer_Position, Cells[Pointer_Position]);
    }
		else if (Char === '.')
		{
        $("#Console").prop("readonly", false);

        if( Status === "Output" )
        {
          document.getElementById("Console").value += String.fromCharCode(Cells[Pointer_Position]);
          ConsoleOutput += String.fromCharCode(Cells[Pointer_Position]);
        }
        else
          document.getElementById("Console").value += String.fromCharCode(Cells[Pointer_Position]);

        $("#Console").prop("readonly", true);
    }
		else if (Char === ',')
		{
        InputFlag = true;
        $("#Console").focus();
        PopUpInputs();
        setStatus( "[waiting for input] 'press enter to continue'" );
        return true;
    }
		else if (Char === '[')
		{
        if( Top === -1 )
        {
            j = i;
            do
            {
                if( Code[j] === '[' )
                {
                    Stack[++Top] = j;
                    //console.log( "Stack["+(Top)+"] = "+Stack[Top] );
                }
                else if( Code[j] === ']' )
                {
                    if( Top === -1 )
                    {
                        document.getElementById("Console").value += "\nerror @ "+j+": Unexpected ]" ;
                        ResetBuffer();
                        SelectRange( j, j+1 );
                        return false;
                    }
                    Bracket[Stack[Top]] = j;
                    Bracket[j] = Stack[Top--];

                    //console.log( "> j : "+j+" Top : "+(Top+1)+" Stack-"+(Top+1)+" = "+Stack[Top+1]+" :: "+Bracket[Stack[Top+1]]+" <--> "+Bracket[j] );
                }
            }while( Top !== -1 && ++j < Code.length );

            if( Top !== -1 )
            {
                document.getElementById("Console").value += "\nerror @ "+Stack[Top]+": missing ] after arguments" ;
                ResetBuffer();
                SelectRange( Bracket[Top], Bracket[Top]+1 );
                return false;
            }

            if( Cells[Pointer_Position] === 0 )
            {
                Top = -1;
                i = Bracket[""+i];
                Bracket = [];
            }

            ++Top;
        }
        else
        {
            console.log("[ top : "+Top);
            if( Cells[Pointer_Position] === 0 )
                i = Bracket[""+i];
            else
                ++Top;
        }
    }
		else if (Char === ']')
		{
        if( Top === -1 )
        {
          //  console.log( "@]" );
            document.getElementById("Console").value += "\nerror @ "+i+": missing ] after arguments" ;
            //SelectRange( i, i+1 );
            ResetBuffer();
            return false;
        }

        if( Cells[Pointer_Position] !== 0 )
            i = Bracket[""+i];
        else
          --Top;
    }

    SelectRange(i, i + 1);
    console.log("Top : "+Top);

    ++i;
    return i;
}

function SelectRange( x, y )
{
    if( Status !== "Output" )
        $("#Editor").selectRange( x, y );
}

function AppendToConsole( Text )
{
    document.getElementById("Console").value += Text;
}

function setStatus( Text )
{
    document.getElementById("StatusBar").innerHTML = Text;
}

function PopUpInputs()
{
    document.getElementById("DeciInput").style.display = "block";
    document.getElementById("HexaInput").style.display = "block";
    document.getElementById("BinaryInput").style.display = "block";
    document.getElementById("CharInput").style.display = "block";

    document.getElementById("DeciInput").value = "";
    document.getElementById("HexaInput").value = "";
    document.getElementById("BinaryInput").value = "";
    document.getElementById("CharInput").value = "";
    $("#DeciInput").focus();
}

function RemoveInputs()
{
    document.getElementById("DeciInput").style.display = "none";
    document.getElementById("HexaInput").style.display = "none";
    document.getElementById("BinaryInput").style.display = "none";
    document.getElementById("CharInput").style.display = "none";
}

function Changed( event )
{
    console.log("Changed");
}

function GetDeciInput(event)
{
    var Input = (event.keyCode ? event.keyCode : event.which);
    var position = document.getElementById("DeciInput").selectionStart, Deci = document.getElementById("DeciInput").value, char = String.fromCharCode( Input );

    console.log( "char : "+char );

    if( Input === 13 )
    {
        event.preventDefault();
        SubmitInput();
        return false;
    }
    else if( Input === 37 || Input === 38 || Input === 39 || Input === 40 )
        return true;
    else if( Input === 46 )
    {
        Deci = Deci.slice( 0, position )+Deci.slice( position+1 );

        UpdateInputs( Deci, "DeciInput" );
        return false;
    }
    else if ( Input === 8 )
    {
        Deci = Deci.slice( 0, position-1 )+Deci.slice( position );
        console.log( Deci );
        UpdateInputs( Deci, "DeciInput" );
        return false;
    }
    else if( Input < 48 || Input > 57 )
    {
       event.preventDefault();
       return false;
    }

    Deci = Deci.slice( 0, position )+char+Deci.slice( position );

    if( Deci < 0 || Deci > 255 )
    {
       event.preventDefault();
       return false;
    }

    UpdateInputs( Deci, "DeciInput" );

    return true;
}

function GetHexaInput(event)
{
    var Input = (event.keyCode ? event.keyCode : event.which);

    var position = document.getElementById("HexaInput").selectionStart, Hexa = document.getElementById("HexaInput").value, char = String.fromCharCode( Input );

    if( Input === 13 )
    {
        SubmitInput();
        return false;
    }
    else if( Input === 37 || Input === 38 || Input === 39 || Input === 40 )
        return true;
    else if( Input === 46  )
    {
        UpdateInputs( Hexa.slice( 0, position )+Hexa.slice( position+1 ), "HexaInput" );
        return false;
    }
    else if ( Input === 8 )
    {
        UpdateInputs( Hexa.slice( 0, position-1 )+Hexa.slice( position ), "HexaInput" );
        return false;
    }
    else if( !( ( Input > 47 && Input < 58 ) || ( Input > 64 && Input < 71 ) || ( Input > 96 && Input < 103 ) ) )
    {
       event.preventDefault();
       return false;
    }

    var NumHexa = parseInt( Hexa.slice( 0, position )+char+Hexa.slice( position ), 16 );

    if( NumHexa < 0 || NumHexa > 255 )
    {
       event.preventDefault();
       return false;
    }

    UpdateInputs( NumHexa, "HexaInput" );

    return true;
}

function GetBinaryInput(event)
{
    var Input = (event.keyCode ? event.keyCode : event.which);

    var position = document.getElementById("BinaryInput").selectionStart, Binary = document.getElementById("BinaryInput").value, char = String.fromCharCode( Input );
    var NumBinary = parseInt( Binary.slice( 0, position )+char+Binary.slice( position ), 2 );

    if( Input === 13 )
    {
        SubmitInput();
        event.preventDefault();
        return false;
    }
    else if( Input === 37 || Input === 38 || Input === 39 || Input === 40 )
        return true;
    else if( Input === 46  )
    {
        UpdateInputs( Binary.slice( 0, position )+Binary.slice( position+1 ), "BinaryInput" );
        return false;
    }
    else if ( Input === 8 )
    {
        UpdateInputs( Binary.slice( 0, position-1 )+Binary.slice( position ), "BinaryInput" );
        return false;
    }
    else if( Input !== 48 && Input !== 49 )
    {
       event.preventDefault();
       return false;
    }

    if( NumBinary < 0 || NumBinary > 255 )
    {
       event.preventDefault();
       return false;
    }

    UpdateInputs( NumBinary, "BinaryInput" );

    return true;
}

function GetCharInput(event)
{
    var Input = (event.keyCode ? event.keyCode : event.which);
    var Char = document.getElementById("CharInput").value, position = document.getElementById("CharInput").selectionStart;
    if( Input === 13 )
    {
        SubmitInput();
        event.preventDefault();
        return false;
    }
    else if( Input === 37 || Input === 38 || Input === 39 || Input === 40 )
        return true;
    else if( Input === 46  )
    {
        if( Char.length === 0 || position === 1)
            return false;

        UpdateInputs( '', "CharInput" );
        return false;
    }
    else if ( Input === 8 )
    {
        if( Char.length === 0 || position === 0)
            return false;

        UpdateInputs( '', "CharInput" );
        return false;
    }
    else if( Char.length > 0 )
    {
       event.preventDefault();
       return false;
    }

    UpdateInputs( Input, "CharInput" );

    return true;
}

function UpdateInputs( code, Base )
{
    var Hexa, Deci, Binary, Char;

    if( Base === "HexaInput" )
        Deci = parseInt( ""+code, 10 );
    else if( Base === "CharInput" )
        Deci = code;
    else if( Base === "BinaryInput" )
        Deci = parseInt( ""+code );
    else
        Deci = code;

    Deci = Math.round(Deci);
    Hexa = Number(Deci).toString(16);
    Binary = Number(Deci).toString(2);
    Char = String.fromCharCode(Number(Deci));

    if( code === '' )
        Hexa = Deci = Binary = Char = '';
    if( Base !== "DeciInput" )
        document.getElementById("DeciInput").value = Deci ;
    if( Base !== "HexaInput" )
        document.getElementById("HexaInput").value = Hexa ;
    if( Base !== "BinaryInput" )
        document.getElementById("BinaryInput").value = Binary ;
    if( Base !== "CharInput" )
        document.getElementById("CharInput").value = Char ;
}

function SubmitInput()
{
    var Deci = document.getElementById("DeciInput").value;

    if( Deci.length === 0 )
        return false;
    else
    {
        Deci = Math.round( Deci );
        Input = String.fromCharCode( Number(Deci) );
        Cells[Pointer_Position] = Number(Deci);

        document.getElementById("Console").value += String.fromCharCode(Deci);

        if( Status === "Run" || Status === "Steps" )
        {
            DrawText(Pointer_Position, Cells[Pointer_Position]);
        }
        ++i;
        RemoveInputs();
        if (Status === "Run")
        {
            setStatus(" playing code ...");
            Execute();
        }
        else if (Status === "Steps")
        {
            ExecuteStep();
        }
        else if (Status === "Output")
        {
            setStatus(" analizing code ...");
            Output();
        }
    }
}

function Steps()
{
    var temp = Status;

    if (Status === "Run")
		{
        Status = "Steps";
        PauseRun();
    }
		else if (Status === "Pause")
		{
        Status = "Steps";
    }
		else if (Status !== "Steps")
		{
        ResetCell();
        ResetConsole();

        Code = document.getElementById("Editor").value;
        i = 0;
        Status = "Steps";

        MovePointer(0);
    }

    if (i < Code.length)
        ExecuteStep();
    else if (temp === "Run" || temp === "Pause")
        Status = "Pause";
    else
    {
        ResetBuffer();
    }
}

function Output()
{
    if (Status !== "Output")
		{
        Reset();

        $("#Console").prop("readonly", true);
        Code = document.getElementById("Editor").value;
        Delay = 300;
        i = 0;
        Status = "Output";
        Top = -1;
        OutputStartTime = new Date();
        setStatus( "analyzing code ..." );
    }

    var res, position;

    setTimeout(Outputloop(), 5);
}

function Outputloop()
{
    setTimeout(function()
		{
        res = ExecuteStep();

        if (i >= Code.length)
				{
            CheckMeasures();
            DrawCanvas();
            MovePointer(Pointer_Position);

            console.log( "Final Output: "+document.getElementById("Console").value );

            setStatus( "" );

            var curTime = new Date(), TimeTaken = curTime-OutputStartTime;
            AppendToConsole( "\nFinished @["+(TimeTaken/1000)+"s]." );

            ResetBuffer();
            return;
        }
				else if (res !== false)
            i = res;
        else
				{
            return;
        }

        Outputloop();
    }, 0.2);
}

function ResetBuffer()
{
    i = 0;
    Stack = [];
    CloseBracket = [];
    OpenBracket = [];
    Code = "";
    Status = "";
    Top = -1;
    Bracket = [];
    ConsoleOutput = "";
}

function ResetCell()
{
    Executed = 0;
    Pointer_Position = 0;
    Cells = new Array(100).fill(0);
    Measures = new Array(100).fill(Size);

    Positions = new Array(100);
    for (var i = 0; i < Max; i++)
        Positions[i] = X + (Size / 2 - 5) + Size * i;

    Offset = 0;
    DrawCanvas();
}

function ResetConsole()
{
    document.getElementById("Console").value = "";
    setStatus( "" );
    //$("Console").prop( "readonly", true );
}

function Reset()
{
    ResetCell();
    ResetConsole();
    ResetBuffer();

    RemoveInputs();
    document.getElementById("Run").style.backgroundImage = "url('Images/Run.png')";

    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i <= highestTimeoutId; i++) {
        clearTimeout(i);
    }
}

function DrawCanvas(Flag = true)
{
    var Board = document.getElementById("Canvas");
    var Context = Board.getContext("2d");
    var cur_x = X;

    Context.clearRect(0, 0, Board.width, Board.height);
    Context.beginPath();
    Context.lineWidth = "2";

    for (var i = 0; i < Max; i++)
		{
        Context.strokeStyle = "#999999";
        Context.rect(Offset + cur_x, Y, Measures[i], Size);
        cur_x += Measures[i];

        DrawText(i, Cells[i]);
        Context.stroke();
    }

    DrawPointer(Positions[Pointer_Position]);
}

function CheckMeasures()
{

    var Board = document.getElementById("Canvas");
    var Context = Board.getContext("2d"),
        Width, Delta;

    Context.font = "20px Arial";

    for (var i = 0; i < Max; i++) {
        Width = parseInt(25 + Context.measureText("" + Cells[i]).width + Context.lineWidth * 2, 10);

        if (Width !== Measures[i] && Width > Size) {
            Delta = Width - Measures[i];
            Measures[i] = Width;
            Positions[i] = (i === 0 ? X : SumUp(Measures, 0, i)) + Width / 2 - 5;

            for (var j = i + 1; j < Max; j++)
                Positions[j] += Delta;
        }
    }
}

function DrawText(Position, Value, Canvas = true)
{
    var Board = document.getElementById("Canvas");
    var Context = Board.getContext("2d"),
        Width, Delta;

    Context.font = "20px Arial";
    Context.clearRect(Offset + X + 1 + SumUp(Measures, 0, Position) + Context.lineWidth,
        Y + Context.lineWidth + 3, Measures[Position] - Context.lineWidth * 2 - 2, Size - Context.lineWidth * 2 - 3);

    Width = parseInt(25 + Context.measureText("" + Value).width + Context.lineWidth * 2, 10);
    if (Width !== Measures[Position] && Width > Size)
		{
        Delta = Width - Measures[Position];
        Measures[Position] = Width;
        Positions[Position] = (Position === 0 ? X : SumUp(Measures, 0, Position)) + Width / 2 - 5;

        for (var i = Position + 1; i < Max; i++)
            Positions[i] += Delta;

        DrawCanvas();

    }

    Context.fillStyle = "#262626";
    Context.fillText("" + Value, Offset + X + Measures[Position] / 2 - Context.measureText("" + Value).width / 2 + SumUp(Measures, 0, Position), Y + 26);
    Context.stroke();
}

function MovePointer(Position)
{
    var Source = Positions[Pointer_Position];
    var Destination = Positions[Position];
    var Direction = 0;

    if (Position === Pointer_Position)
        return;
    else if (Position < Pointer_Position)
        Direction = -1;
    else
        Direction = 1;

    var Delay = 5,
        i = 0;

    Move(0);

    function Move(i)
		{
        setTimeout(function()
				{
            DrawPointer(Source + Direction * (i + 1));

            if (i < Math.abs(Destination - Source))
                Move(i + 1);

        }, Delay);
    }
    Pointer_Position = Position;
}

function DrawPointer(Pixel)
{
    var Board = document.getElementById("Canvas");
    var Context = Board.getContext("2d");

    Context.clearRect(0, Y + Size + 2, Start_Position + (Max + 1) * Size, PointerHeight);
    Context.fillStyle = "#0086b3";

    Context.beginPath();
    Context.moveTo(Offset + Pixel + 5, PointerHeight);
    Context.lineTo(Offset + Pixel + 1, PointerHeight + 5);
    Context.lineTo(Offset + Pixel + 9, PointerHeight + 5);
    Context.closePath();

    Context.lineWidth = 0;
    Context.strokeStyle = '#0086b3';
    Context.stroke();

    Context.fill();
    Context.fillRect(Offset + Pixel - 1, PointerHeight + 5, 12, 15);
    Context.stroke();
}

function LArrow()
{
    if (Offset === 0)
    ;
    var Limit = Offset + Size * ShiftLength,
        Delta = 30;

    if (Offset === 0)
        return;

    loop();
    function loop()
		{
        setTimeout(function()
				{
            if (Offset <= Limit)
						{
                Offset += Delta;
                DrawCanvas();
                loop();
            }
        }, 10);
    }

}

function RArrow()
{
    var Limit = Offset - ShiftLength * Size,
        Delta = 30;

    loop();
    function loop()
		{
        setTimeout(function()
				{
            if (Offset >= Limit)
						{
                Offset -= Delta;
                DrawCanvas();
                loop();
            }
        }, 10);
    }

}

function GetChar(Text)
{
    while (i < Text.length)
		{
        if (Text[i] !== '>' && Text[i] !== '<' && Text[i] !== '+' && Text[i] !== '-' && Text[i] !== '[' && Text[i] !== ']' && Text[i] !== '.' && Text[i] !== ',')
				{
            ++i;
        }
				else
				{
            return Text[i];
        }
    }
    return false;
}

$.fn.selectRange = function(start, end)
{
    var e = document.getElementById($(this).attr('id')); // I don't know why... but $(this) don't want to work today :-/

		if (!e)
				return;
    else if (e.setSelectionRange)
		{
        e.focus();
        e.setSelectionRange(start, end);
    }
    else if (e.createTextRange)
		{
        var range = e.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
    else if (e.selectionStart)
		{
        e.selectionStart = start;
        e.selectionEnd = end;
    }
};

function SumUp(Input, StartPosition, EndPosition)
{
    var sum = 0;
    for (var i = StartPosition; i < EndPosition; i++)
        sum += Input[i];
    return sum;
}

function Sleep(milliseconds)
{
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++)
		{
        if ((new Date().getTime() - start) > milliseconds)
				{
            break;
        }
    }
}

function Error(Msg)
{
    document.getElementById("Console").value += Msg;
}

function Tutorials()
{
    document.location.href = "Tutorials.html";
}

function GetBrowser()
{
    if ((isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) === true)
        return "opera";

    if ((isFirefox = typeof InstallTrigger !== 'undefined') === true)
        return "firefox";

    if ((isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
            (function(p)
						{
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window['safari'] ||
                safari.pushNotification)) === true)
        return "safari";

    if ((isIE = false || !!document.documentMode) === true)
        return "ie";

    if ((isEdge = !isIE && !!window.StyleMedia) === true)
        return "edge";

    if ((isChrome = !!window.chrome && !!window.chrome.webstore) === true)
        return "chrome";

    if ((isBlink = (isChrome || isOpera) && !!window.CSS) === true)
        return "blink";
}

function GetPlatform()
{
    return navigator.platform;
}
