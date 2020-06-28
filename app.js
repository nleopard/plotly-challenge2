function init() {

    var dropDown = d3.select("#selDataset");

    d3.json("samples.json").then(function(data) {
        console.log(data);
        //find the data for patient id
        var dataNames = data.names;
        dataNames.forEach(names => {
            dropDown.append("option").text(names).property("values", names);
        })


    })
};


//build graph
function buildGraph(pID) {
    d3.json("samples.json").then(function(data) {
        var samples = data.samples;
        var resultArray = samples.filter(filteredObj => filteredObj.id == pID)
        var result = resultArray[0]
        console.log(resultArray)
        console.log(result)
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        //create the bubble chart
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth',
                type: 'heatmap'
            },
            text: otu_labels
        };

        var data = [trace1];

        var layout = {
            title: "<b>Bubble Chart of Belly Button Bacteria</b><br>(All Bacteria)",
            showlegend: false,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: ""
            }
        };

        Plotly.newPlot('bubble', data, layout);

        // Prepare a list of objects for sorting
        var list = [];
        for (var i = 0; i < otu_ids.length; i++) {
            // Push each object into the list
            list.push({ 'otu_ids': otu_ids[i], 'otu_labels': otu_labels[i], 'sample_values': sample_values[i] });
        }

        // Sort function by object key in array

        var trace2 = {
            x: list.slice(0, 10).map(record => record.sample_values),
            y: list.slice(0, 10).map(record => "OTU" + record.otu_ids.toString()),
            hovertext: list.slice(0, 10).map(record => "(" + record.otu_ids + ", " + record.otu_labels + ")"),
            type: "bar",
            orientation: "h"
        };

        var data = [trace2];

        var layout = {
            height: 500,
            width: 500
        };

        Plotly.newPlot("bar", data, layout);
    })

}

//build metafunction
function buildMetaData(pID) {

    d3.json("samples.json").then(function(data) {
        var metadata = data.metadata;
        var resultArray = metadata.filter(filteredObj => filteredObj.id == pID)
        var result = resultArray[0]
        console.log(resultArray)
        console.log(result)
        var panel = d3.select("#sample-metadata")
        panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            panel.append("p").text(`${key}: ${value}`);
        })
    })
}

function optionChanged(newSample) {
    buildMetaData(newSample)
    buildGraph(newSample)
}

init();