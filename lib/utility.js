let noop = () => undefined;

let toCamelCase = function(str){
    return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

let toSnakeCase = function(str){
    return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

export { noop, toCamelCase, toSnakeCase };