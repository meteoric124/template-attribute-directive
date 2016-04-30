let noop = () => undefined;

let toCamelCase = function(str){
    return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

let toSnakeCase = function(str){
    return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

let attribute_directive_id_name = 'template-attribute-directive-id';

export { noop, toCamelCase, toSnakeCase, attribute_directive_id_name };