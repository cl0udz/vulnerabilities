var inspector = require('schema-inspector');

// Data that we want to sanitize and validate
var data_bypass_array = {
	firstname: 'sterling',
	lastname: "archer",
	jobs: {"name" : 'Special agent, cocaine Dealer', "hasOwnProperty": function(elem){return false;}, "constructor": Array}
};

// candidate.hasOwnProperty: https://github.com/cl0udz/HiPar/blob/e9b5d4cac7c46b9776c04251575c226fa772a125/tests/target/TestSchema-inspector/node_modules/schema-inspector/lib/schema-inspector.js#L483
// post.hasOwnProperty: https://github.com/cl0udz/HiPar/blob/e9b5d4cac7c46b9776c04251575c226fa772a125/tests/target/TestSchema-inspector/node_modules/schema-inspector/lib/schema-inspector.js#L1014
var data_hasOwnProperty_error = {
	firstname: 'sterling',
	lastname: "archer",
	jobs: {"name" : 'Special agent, cocaine Dealer', "hasOwnProperty": "not a function", "constructor": Array}
};

var data_type_error = {
	firstname: 'sterling',
	lastname: "archer",
	jobs: {"name" : 'Special agent, cocaine Dealer', "hasOwnProperty": "not a function", "constructor": "unknown type"}
};

test(data_bypass_array);

test(data_hasOwnProperty_error);

function test(data){
    // Sanitization Schema
    var sanitization = {
        type: 'object',
        properties: {
            firstname: { type: 'string', rules: ['trim', 'title'] },
            lastname: { type: 'string', rules: ['trim', 'title'] },
            jobs: {
                type: 'array',
                splitWith: ',',
                items: { type: 'string', rules: ['trim', 'title'] }
            },
            email: { type: 'string', rules: ['trim', 'lower'] }
        }
    };

    // Let's update the data
    inspector.sanitize(sanitization, data);

    // Validation schema
    var validation = {
        type: 'object',
        properties: {
            firstname: { type: 'string', minLength: 5 },
            lastname: { type: 'string', minLength: 5 },
            jobs: {
                type: 'array',
                items: { type: 'string', minLength: 10 }
            }
        }
    };
    var result = inspector.validate(validation, data);

    console.log(result);
}
