exports.txtMsg = (toUser, fromUser, content) => {
    let xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
    xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
    xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    xmlContent += "<MsgType><![CDATA[text]]></MsgType>";
    xmlContent += "<Content><![CDATA[" + content + "]]></Content></xml>";
    return xmlContent;
}

exports.graphicMsg = (toUser, fromUser, contentArr) => {
    let xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
    xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
    xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    xmlContent += "<MsgType><![CDATA[news]]></MsgType>";
    xmlContent += "<ArticleCount>" + contentArr.length + "</ArticleCount>";
    xmlContent += "<Articles>";
    contentArr.map((item, index) => {
        xmlContent += "<item>";
        xmlContent += "<Title><![CDATA[" + item.Title + "]]></Title>";
        xmlContent += "<Description><![CDATA[" + item.Description + "]]></Description>";
        xmlContent += "<PicUrl><![CDATA[" + item.PicUrl + "]]></PicUrl>";
        xmlContent += "<Url><![CDATA[" + item.Url + "]]></Url>";
        xmlContent += "</item>";
    });
    xmlContent += "</Articles></xml>";
    return xmlContent;
}

