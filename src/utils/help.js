const parseString = require('xml2js').parseString;
const request = require("request");
module.exports = {
    parseStringAsync: (msgXml) => {
        return new Promise((resolve, reject) => {
            parseString(msgXml, {explicitArray: false}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    },
    parsePostData: (ctx) => {
        return new Promise((resolve, reject) => {
            let buffer = [];
            ctx.req.on('data', (data) => {
                buffer.push(data);
            })
            ctx.req.on("end", () => {
                resolve(buffer);
            })
        });
    },
    rpAsync: (json) => {
        return new Promise((resolve, reject) => {
            let opt = {
                url: json.url,
                method: json.method || "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: json.body
            };
            json.agentOptions && (opt.agentOptions = json.agentOptions);
            request(opt, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                } else {
                    console.log("___________________________rqPromise err:", error);
                    reject(error);
                }
            });
        })
    }
};
