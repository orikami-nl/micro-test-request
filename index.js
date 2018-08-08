var Stream = require("stream");

function createRequest({ url = "", method = "GET", headers = {}, body = null }) {
    var request = new Stream.Readable();
    request._read = function noop() {};
    if(body) {
        if(typeof body !== "string") {
            body = JSON.stringify(body);
        }
        request.push(body);
    }
    request.push(null);

    request.url = url;
    request.headers = {};
    request.rawHeaders = [];
    request.httpVersion = "1.1";
    request.method = method;

    Object.keys(headers)
      .forEach(key => {
          request.headers[key.toLowerCase()] = headers[key];
          request.rawHeaders.push(key);
          request.rawHeaders.push(headers[key]);
      });

    return request;
}

function createResponse() {
    var response = new Stream.Writable();
    response.statusCode = 200;
    response.headers = {};
    response.body = "";
    response.setHeader = function(key,val) {
        response.headers[key] = val;
    };
    response.getHeader = function(key) {
        return response.headers[key];
    };
    response._write = function(chunk, encoding, done) {
        response.body += chunk.toString();
        done();
    };
    return response;
}

module.exports = async function request(options) {
    if(typeof options === "function") options = { handler: options };
    const req = createRequest(options);
    const res = createResponse();
    let result = await options.handler(req,res);
    if(typeof result !== "undefined") {
        if(typeof result !== "string") result = JSON.stringify(result,null,4);
        res.body = result;
    }
    return res;
};
module.exports.createResponse = createResponse;
module.exports.createRequest = createRequest;
