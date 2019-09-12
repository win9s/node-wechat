const crypto = require('crypto');
const Qs = require('qs');
const path = require('path');
const fs = require('fs');
const accessTokenJson = require('./access_token');
const menus = require('./menus');
const help = require('./help');
const msg = require('./msg');
const config = require('./config')

const weChat = {
    auth: async (ctx) => {
        await weChat.createMenu();

        let signature = ctx.query.signature,
            timestamp = ctx.query.timestamp,
            nonce = ctx.query.nonce,
            echostr = ctx.query.echostr;
        let array = [config.token, timestamp, nonce];
        array.sort();
        let tempStr = array.join('');
        const hashCode = crypto.createHash('sha1');
        let resultCode = hashCode.update(tempStr, 'utf8').digest('hex');
        if (resultCode === signature) {
            ctx.body = echostr;
        } else {
            ctx.body = 'mismatch';
        }
    },
    handleMsg: async (ctx) => {
        let buffer = await help.parsePostData(ctx);
        let msgXml = Buffer.concat(buffer).toString('utf-8');
        let result = await help.parseStringAsync(msgXml);
        result = result.xml;
        let toUser = result.ToUserName;
        let fromUser = result.FromUserName;
        let reportMsg = "";
        if (result.MsgType.toLowerCase() === "event") {
            switch (result.Event.toLowerCase()) {
                case 'subscribe':
                    let content = "欢迎关注公众号";
                    reportMsg = msg.txtMsg(fromUser, toUser, content);
                    break;
                case 'click':
                    break;
            }
        } else {
            if (result.MsgType.toLowerCase() === "text") {
                switch (result.Content) {
                    case '1':
                        reportMsg = msg.txtMsg(fromUser, toUser, '您发送了1');
                        break;
                    case '2':
                        reportMsg = msg.txtMsg(fromUser, toUser, '您发送了2');
                        break;
                    default:
                        reportMsg = msg.txtMsg(fromUser, toUser, '没有这个选项哦');
                        break;
                }
            }
        }
        ctx.body = reportMsg
    },
    createMenu: async () => {
        let accessToken = await weChat.getAccessToken();
        let wxModifyMenuBaseUrl = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + accessToken;
        await help.rpAsync({
            url: wxModifyMenuBaseUrl,
            body: menus
        })
    },
    getAccessToken: () => {
        return new Promise(async (resolve, reject) => {
            let currentTime = new Date().getTime();
            let queryParams = {
                'grant_type': 'client_credential',
                'appid': config.appID,
                'secret': config.appSecret
            };
            let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + Qs.stringify(queryParams);
            if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
                let data = await help.rpAsync({
                    method: "GET",
                    url: wxGetAccessTokenBaseUrl
                })
                if (data.access_token) {
                    accessTokenJson.access_token = data.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(data.expires_in) - 200) * 1000;
                    fs.writeFileSync(path.join(__dirname, './access_token.json'), JSON.stringify(accessTokenJson));
                    resolve(accessTokenJson.access_token);
                } else {
                    resolve(data);
                }
            } else {
                resolve(accessTokenJson.access_token);
            }
        });
    }
}
module.exports = weChat;
