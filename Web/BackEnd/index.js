import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';
import webpackConfig from '../webpack.config.dev';
import users from './routes/users';


var app = express();
app.use(bodyParser.json());

app.use('/api/users',users);

const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler,{
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./index.html'));
});

app.listen(2121,()=>console.log('running on 2121 port'));
