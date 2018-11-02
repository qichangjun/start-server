#!/usr/bin/env node  
'use strict'

var exec = require('child_process').exec;
const program = require('commander');
var fs=require('fs');
var stat=fs.stat;


var copy=function(src,dst){
    //读取目录
    fs.readdir(src,function(err,paths){        
        if(err){
            throw err;
        }
        paths.forEach(function(path){
            var _src=src+'/'+path;
            var _dst=dst+'/'+path;
            var readable;
            var writable;
            stat(_src,function(err,st){
                if(err){
                    throw err;
                }
                
                if(st.isFile()){
                    readable=fs.createReadStream(_src);//创建读取流
                    writable=fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                }else if(st.isDirectory()){
                    exists(_src,_dst,copy);
                }
            });
        });
    });
}

var exists=function(src,dst,callback){
    //测试某个路径下文件是否存在
    fs.exists(dst,function(exists){
        if(exists){//不存在
            callback(src,dst);
        }else{//存在
            fs.mkdir(dst,function(){//创建目录
                callback(src,dst)
            })
        }
    })
}

var deleteFolder=function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

program.on('--help', function () {
    console.log('  Examples:')
    console.log('')
    console.log('    name +你当前路径所要转移的文件夹')    
    console.log('')
    })
program
    .command('name [name]')
    .description('移动文件夹到web-serve服务')
    .action(function(name){        
        // 删掉dist文件夹
        console.log('正在移除dist文件夹....')
        deleteFolder(__dirname+'/dist');
        // 重新创建dist,移动目标文件夹
        console.log('正在重新创建dist,移动目标文件夹....')
        fs.mkdir(__dirname + '/dist', function (err) {
            exists(process.cwd()+'/'+name,__dirname + '/dist',copy)
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
            execute();         
        })
        
    })

program.parse(process.argv);

