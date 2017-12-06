//var parsedJSON = require('./assets/GeoPC_CH_Places.json');
var fs = require('fs');

var parsedJSON = JSON.parse(fs.readFileSync("./assets/GeoPC_CH_Places.json"));


var stream = fs.createWriteStream("./assets/my_file.json");
stream.once('open', function(fd) {
    //stream.write('[\r\n');

    let length = parsedJSON.features.length;
    console.log(length + " items");
    for (const [index, value] of parsedJSON.features.entries()) { 
        let myObject = createObject(value);
        let myCreate = { "create" : { "_index" : "locations", "_type" : "location", "_id" : value.properties.ID + "_" + index } }
        stream.write('\t'+JSON.stringify(myCreate)+'\r\n');
        //stream.write(',\r\n');
        stream.write('\t'+JSON.stringify(myObject)+'\r\n');
        // if(index < length-1) {
        //     stream.write(',\r\n');
        // } else {
        //     stream.write('\r\n');
        //     console.log("bubu");
        // }

        // if (index == 10) {
        //     break;
        // }
    }

    //stream.write(']\r\n');
    stream.end();
    
});

function createObject(value) {
    let object = {};


    //{ "id": "135569", "title" : "Star Trek Beyond", "year":2016 , "genre":["Action", "Adventure", "Sci-Fi"] }
    
    object['name'] = value.properties.Postcode +" " + value.properties.Locality;
    object['country'] = value.properties.ISO;
    object['language'] = value.properties.Language;
    object['suggest'] = [
        "x" + value.properties.Postcode,
        "x" + value.properties.Locality,
        {
            "input": "x" + value.properties.Postcode,  // add x as prefix because of numbers in Elasticsearch
           
        },
        {
            "input": "x" + value.properties.Locality,
            
        },
        {
            "input": "x" + value.properties.Postcode + " " + value.properties.Locality,
           
        }
    ];

    return object;
}


