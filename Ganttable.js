/*Canvas Grid Test*/
console.log("in script");

//create global namespace
var Gsettings, Ganttable = {

    settings: {
        theme: "standard",
        container: $("#Ganttable"),
        db: null
    },

    globals: {
        //canvas width
        cw: 0,
        //canvas real width
        crw: 0,
        //canvas height
        ch: 0,
        //canvas real height
        crh: 0,
        //canvas margin (border)
        cm: 0,
        //header
        head: 30,
        //static month data
        MONTHS: [["Janurary", 31], ["Feburary", 28], ["March", 31], ["April", 30], ["May", 31], ["June", 30], ["July", 31], ["August", 31], ["September", 30], ["October", 31], ["November", 30], ["December", 31]],
        //static week data
        WEEKS: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
        //static day data
        DAYS: ["Su", "M", "Tu", "W", "Th", "F", "Sa"]

    },

    init: function() {
        Gsettings = this.settings;
        //TODO: build UI
        //TODO: bind UI actions
    }

};

//CONSTANTS
GanttJS.WEEK_UNIT = 12;
GanttJS.MONTH_UNIT = 12;
GanttJS.QUARTER_UNIT = 12;

//GLOBAL NAVIGATION
GanttJS.pos = "";
GanttJS.dCNT = 0;
GanttJS.wCNT = 0;
GanttJS.mCNT = 0;
GanttJS.qCNT = 0;


window.onload=function() { init(); }

function init(){
    //var canvas = document.getElementById("canvas");
    //var context = canvas.getContext("2d");
    setLayout();
    resetScaleCell();
    setScaleSubDay(new Date().getMonth(), new Date().getFullYear());
    setScaleDay(new Date().getMonth(), new Date().getFullYear());
    pos = "d"
    console.log('init completed');
}

// DEFAULT LAYOUT -----------

function setLayout(){
    //get the canvas object
    var c_div = document.getElementById("c_outer");
    c_div.setAttribute("margin", "5px");
    c_div.setAttribute("style", "width:100%");
    var grid = document.getElementById("main_grid");
    grid.setAttribute("style", "width:100%");
    //find canvas dimentions and apply desired margins
    cw = c_div.offsetWidth;
    ch = c_div.offsetHeight;

    //c_div.style.margin= cm+"px";

    //build the scope/menu controller
    buildScopeControl();

    //task column width
    var row2void1 = document.getElementById("row2void1");
    row2void1.setAttribute("width", "200px");
    var left_control = document.getElementById("row1void1");
    var right_control = document.getElementById("controlRight");

    var arrow_span_left = document.createElement("span");
    arrow_span_left.setAttribute("style", "font-size:1em; font-weight:bold; float:left");
    arrow_span_left.setAttribute("onclick", "navMoveBackward()");
    arrow_span_left.innerHTML='&larr;';
    var arrow_span_right = document.createElement("span");
    arrow_span_right.setAttribute("style", "font-size:1em; font-weight:bold; float:right");
    arrow_span_right.setAttribute("onclick", "navMoveForward()");
    arrow_span_right.innerHTML='&rarr;';

    left_control.appendChild(arrow_span_left);
    //right_control.appendChild(arrow_span_right);

    console.log('layout set');
}

// END DEFAULT LAYOUT ------------

// RESET FUNCTIONS ---------

function changeScope(sel){
    console.log('changing context: ' + sel.options[sel.selectedIndex].value);
    switch(sel.options[sel.selectedIndex].value){
        case "d":
            //TODO change to day context
            resetScaleCell();
            resetSubScaleCell();
            setScaleSubDay(new Date().getMonth(), new Date().getFullYear());
            setScaleDay(new Date().getMonth(), new Date().getFullYear());
            pos = "d";
            break;
        case "w":
            //TODO change to week context
            resetScaleCell();
            resetSubScaleCell();
            setScaleSubWeek(new Date().getMonth(), new Date().getFullYear());
            setScaleWeek(new Date().getMonth(), new Date().getFullYear());
            pos = "w";
            break;
        case "m":
            //TODO change to month context
            break;
        case "q":
            //TODO change to quarter context
            break;
    }
}

