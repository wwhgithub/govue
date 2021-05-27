const { getRepoList,getTagList } =require('./http');
const ora=require('ora');
const inquirer=require('inquirer');
const util=require('util');
const path=require('path');
const downloadGitRepo=require('download-git-repo');//不支持promise
async function wrapLoading(fn,message,...args){
    const spinner=ora(message);
    //开始加载动画
    spinner.start();
    try{
        //执行传入方法
        const result=await fn(...args);
        // 修改状态为成功
        spinner.succeed();
        return result;
    }catch(error){
        spinner.fail('Request failed,refetch...');
    }
}

class Generator{
    constructor(name,targeDir){
        this.name=name;
        this.targeDir=targeDir;
        this.downloadGitRepo=util.promisify(downloadGitRepo)
    }
    async download(repo,tag){
        const requestUrl=`zhurong-cli/${repo}${tag?'#'+tag:''}`;
        await wrapLoading(this.downloadGitRepo,'waiting download tempate',
        requestUrl,
        path.resolve(process.cwd(),this.targeDir));
    }
    async getRepo(){
        const repoList=await wrapLoading(getRepoList,'waiting fetch template');
        if(!repoList)return;
        const repos=repoList.map(item=>item.name);
        const {repo} =await inquirer.prompt({
            name:'repo',
            type:'list',
            choices:repos,
            message:'Please choose a template to create project'
        })
        return repo;
    }
    async getTag(repo){
        const tags=await wrapLoading(getTagList,'waiting fetch tag',repo);
        if(!tags) return;
        const tagsList=tags.map(item=>item.name);
        const {tag}=await inquirer.prompt({
            name:'tag',
            type:'list',
            choices:tagsList,
            message:'Please choose a tag to create project'
        });
        return tag;
    }
    // 核心创建逻辑
    async create(){
        const repo=await this.getRepo();
        const tag=await this.getTag(repo);
        await this.download(repo,tag);
        console.log('用户选择了，repo='+repo+',tag='+tag);
    }
}

module.exports=Generator;