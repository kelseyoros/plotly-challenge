// This function is called when a dropdown menu item is selected
function optionChanged(sampleName) {
    
    buildCharts(sampleName);
    buildMetaData(sampleName);

};

function init() {
      // Use D3 to select the dropdown menu
  var selector = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  d3.json("static/js/data/samples.json").then((data) => {

    var samples = data.names;
    samples.forEach(sample => selector.append('option').text(sample).property('value', sample))
    
    var firstSample = samples[0];
    buildCharts(firstSample);
    buildMetaData(firstSample);
    });
};

function buildCharts (sampleName) {
    d3.json("static/js/data/samples.json").then((data) => {

        var samples = data.samples
        var sampleData = samples.filter(sampleDict => sampleDict.id == sampleName)
        var sampleData = sampleData[0]


    //  Create the trace for the bar chart
    var barTrace = {
      x: sampleData.sample_values.slice(0,10).reverse(),
      y: sampleData.otu_ids.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      text: sampleData.otu_labels.slice(0,10).reverse()
    };


  
    // Create the data array for the plot
    var barData = [barTrace];
  
    // Define the plot layout
    var barLayout = {
      title: "Top 10 OTUs",
//     xaxis: { title: "Organ" },
//     yaxis: { title: "Square Root of Survival" }
    };
  
    // Plot the chart to a div tag with id "bar"
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart
    var bubbleTrace = {
        x: data.otu_ids,
        y: data.sample_values,
        mode: 'markers',
        text: data.otu_labels,
        marker: {
            size: data.sample_values,
            color: data.otu_ids
          }        
        }

    // Create the data array for the plot
    var bubbleData = [bubbleTrace];

    //Define the plot layout
    var bubbleLayout = {
        xaxis: {title: 'OTU ID'},
//        height: ,
//        width: ,
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
})};

init();