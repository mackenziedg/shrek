var section = d3.select("#content")
              .append("div")
              .attr("class", "section center black tk-futura-pt")
              .attr("style", "position:relative; background-color:#F7F7F7;");

var w = section.node().getBoundingClientRect().width;
var h = 500;

var svg = section.append("svg")
          .attr("width", w)
          .attr("height", h);

var evil_colors = {"0": "#f7c0bb", "1": "#8690ff"};
var main_colors = {"0": "#f7c0bb", "1": "#acd0f4"};
var first_app_colors = {"1": "#f7c0bb", "2": "#8690ff", "3": "#7fd4c1"};

var char_desc = {
    "GINGY": {"evil": "0", "main": "0", "first_app": "1", "visible": "1"},
    "RAPUNZEL": {"evil": "1", "main": "1", "first_app": "3", "visible": "1"},
    "PRINCE CHARMING": {"evil": "1", "main": "1", "first_app": "2", "visible": "1"},
    "MIRROR": {"evil": "1", "main": "0", "first_app": "1", "visible": "1"},
    "PUSS": {"evil": "0", "main": "1", "first_app": "2", "visible": "1"},
    "GUARD": {"evil": "1", "main": "0", "first_app": "1", "visible": "1"},
    "MERLIN": {"evil": "0", "main": "0", "first_app": "3", "visible": "1"},
    "QUEEN": {"evil": "0", "main": "0", "first_app": "2", "visible": "1"},
    "KING HAROLD": {"evil": "0", "main": "0", "first_app": "2", "visible": "1"},
    "FIONA": {"evil": "0", "main": "1", "first_app": "1", "visible": "1"},
    "DONKEY": {"evil": "0", "main": "1", "first_app": "1", "visible": "1"},
    "ARTIE": {"evil": "0", "main": "1", "first_app": "2", "visible": "1"},
    "SNOW WHITE": {"evil": "0", "main": "0", "first_app": "1", "visible": "1"},
    "SHREK": {"evil": "0", "main": "1", "first_app": "1", "visible": "1"},
    "ROBIN HOOD": {"evil": "1", "main": "0", "first_app": "1", "visible": "1"},
    "FARQUAAD": {"evil": "1", "main": "1", "first_app": "1", "visible": "1"},
    "FAIRY GODMOTHER": {"evil": "1", "main": "1", "first_app": "2", "visible": "1"},
    "PINOCCHIO": {"evil": "0", "main": "0", "first_app": "1", "visible": "1"}
};


d3.json("./data/shrek_all_network.json", function(err, data){
    if (err){throw err};

    var nodes = data["nodes"];
    var edges = data["edges"];
    var charge = -800;

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(edges)
                         .id(function(d,i) {
                             return d.id
                         }))
        .force("charge", d3.forceManyBody().strength(charge))
        .force("center", d3.forceCenter(w/2, h/2));

    nodes = data["nodes"]
        .filter(function(d) { return char_desc[d.id].visible=="1"});
    edges = data["edges"]
        .filter(function(d) { return (char_desc[d.source.id].visible=="1"&&char_desc[d.target.id].visible=="1")});

    var textColor = "#333";
    var highlightColor = "#000";
    var linkColor = "#000";
    var links;
    var circles;
    var names;

    function drawNetwork(cur_nodes, cur_edges){
        svg.selectAll("*").remove();

        links = svg.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(cur_edges)
            .enter()
            .append("line")
            .attr("stroke", linkColor);

        circles = svg.append("g")
            .attr("class", "node")
            .selectAll("circle")
            .data(cur_nodes)
            .enter()
            .append("circle")
            .attr("fill", function(d) {return evil_colors[char_desc[d.id].evil]})
            .attr("r", function(d) {return scaleCounts(d.word_count)})
            .attr("id", function(d){return "circle"+d.id.replace(" ", "-");}) 
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
             .on("mouseover", function(d){
                 var name = d3.select(this).attr("id").slice(6);
                 var textObj = d3.select("#text"+name);
                 highlightText(textObj);
             })
             .on("mouseout", function(d){
                 var name = d3.select(this).attr("id").slice(6);
                 var textObj = d3.select("#text"+name);
                 dehighlightText(textObj);
             });

        names = svg.append("g")
           .attr("class", "names")
           .selectAll("text")
           .data(Object.keys(char_desc))
           .enter()
           .append("text")
           .text(function(d, i){return d;})
           .attr("x", 20)
           .attr("y", function(d, i){return 20+i*18;})
           .attr("fill", textColor)
           .attr("style", function(d){return "opacity:"+(char_desc[d].visible==="1"?"1.0":"0.5")+";";})
           .attr("id", function(d){return "text"+d.replace(" ", "-");})
           .on("mouseover", function(d){
              var name = d3.select(this).attr("id").slice(4);
              var circleObj = d3.select("#circle"+name);
              highlightCircle(circleObj);
           })
           .on("mouseout", function(d){
              var name = d3.select(this).attr("id").slice(4);
              var circleObj = d3.select("#circle"+name);
              dehighlightCircle(circleObj);
           })
           .on("click", function(d){
               char_desc[d].visible = (char_desc[d].visible==="1"?"0":"1");
               var textObj = d3.select("#text"+d.replace(" ", "-"));
               var circleObj = d3.select("#circle"+d.replace(" ", "-"));
               swapTextOpacity(textObj);

               nodes = data["nodes"]
                       .filter(function(d) { return char_desc[d.id].visible=="1"});
               edges = data["edges"]
                       .filter(function(d) {
                           return (char_desc[d.source.id].visible=="1"&&
                                   char_desc[d.target.id].visible=="1")});

               drawNetwork(nodes, edges);
               restartSimulationWithNewNodes(nodes, edges);
           });

    }

    function restartSimulationWithNewNodes(nodes, edges){
        simulation.nodes(nodes)
                  .force("link", d3.forceLink(edges)
                                   .strength(function(d){return Math.max(0.5, 0.1*Math.sqrt(d.weight))}))
                  .force("charge", d3.forceManyBody().strength(charge))
                  .force("center", d3.forceCenter(w/2, h/2));
        simulation.alpha(1).restart();
    }
    drawNetwork(nodes, edges);
    simulation.on("tick", ticked);
    restartSimulationWithNewNodes(nodes, edges);

    function ticked(){
      circles.attr("cx", function(d) { return d.x; })
             .attr("cy", function(d) { return d.y; })

      links.attr("x1", function(d){return d.source.x})
           .attr("x2", function(d){return d.target.x})
           .attr("y1", function(d){return d.source.y})
           .attr("y2", function(d){return d.target.y});
    };

    function highlightCircle(d){
        d.attr("stroke-width", "5")
        .attr("stroke", "#000");
    }

    function dehighlightCircle(d){
        d.attr("stroke-width", "0");
    }

    function swapTextOpacity(d){
        d.attr("style", function(d){return "opacity:"+(char_desc[d].visible==="1"?"1.0":"0.5")+";";})
    }
    
    function highlightText(d){
        d.attr("fill", highlightColor)
         .attr("style", "font-weight: bold;");
    }

    function dehighlightText(d){
        d.attr("fill", textColor)
         .attr("style", "font-weight: normal");
    }

    function scaleCounts(n){
        return 2*Math.log(+n);
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }


    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
});
