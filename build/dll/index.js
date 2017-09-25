const shelljs = require('shelljs/global');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const entryconfig = require('../../entry.config');
const dllconfig = require('../dll.config');
const webpack = require('webpack');
const compiler = webpack(dllconfig);



if(fs.existsSync(path.join(__dirname, '../../dll'))){
    rm('rf', path.join(__dirname, '../../dll'));
}


compiler.run((err, stats) => {
    if(err){
        console.log('webpack:build', err)
        return;
    }
    console.log('[webpack:build]', stats.toString({
        chunks: false,
        colors: true
    }))

    console.log(chalk.green('build end'))
    process.exit(0)

})