function resetScaleCell(){
    var scale = document.getElementById("r_scale");
    if(scale.children.length > 1){
        while(scale.children.length > 1){
            scale.removeChild(document.getElementById(scale.children[1].id));
        }
    }
}

function resetSubScaleCell(){
    var sub_scale = document.getElementById("r_scale_div");
    if(sub_scale.children.length > 1){
        while(sub_scale.children.length > 1){
            sub_scale.removeChild(document.getElementById(sub_scale.children[1].id));
        }
    }
}

// END RESET FUNCTIONS ---------

// GENERAL NAVIATION CONTROLS ---------

function buildScopeControl(){
    var r_menu = document.getElementById("r_menu");
    var node = document.createElement("td");
    node.setAttribute("id", "c_menu");
    node.setAttribute("colspan", 100);
    var form = document.createElement("form");
    node.setAttribute("id", "scope_form");
    var select = document.createElement("select");
    select.setAttribute("id", "scope_list");
    select.setAttribute("onchange", "changeScope(this)");
    var scopes = new Array(new Array("Month", "d"), new Array("3 Month", "w"), new Array("Year", "m"), new Array("Quarters", "q"));
    for(var i = 0; i < scopes.length; i++){
        var option = document.createElement("option");
        option.innerHTML=scopes[i][0];
        option.setAttribute("value", scopes[i][1]);
        select.appendChild(option);
    }
    form.appendChild(select);
    node.appendChild(form);
    r_menu.appendChild(node);

}

function setRightNavControl(){
//because of they way I build the sub-scale header dynamically, i need to add the forward arrow post
//process

    var sub_scale = document.getElementById("r_scale_div");
    var node = document.createElement("td");
    var arrow_span_right = document.createElement("span");
    node.setAttribute("id", "navRight");
    arrow_span_right.setAttribute("style", "font-size:1em; font-weight:bold; float:right");
    arrow_span_right.setAttribute("onclick", "navMoveForward()");
    arrow_span_right.innerHTML='&rarr;';

    node.appendChild(arrow_span_right);
    sub_scale.appendChild(node);

}

function navMoveForward(){
    switch(pos){
        case "d":
            //if(((dCNT+1) + new Date().getMonth()) > 11){
            //	dCNT = (new Date().getMonth()) * -1;
            //}// else { dCNT++; }
            dCNT++;
            resetScaleCell();
            resetSubScaleCell();
            setScaleSubDay((new Date().getMonth() + Math.abs(dCNT)) % MONTH_UNIT);
            setScaleDay((((new Date().getMonth()) + Math.abs(dCNT)) % MONTH_UNIT), new Date().getFullYear());
            break;
        case "w":
            wCNT++;
            console.log('wCNT: ' + wCNT);
            resetScaleCell();
            resetSubScaleCell();
            setScaleSubWeek((new Date().getMonth() + Math.abs(wCNT)) % MONTH_UNIT);
            setScaleWeek((new Date().getMonth() + Math.abs(wCNT)) % MONTH_UNIT);
            break;
        case "m":
            break;
        case "q":
            break;
    }
}

function navMoveBackward(){
    switch(pos){
        case "d":
            //if(((dCNT-1) + new Date().getMonth()) < 0){
            //	dCNT = (11 - new Date().getMonth());
            //}
            //else { dCNT--; }
            dCNT--;
            console.log('dCNT: ' + dCNT);
            resetScaleCell();
            resetSubScaleCell();
            setScaleSubDay((new Date().getMonth() + Math.abs(dCNT)) % MONTH_UNIT);
            setScaleDay((((new Date().getMonth()) + Math.abs(dCNT)) % MONTH_UNIT), new Date().getFullYear());
            break;
        case "w":
            wCNT--;
            console.log('wCNT: ' + wCNT);
            resetScaleCell();
            resetSubScaleCell();
            setScaleSubWeek((new Date().getMonth() + Math.abs(wCNT)) % MONTH_UNIT);
            setScaleWeek((new Date().getMonth() + Math.abs(wCNT)) % MONTH_UNIT);
            break;
        case "m":
            break;
        case "q":
            break;
    }
}

// END GENERAL NAVIGATION ----------

