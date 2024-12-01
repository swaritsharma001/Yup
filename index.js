const express = require("express")
const httpProxy = require("http-proxy")

const app = express()
const port = 3000

const base = "https://s3.ap-south-1.amazonaws.com/thegangsta.live/clone"
const proxy = httpProxy.createProxy()
app.use((req, res)=>{
  const host = req.hostname
  const sub = host.split(".")[0]

  const resolve = `${base}/${sub}/frontend/index.html`
  proxy.web(req, res, { target: resolve, changeOrigin: true})
})
app.listen(port)
