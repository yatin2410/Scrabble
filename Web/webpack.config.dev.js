import path from 'path';

export default {
    entry: path.join(__dirname,'/FrontEnd/index.js'),
    output:{
        filename:'bundle.js',
        path: '/'
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            include: [
              path.join(__dirname, 'FrontEnd'),
              path.join(__dirname,'BackEnd/shared')
            ],
            use : [ 'babel-loader' ]
          },
          {
            test: /\.css$/, 
            use: [ 'style-loader', 'css-loader' ] 
          }
        ]
      },
    resolve:{
        extensions: ['*','.js']
    }
}