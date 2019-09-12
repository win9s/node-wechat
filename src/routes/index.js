const router = require('koa-router')()
const wechatApp = require('../utils/wechat.js');

router.post('/', async (ctx, next) => {
    await wechatApp.handleMsg(ctx);
})

router.get('/', async (ctx, next) => {
    await wechatApp.auth(ctx)
})

module.exports = router
