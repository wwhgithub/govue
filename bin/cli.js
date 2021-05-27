#! /usr/bin/env node
console.log('myvue2 working~');

const program=require('commander');
const figlet=require('figlet');
const chalk=require('chalk');
program
.command('create <app-name>')
.description('create a new project')
.option('-f,--force','overwrite target directory if it exist')
.action((name,options)=>{
    require('../lib/create.js')(name,options)
});
program
.command('ui')
.description('start add open roc-cli ui')
.option('-p,--port <port>','Port used for the UI Server')
.action((option)=>{
    console.log(option);
});
program
.version(`v${require('../package.json').version}`)
.usage('<command> [option]');
program.on('--help',()=>{
    console.log('\r\n'+figlet.textSync('govue',{
        font:'Ghost',
        horizontalLayout:'default',
        verticalLayout:'default',
        width:80,
        whitespaceBreak:true
    }));
    //新增说明信息
    console.log(`\r\n Run ${chalk.cyan(`myvue2 <cmomand> --help`)} for detailed usage of given command\r\n`);
})
//解析用户执行命令传入的参数
program.parse(process.argv);