function setScaleSubDay(m, y){
    //resetScaleCell()
    var row1 = document.getElementById("r_scale_div");
    var node = document.createElement("td");
    node.setAttribute("id", "c_month");
    var text = document.createElement("span");
    text.setAttribute("style", "font-family:'Tahoma'; font-size: 1em");
    text.innerHTML=MONTHS[m][0];
    node.appendChild(text);
    row1.appendChild(node);
    console.log('sub scale month set');
    setRightNavControl();
}

function setScaleSubWeek(m, y){
//TODO scale for the for weeks of a given month
    var row1 = document.getElementById("r_scale_div");

    for(var i = -1; i < 2; i++){
        var node = document.createElement("td");
        var text = document.createElement("span");
        text.setAttribute("style", "font-family:'Tahoma'; font-size: 1em");
        node.setAttribute("colspan", 4);
        node.setAttribute("id", "m"+(m+i)+"y"+y);
        if((m+i) < 0){
            text.innerHTML = MONTHS[11][0];
        } else if ((m+i) > 11){
            text.innerHTML = MONTHS[0][0];
        } else {
            text.innerHTML = MONTHS[m + i][0];
        }
        node.appendChild(text);
        row1.appendChild(node);
    }

    setRightNavControl();
}

function setScaleSubMonth(y){
//TODO scale for the months of a given year
}

function setScaleSubQuarter(y){
//TODO scale for the quarters of a given year
}

//sets the scale of grid to given month/year
function setScaleDay(m, y){
    //seperating out all of the scales, complexity of one method getting dumb
    var scale_cell = document.getElementById("r_scale");
    var scale_void1 = document.getElementById("row2void1");
    var sub_scale = document.getElementById("c_month");
    //number of days in chosen month
    var d = MONTHS[m][1];
    console.log(d + ' days');
    //size of each time unit cell based on task size cells (left)
    //var l = (cw-parseInt(scale_void1.width, 10))/d;
    //TODO need to rethink this sizing scheme
    var l = 35;
    //iterate through each day and assign unique ids to all
    for(var i = 0; i < d; i++){
        var node = document.createElement("td");
        node.setAttribute("id", ("d"+i+"m"+m+"y"+y));
        //node.setAttribute(s"width", l);
        node.setAttribute("style", "text-align:center");
        console.log('l: ' + l);
        var date = new Date(y, m, i + 1);
        var w_wrapper = document.createElement("div");
        w_wrapper.setAttribute("id", "w_wrapper");
        w_wrapper.setAttribute("style", "min-width:"+l+"px");
        var d_num = document.createElement("span");
        d_num.setAttribute("style", "font-family:'Tahoma'; font-weight:bold; font-size: .8em");
        d_num.innerHTML=i+1;
        var d_name = document.createElement("span");
        d_name.setAttribute("style", "font-family:'Tahoma'; font-size: .8em");
        d_name.innerHTML=DAYS[date.getDay()];
        w_wrapper.appendChild(d_num);
        w_wrapper.appendChild(d_name);
        node.appendChild(w_wrapper);
        scale_cell.appendChild(node);
        console.log(i);
    }
    sub_scale.setAttribute("colspan", d);
    console.log('month scale set');
}

function setScaleWeek(m, y){
//TODO scale for the week of a given month and year
    var scale_cell = document.getElementById("r_scale");
    var scale_void1 = document.getElementById("row2void1");
    var sub_scale = document.getElementById("row1title");

    var l = (cw - parseInt(scale_void1.width, 10)) / WEEK_UNIT;

    for(var i = 0; i < WEEK_UNIT; i++){
        var node = document.createElement("td");
        node.setAttribute("id", ("w"+i+"m"+m+"y"+y));
        node.setAttribute("style", "text-align:center");
        console.log('l: ' + l);
        var date = new Date();
        var w_wrapper = document.createElement("div");
        w_wrapper.setAttribute("id", "w_wrapper");
        w_wrapper.setAttribute("style", "min-width:"+l+"px");
        var d_name = document.createElement("span");
        d_name.setAttribute("style", "font-family:'Tahoma'; font-size: .8em");
        d_name.innerHTML = WEEKS[i%4];
        w_wrapper.appendChild(d_name);
        node.appendChild(w_wrapper);
        scale_cell.appendChild(node);
    }

}

function setScaleMonth(y){
//TODO scale for the month of a given yer
}

function setScaleQuarter(y){
//TODO scale for the quarter of a given year
}