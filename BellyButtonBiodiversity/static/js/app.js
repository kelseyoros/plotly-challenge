// This function is called when a dropdown menu item is selected
function optionChanged(sampleName) {
    
    buildCharts(sampleName);
    buildMetaData(sampleName);

};

function init() {
    // Use D3 to select the dropdown menu
    var dropdown = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    d3.json("./static/js/data/samples.json").then((data) => {

        var samples = data.names;
        samples.forEach(sample => dropdown.append('option').text(sample).property('value', sample))
    
        var firstSample = samples[0];
        buildCharts(firstSample);
        buildMetaData(firstSample);
    });
};

function buildMetaData(sample) {
    //Use d3 to read in the json file
    d3.json("./static/js/data/samples.json").then((data) => {
        
        var metadata = data.metadata.filter(sampleDict => sampleDict.id.toString() === sample)[0];

        //Use d3 to select the metadata id
        var demographicInfo = d3.select("#sample-metadata");

        demographicInfo.html("");

        Object.entries(metadata).forEach((key) => {
            demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n")
        });
    });
};

function buildCharts (sampleName) {
    d3.json("./static/js/data/samples.json").then((data) => {

        var samples = data.samples.filter(sampleDict => sampleDict.id === sampleName)[0];

        var samplevalues = samples.sample_values.slice(0,10).reverse();

        var OTU_top = samples.otu_ids.slice(0,10).reverse();

        var labels = samples.otu_labels.slice(0,10).reverse();

        var OTU_id = OTU_top.map(sampleNum => "OTU " + sampleNum)


    //  Create the trace for the bar chart
    var barTrace = {
      x: samplevalues,
      y: OTU_id,
      type: "bar",
      orientation: "h",
      text: labels
    };


  
    // Create the data array for the plot
    var barData = [barTrace];
  
    // Define the plot layout
    var barLayout = {
      title: "Top 10 OTU",
      autosize: false,
      width:1000,
      height: 500
    };
  
    // Plot the chart to a div tag with id "bar"
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart
    var bubbleTrace = {
        x: samples.otu_ids,
        y: samples.sample_values,
        text: samples.otu_labels,
        mode: 'markers',
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
          }        
        };

    // Create the data array for the plot
    var bubbleData = [bubbleTrace];

    //Define the plot layout
    var bubbleLayout = {
        xaxis: {title: 'OTU ID'},
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
})};

init();