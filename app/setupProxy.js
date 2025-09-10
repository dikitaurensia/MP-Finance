const Proxy = require("http-proxy-middleware")

module.exports = function(app){
    app.use(
        proxy("/login",{
            target:"http://localhost/tracking/api",
            changeOrigin:true
        })
    )

    app.use(
        proxy("/customer",{
            target:"http://localhost/tracking/api",
            changeOrigin:true
        })
    )

    app.use(
        proxy("/courier",{
            target:"http://localhost/tracking/api",
            changeOrigin:true
        })
    )
    
}