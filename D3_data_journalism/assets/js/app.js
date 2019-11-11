// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};
 
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
// Import Data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;

// console.log(healthData);
// cast the force value to a number
healthData.forEach(function(data){
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
});
//Create scale functions
var xLinearScale = d3.scaleLinear().range([0, width]);
var yLinearScale = d3.scaleLinear().range([height, 0]);

//Create axis functions

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xMin; var xMax; var yMin; var yMax;
xMin = d3.min(healthData, function(data) {
    return data.healthcare;
});

xMax = d3.max(healthData, function(data) {
    return data.healthcare;
});

yMin = d3.min(healthData, function(data) {
    return data.poverty;
});

yMax = d3.max(healthData, function(data) {
    return data.poverty;
});

xLinearScale.domain([xMin, xMax]);
yLinearScale.domain([yMin, yMax]);
console.log(xMin);
console.log(yMax);

//Append Axes to the chart

chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

// Create Circles

  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1.5))
  .attr("cy", d => yLinearScale(d.poverty +0.3))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", .5)

  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });
  // Initialize tool tip
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (abbr + '%');
      });

  // Create tooltip in the chart
 
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
 
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels

  chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.healthcare +1.3);
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty +.1);
      })
      .text(function(data) {
          return data.abbr
      });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healtcare(%)");

  chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
 
});
