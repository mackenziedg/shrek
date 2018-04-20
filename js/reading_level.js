
d3.csv("../data/reading_level/shrek3_reading.csv").then(function(data) {

    var width = 600; //width of canvas
    var height = 300; //height of canvas
    var padding = 20;
    
    const color = {
        "hero" : "green",
        "villain": "purple",
        "supporting": "brown"
    };
    
    console.log("RUNNIN");
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g");
    
    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Create scale functions
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.num_lines; })])
        .range([padding, width - padding * 2]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.reading_level; })])
        .range([height - padding, padding]);

    var aScale = d3.scaleSqrt()
        .domain([0, d3.max(data, function(d) { return d.vocab; })])
        .range([0, 10]);

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d){
          return aScale(d.vocab)
      })
      .attr("cx", function(d){
          return xScale(d.num_lines)
        })
      .attr("cy", function(d){
          return yScale(d.reading_level)
        })
      .style("opacity", 0.3)
      .style("fill", function(d) { 
          return color[d.group];
        }) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.name + "<br/> (" + d.num_lines
	        + ", " + d.reading_level + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
});