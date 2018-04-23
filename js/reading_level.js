
d3.csv("../data/reading_level/shrek_trilogy_reading.csv").then(function(data) {

    var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    //var width = 700; //width of canvas
    //var height = 300; //height of canvas
    var padding = 40;
    
    const color = {
        "hero" : "green",
        "villain": "purple",
        "supporting": "brown"
    };
    
    console.log("RUNNIN");
    // add the graph canvas to the body of the webpage
    var svg = d3.select("#read_chart").append("svg")
        .attr("width", width)
        .attr("height", height)
    
    // add the tooltip area to the webpage
    var tooltip = d3.select("#read_chart").append("div")
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

    //Define X axis
	var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(8)
        .tickFormat(formatAsPercentage);

    //Define Y axis
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5)
        .tickFormat(formatAsPercentage);
    
    var formatAsPercentage = d3.format(".1%");

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
        
          tooltip.html(d.name + "<br/> READING LEVEL:" + d.reading_level + "<br/>"
            + "VOCAB: " + d.vocab + " UNIQUE WORDS"
            + '<img style="width:100px;height:150px;" src="img/original/' + d.name.toLowerCase().split(' ').join('') + '.jpg" alt="' + d.name + '">')
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    //Create X axis
	svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

  // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height) + ")")
      .style("text-anchor", "middle")
      .text("Number of Lines");

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
  // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",-200)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Flesch Kincaid Score");      

});