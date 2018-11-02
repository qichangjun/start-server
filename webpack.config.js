/**
 * Created by zzd on 2018/5/25.
 */
const path = require('path');
module.exports = {

    module: {},
    plugins: [],
    devServer: {
        proxy: { // proxy URLs to backend development server
            '/ermsapi': 'http://demo.docworks.cn'            
        },
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 7777
    }
}
