#!/usr/bin/env node  
'use strict'

var exec = require('child_process').exec;
var dis_opera = require('./lib/dist_operation')
var port_opera = require('./lib/port_operation')
const program = require('commander');
var fs=require('fs');
var stat=fs.stat;

program.on('--help', function () {
    console.log('  Examples:')
    console.log('')
    console.log('    name +你当前路径所要转移的文件夹')    
    console.log('')
    })
program
    .command('run [name]')
    .option('-r,--rename [rename]')
    .description('移动文件夹到web-serve服务')
    .action(function(name,options){  
        // port_opera.portIsOccupied(7777,()=>{
        //     console.log(1234)
        // })     
        // 删掉dist文件夹
        let rename = options.rename ? options.rename : name
        console.log(`正在移除${rename}文件夹....`)
        dis_opera.deleteFolder(__dirname+'/dist/'+rename);
        // 重新创建dist,移动目标文件夹
        console.log(`正在重新创建${rename},移动目标文件夹....`)
        
        function  execute(){
            var cmd=`cd ${__dirname} && npm run start:dev`;
            console.log('正在启动服务....')
            exec(cmd, function(error, stdout, stderr) {                    
                if(error){
                    console.log(error);
                }
                else{
                    console.log("成功");
                }
            });
        }
        dis_opera.createWebProject(execute,name,rename)        
    })

program.parse(process.argv);

