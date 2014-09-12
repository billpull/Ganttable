/*Canvas Grid Test1*/
console.log("in script");

//create global namespace
var Gsettings, Ganttable = {

    settings: {
        theme: "standard",
        container: null,
        db: null,
        defaultContext: 0
    },

    constants: {
        //static month data
        MONTHS: [
            ["Janurary", 31],
            ["Feburary", 28],
            ["March", 31],
            ["April", 30],
            ["May", 31],
            ["June", 30],
            ["July", 31],
            ["August", 31],
            ["September", 30],
            ["October", 31],
            ["November", 30],
            ["December", 31]
        ],
        //static week data
        WEEKS: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
        //static day data
        DAYS: ["Su", "M", "Tu", "W", "Th", "F", "Sa"],
        //Unit Enum
        UnitEnum: {WEEK_UNIT: 12, MONTH_UNIT: 12, QUARTER_UNIT: 12},
        //Context Enum
        ContextEnum: {DAY: 0, WEEK: 1, MONTH: 2, QUARTER: 3},

        VERSION: "1.0.0"

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
        //last menu option selected
        lastMenu: null

    },

    nav: {
        //Current gantt timeline context
        context: null,
        //Current day count past current
        dCnt: 0,
        //Current week count past current
        wCnt: 0,
        //Current month count past current
        mCnt: 0,
        //Current quarter count past current
        qCnt: 0
    },

    init: function () {
        console.log("init");

        Ganttable.settings.container = $("#Ganttable")[0];

        //setup container UI
        Ganttable.setupUI();

        Ganttable.setupGrid();

        //this.setupGantt();

        //Gsettings = this.settings;

        //TODO: build UI
        //TODO: bind UI actions
    },

    setupUI: function () {
        console.log("setting up UI");

        //set margin of main container
        //this.container.style.margin = "2px";
        //set width of main container
        Ganttable.settings.container.style.width = "100%";
        Ganttable.settings.container.style.margin = "0px";

        //append gantt grid
        var menu_grid = document.createElement("table");

        menu_grid.style.border = 1;
        menu_grid.style.width = "100%";

        //row for the entire menu bar
        var menubar = document.createElement("tr");
        menubar.id = "menubar";
        menubar.style.width = "100%";
        menubar.style.height = "20px";

        //logo column
        var logo = document.createElement("td");
        logo.id = "logo";
        logo.style.backgroundColor = "Black";
        logo.style.width = "100px";
        logo.innerHTML = "Ganttable";
        logo.style.color = "White";
        logo.style.textAlign = "Center";
        logo.style.fontStyle = "italic";

        //file menubar option + actual menu
        var file = document.createElement("td");
        file.id = "file";
        file.style.backgroundColor = "Black";
        file.style.width = "60px";
        file.innerHTML = "File";
        file.style.color = "White";
        file.style.textAlign = "Center";
        file.style.cursor = "pointer";

        var file_menu = document.createElement("div");
        file_menu.style.visibility = "hidden";
        file_menu.style.position = "absolute";
        file_menu.style.margin = "0px";
        file_menu.style.marginTop = "1px";
        file_menu.style.marginLeft = "-1px";
        file_menu.style.padding = "0px";
        file_menu.style.backgroundColor = "Gray";
        file_menu.id = "file_menu";
        file_menu.style.cursor = "pointer";

        var file_list = document.createElement("table");
        file_list.id = "file_list";
        file_list.style.color = "White";
        file_list.style.width = "100%";
        file_list.style.border = "none";
        file_list.style.borderSpacing = "0px";

        //TBD
        var file_option_1 = document.createElement("td");
        file_option_1.innerHTML = "Item 1";
        file_option_1.id = "file_option_1";
        file_option_1.style.padding = "5px";
        file_option_1.onmouseover = function() {
            file_option_1.style.color = "Black";
            file_option_1.style.backgroundColor = "LightGray";
        };
        file_option_1.onmouseout = function() {
            file_option_1.style.color = "White";
            file_option_1.style.backgroundColor = "Gray";
        };

        //TBD
        var file_option_2 = document.createElement("td");
        file_option_2.innerHTML = "Item 2";
        file_option_2.id = "file_option_2";
        file_option_2.style.padding = "5px";
        file_option_2.onmouseover = function() {
            file_option_2.style.color = "Black";
            file_option_2.style.backgroundColor = "LightGray";
        };
        file_option_2.onmouseout = function() {
            file_option_2.style.color = "White";
            file_option_2.style.backgroundColor = "Gray";
        };

        //TBD
        var file_option_3 = document.createElement("td");
        file_option_3.innerHTML = "Item 3";
        file_option_3.id = "file_option_3";
        file_option_3.style.padding = "5px";
        file_option_3.onmouseover = function() {
            file_option_3.style.color = "Black";
            file_option_3.style.backgroundColor = "LightGray";
        };
        file_option_3.onmouseout = function() {
            file_option_3.style.color = "White";
            file_option_3.style.backgroundColor = "Gray";
        };

        var file_row_1 = document.createElement("tr");
        file_row_1.appendChild(file_option_1);

        var file_row_2 = document.createElement("tr");
        file_row_2.appendChild(file_option_2);

        var file_row_3 = document.createElement("tr");
        file_row_3.appendChild(file_option_3);

        file_list.appendChild(file_row_1);
        file_list.appendChild(file_row_2);
        file_list.appendChild(file_row_3);

        file_menu.appendChild(file_list);

        file.appendChild(file_menu);

        //edit menubar option + actual menu
        var edit = document.createElement("td");
        edit.id = "edit";
        edit.style.backgroundColor = "Black";
        edit.style.width = "60px";
        edit.innerHTML = "Edit";
        edit.style.color = "White";
        edit.style.textAlign = "Center";
        edit.style.cursor = "pointer";

        var edit_menu = document.createElement("div");
        edit_menu.style.visibility = "hidden";
        edit_menu.style.position = "absolute";
        edit_menu.style.margin = "0px";
        edit_menu.style.marginTop = "1px";
        edit_menu.style.marginLeft = "-1px";
        edit_menu.style.padding = "0px";
        edit_menu.style.backgroundColor = "Gray";
        edit_menu.id = "edit_menu";
        edit_menu.style.cursor = "pointer";

        var edit_list = document.createElement("table");
        edit_list.id = "edit_list";
        edit_list.style.color = "White";
        edit_list.style.width = "100%";
        edit_list.style.border = "none";
        edit_list.style.borderSpacing = "0px";

        //TBD
        var edit_option_1 = document.createElement("td");
        edit_option_1.innerHTML = "Item 1";
        edit_option_1.id = "edit_option_1";
        edit_option_1.style.padding = "5px";
        edit_option_1.onmouseover = function() {
            edit_option_1.style.color = "Black";
            edit_option_1.style.backgroundColor = "LightGray";
        };
        edit_option_1.onmouseout = function() {
            edit_option_1.style.color = "White";
            edit_option_1.style.backgroundColor = "Gray";
        };


        //TBD
        var edit_option_2 = document.createElement("td");
        edit_option_2.innerHTML = "Item 2";
        edit_option_2.id = "edit_option_2";
        edit_option_2.style.padding = "5px";
        edit_option_2.onmouseover = function() {
            edit_option_2.style.color = "Black";
            edit_option_2.style.backgroundColor = "LightGray";
        };
        edit_option_2.onmouseout = function() {
            edit_option_2.style.color = "White";
            edit_option_2.style.backgroundColor = "Gray";
        };

        //TBD
        var edit_option_3 = document.createElement("td");
        edit_option_3.innerHTML = "Item 3";
        edit_option_3.id = "edit_option_3";
        edit_option_3.style.padding = "5px";
        edit_option_3.onmouseover = function() {
            edit_option_3.style.color = "Black";
            edit_option_3.style.backgroundColor = "LightGray";
        };
        edit_option_3.onmouseout = function() {
            edit_option_3.style.color = "White";
            edit_option_3.style.backgroundColor = "Gray";
        };

        var edit_row_1 = document.createElement("tr");
        edit_row_1.appendChild(edit_option_1);

        var edit_row_2 = document.createElement("tr");
        edit_row_2.appendChild(edit_option_2);

        var edit_row_3 = document.createElement("tr");
        edit_row_3.appendChild(edit_option_3);

        edit_list.appendChild(edit_row_1);
        edit_list.appendChild(edit_row_2);
        edit_list.appendChild(edit_row_3);

        edit_menu.appendChild(edit_list);

        edit.appendChild(edit_menu);

        var tools = document.createElement("td");
        tools.id = "tools";
        tools.style.backgroundColor = "Black";
        tools.style.width = "60px";
        tools.innerHTML = "Tools";
        tools.style.color = "White";
        tools.style.textAlign = "Center";
        tools.style.cursor = "pointer";

        var tools_menu = document.createElement("div");
        tools_menu.style.visibility = "hidden";
        tools_menu.style.position = "absolute";
        tools_menu.style.margin = "0px";
        tools_menu.style.marginTop = "1px";
        tools_menu.style.marginLeft = "-1px";
        tools_menu.style.padding = "0px";
        tools_menu.style.backgroundColor = "Gray";
        tools_menu.id = "tools_menu";
        tools_menu.style.cursor = "pointer";

        var tools_list = document.createElement("table");
        tools_list.id = "tools_list";
        tools_list.style.color = "White";
        tools_list.style.width = "100%";
        tools_list.style.border = "none";
        tools_list.style.borderSpacing = "0px";

        //TBD
        var tools_option_1 = document.createElement("td");
        tools_option_1.innerHTML = "Item 1";
        tools_option_1.id = "tools_option_1";
        tools_option_1.style.padding = "5px";
        tools_option_1.onmouseover = function() {
            tools_option_1.style.color = "Black";
            tools_option_1.style.backgroundColor = "LightGray";
        };
        tools_option_1.onmouseout = function() {
            tools_option_1.style.color = "White";
            tools_option_1.style.backgroundColor = "Gray";
        };

        var tools_row_1 = document.createElement("tr");
        tools_row_1.appendChild(tools_option_1);

        //TBD
        var tools_option_2 = document.createElement("td");
        tools_option_2.innerHTML = "Item 2";
        tools_option_2.id = "tools_option_2";
        tools_option_2.style.padding = "5px";
        tools_option_2.onmouseover = function(){
            tools_option_2.style.color = "Black";
            tools_option_2.style.backgroundColor = "LightGray";
        };
        tools_option_2.onmouseout = function() {
            tools_option_2.style.color = "White";
            tools_option_2.style.backgroundColor = "Gray";
        };

        var tools_row_2 = document.createElement("tr");
        tools_row_2.appendChild(tools_option_2);

        //TBD
        var tools_option_3 = document.createElement("td");
        tools_option_3.innerHTML = "Item 3";
        tools_option_3.id = "tools_option_3";
        tools_option_3.style.padding = "5px";
        tools_option_3.onmouseover = function(){
            tools_option_3.style.color = "Black";
            tools_option_3.style.backgroundColor = "LightGray";
        };
        tools_option_3.onmouseout = function() {
            tools_option_3.style.color = "White";
            tools_option_3.style.backgroundColor = "Gray";
        };

        var tools_row_3 = document.createElement("tr");
        tools_row_3.appendChild(tools_option_3);

        tools_list.appendChild(tools_row_1);
        tools_list.appendChild(tools_row_2);
        tools_list.appendChild(tools_row_3);

        tools_menu.appendChild(tools_list);

        tools.appendChild(tools_menu);

        var help = document.createElement("td");
        help.id = "about";
        help.style.backgroundColor = "Black";
        help.style.width = "60px";
        help.innerHTML = "Help";
        help.style.color = "White";
        help.style.textAlign = "Center";
        help.style.cursor = "pointer";

        var help_menu = document.createElement("div");
        help_menu.style.visibility = "hidden";
        help_menu.style.position = "absolute";
        help_menu.style.margin = "0px";
        help_menu.style.marginTop = "1px";
        help_menu.style.marginLeft = "-1px";
        help_menu.style.padding = "0px";
        help_menu.style.backgroundColor = "Gray";
        help_menu.id = "help_menu";
        help_menu.style.cursor = "pointer";

        var help_list = document.createElement("table");
        help_list.id = "help_list";
        help_list.style.color = "White";
        help_list.style.width = "100%";
        help_list.style.border = "none";
        help_list.style.borderSpacing = "0px";


        //TBD
        var help_option_1 = document.createElement("td");
        help_option_1.innerHTML = "Item 1";
        help_option_1.id = "help_option_1";
        help_option_1.style.padding = "5px";
        help_option_1.onmouseover = function(){
            help_option_1.style.color = "Black";
            help_option_1.style.backgroundColor = "LightGray";
        };
        help_option_1.onmouseout = function() {
            help_option_1.style.color = "White";
            help_option_1.style.backgroundColor = "Gray";
        };

        //TBD
        var help_option_2 = document.createElement("td");
        help_option_2.innerHTML = "Item 2";
        help_option_2.id = "help_option_2";
        help_option_2.style.padding = "5px";
        help_option_2.onmouseover = function(){
            help_option_2.style.color = "Black";
            help_option_2.style.backgroundColor = "LightGray";
        };
        help_option_2.onmouseout = function() {
            help_option_2.style.color = "White";
            help_option_2.style.backgroundColor = "Gray";
        };

        //TBD
        var help_option_3 = document.createElement("td");
        help_option_3.innerHTML = "Item 3";
        help_option_3.id = "help_option_3";
        help_option_3.style.padding = "5px";
        help_option_3.onmouseover = function(){
            help_option_3.style.color = "Black";
            help_option_3.style.backgroundColor = "LightGray";
        };
        help_option_3.onmouseout = function() {
            help_option_3.style.color = "White";
            help_option_3.style.backgroundColor = "Gray";
        };

        var help_row_1 = document.createElement("tr");
        help_row_1.appendChild(help_option_1);

        var help_row_2 = document.createElement("tr");
        help_row_2.appendChild(help_option_2);

        var help_row_3 = document.createElement("tr");
        help_row_3.appendChild(help_option_3);

        help_list.appendChild(help_row_1);
        help_list.appendChild(help_row_2);
        help_list.appendChild(help_row_3);

        help_menu.appendChild(help_list);

        help.appendChild(help_menu);

        //menu_devoid takes up the empty space to effectively left align the menu
        var menu_devoid = document.createElement("td");
        menu_devoid.id = "menu_devoid";
        menu_devoid.style.backgroundColor = "Black";
        menu_devoid.style.width = "auto";

        file.onmouseover = function() { Ganttable.showMenu(file_menu.id); };
        file.onmouseout = function() { Ganttable.hideMenu(); };

        edit.onmouseover = function() { Ganttable.showMenu(edit_menu.id); };
        edit.onmouseout = function() { Ganttable.hideMenu(); };

        tools.onmouseover = function() { Ganttable.showMenu(tools_menu.id); };
        tools.onmouseout = function() { Ganttable.hideMenu(); };

        help.onmouseover = function() { Ganttable.showMenu(help_menu.id); };
        help.onmouseout = function() { Ganttable.hideMenu(); };

        menubar.appendChild(logo);
        menubar.appendChild(file);
        menubar.appendChild(edit);
        menubar.appendChild(tools);
        menubar.appendChild(help);
        menubar.appendChild(menu_devoid);

        menu_grid.appendChild(menubar);


        //----------CONTEXT MENU

        var context_grid = document.createElement("table");
        context_grid.style.width = "100%";

        //contextbar controls current grid timeline context
        var contextbar = document.createElement("tr");
        contextbar.id = "contextbar";
        contextbar.style.color = "White";
        contextbar.style.height = "20px";

        //context_devoid basically takes up the remaining space to right align the context options
        var context_devoid = document.createElement("td");
        context_devoid.id = "context_devoid";
        context_devoid.style.backgroundColor = "LightBlue";
        context_devoid.style.width = "auto";

        var day_context = document.createElement("td");
        day_context.id = "day_context";
        day_context.style.backgroundColor = "LightBlue";
        day_context.style.width = "60px";
        day_context.innerHTML = "Day";
        day_context.style.color = "White";
        day_context.style.textAlign = "Center";
        day_context.style.cursor = "pointer";
        day_context.onmouseover = function() {
            day_context.style.backgroundColor = "Blue";
        };
        day_context.onmouseout = function() {
            day_context.style.backgroundColor = "LightBlue";
        };

        var week_context = document.createElement("td");
        week_context.id = "day_context";
        week_context.style.backgroundColor = "LightBlue";
        week_context.style.width = "60px";
        week_context.innerHTML = "Week";
        week_context.style.color = "White";
        week_context.style.textAlign = "Center";
        week_context.style.cursor = "pointer";
        week_context.onmouseover = function() {
            week_context.style.backgroundColor = "Blue";
        };
        week_context.onmouseout = function() {
            week_context.style.backgroundColor = "LightBlue";
        };

        var month_context = document.createElement("td");
        month_context.id = "day_context";
        month_context.style.backgroundColor = "LightBlue";
        month_context.style.width = "60px";
        month_context.innerHTML = "Month";
        month_context.style.color = "White";
        month_context.style.textAlign = "Center";
        month_context.style.cursor = "pointer";
        month_context.onmouseover = function() {
            month_context.style.backgroundColor = "Blue";
        };
        month_context.onmouseout = function() {
            month_context.style.backgroundColor = "LightBlue";
        };

        var quarter_context = document.createElement("td");
        quarter_context.id = "day_context";
        quarter_context.style.backgroundColor = "LightBlue";
        quarter_context.style.width = "60px";
        quarter_context.innerHTML = "Quarter";
        quarter_context.style.color = "White";
        quarter_context.style.textAlign = "Center";
        quarter_context.style.cursor = "pointer";
        quarter_context.onmouseover = function() {
            quarter_context.style.backgroundColor = "Blue";
        };
        quarter_context.onmouseout = function() {
            quarter_context.style.backgroundColor = "LightBlue";
        };

        contextbar.appendChild(context_devoid);
        contextbar.appendChild(day_context);
        contextbar.appendChild(week_context);
        contextbar.appendChild(month_context);
        contextbar.appendChild(quarter_context);

        context_grid.appendChild(contextbar);


        //---------------------------------

        //append the grid to the Ganttable div
        Ganttable.settings.container.appendChild(menu_grid);
        Ganttable.settings.container.appendChild(context_grid);

        //set offsets
        Ganttable.globals.cw = Ganttable.settings.container.offsetWidth;
        Ganttable.globals.ch = Ganttable.settings.container.offsetHeight;
    },

    setupGrid: function () {

        //main app grid
        var app = document.createElement("table");
        app.style.tableLayout = "fixed";
        app.style.width = "100%";
        app.id = "app";

        var context_row = document.createElement("tr");
        context_row.id = "context_row";

        var search_box = document.createElement("td");
        search_box.id = "search_box";
        search_box.innerHTML = "Search";
        search_box.style.width = "400px";

        var context_area = document.createElement("div");
        context_area.id = "context_area";
        context_area.style.overflow = "auto";

        context_row.appendChild(search_box);
        context_row.appendChild(context_area);

        app.appendChild(context_row);

        Ganttable.settings.container.appendChild(app);

        //set default context
        Ganttable.adjustContext(this.settings.defaultContext);


    },

    showMenu: function(id){
        if(id) {
            console.log("mousing over: " + id);

            if (this.globals.lastMenu) {
                this.globals.lastMenu.style.visibility = "hidden";
            }

            this.globals.lastMenu = document.getElementById(id);
            this.globals.lastMenu.style.visibility = "visible";

        } else { console.log("No id passed to showMenu"); }
    },

    hideMenu: function() {
        if(this.globals.lastMenu) { this.globals.lastMenu.style.visibility = "hidden"; }
    },

    adjustContext: function(context){
        switch(context){
            case 0:
                Ganttable.clearContext();
                Ganttable.setDayContext();
                break;
            case 1:
                Ganttable.clearContext();
                Ganttable.setWeekContext();
                break;
            case 2:
                Ganttable.clearContext();
                Ganttable.setMonthContext();
                break;
            case 3:
                Ganttable.clearContext();
                Ganttable.setQuarterContext();
                break;
            default: console.log("wtf");
                break;
        }
    },

    clearContext: function() {
        //clear the current timeline context
        var context_area = document.getElementById("context_area");
        while(context_area.children.length > 0){
            context_area.removeChild(context_area.children[0]);
        }
    },

    setDayContext: function(){
        //set the timeline context to "day"

        var context_area = document.getElementById("context_area");
        var monthInfo = Ganttable.constants.MONTHS[new Date().getMonth()];

        for(var i = 0; i < monthInfo[1]; i++){
            //temp day object
            var date = new Date(new Date().getFullYear(),
                                new Date().getMonth() + Ganttable.nav.dCnt,
                                (i + 1));

            //create a day node
            var node = document.createElement("td");
            //create an id with the UTC date for that day
            node.id = Date.UTC(new Date().getFullYear(),
                                    new Date().getMonth() + Ganttable.nav.dCnt,
                                    (i + 1));

            node.style.textAlign = "center";
            node.style.width = "60px";

            var daySpan = document.createElement("span");
            daySpan.style.fontSize = "1em";
            daySpan.innerHTML = (i + 1);

            var dowSpan = document.createElement("span");
            dowSpan.style.fontSize = "1em";
            dowSpan.style.fontWeight = "bold";
            dowSpan.innerHTML = Ganttable.constants.DAYS[date.getDay()];

            node.appendChild(dowSpan);
            node.appendChild(daySpan);

            context_area.appendChild(node);
        }
    },

    setWeekContext: function(){

    },

    setMonthContext: function(){

    },

    setQuarterContext: function(){

    }

};

window.onload=function() { Ganttable.init(); };

/*function init(){
    //var canvas = document.getElementById("canvas");
    //var context = canvas.getContext("2d");
    setLayout();
    resetScaleCell();
    setScaleSubDay(new Date().getMonth(), new Date().getFullYear());
    setScaleDay(new Date().getMonth(), new Date().getFullYear());
    pos = "d";
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

*/