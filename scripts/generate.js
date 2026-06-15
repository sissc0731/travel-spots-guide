const fs=require('fs'),path=require('path'),today=new Date().toISOString().slice(0,10),slug=today;
const fp=path.join(__dirname,'..','feed.json');
const feed=JSON.parse(fs.readFileSync(fp,'utf8'));
if(!feed.posts)feed.posts=[];
if(feed.posts.find(p=>p.slug===slug)){console.log('Already exists');process.exit(0)}

// Content pools - 8 groups cycling through dates
const pools=[
[{t:'效率翻倍！这3个小技巧让你的工作流更顺畅',tag:'效率技巧',d:'减少切换、批处理、自动化——3个简单技巧立刻提升效率'}],
[{t:'2026年必备的免费工具推荐',tag:'工具推荐',d:'精心挑选的实用免费工具，日常办公和创作都能用上'}],
[{t:'为什么你总觉得时间不够用？',tag:'时间管理',d:'不是你不够努力，而是方法需要调整。重新规划你的时间分配'}],
[{t:'工作学习两不误的小窍门',tag:'学习方法',d:'高效人士都在用的学习方法，每天只需投入少量时间'}],
[{t:'比勤奋更重要的是方法',tag:'思维方式',d:'换个角度思考问题，可能会发现之前困扰你的事其实很简单'}],
[{t:'减少决策疲劳的日常习惯',tag:'习惯养成',d:'每天做太多小决定会消耗精力，建立习惯让大脑自动运行'}],
[{t:'让生活更有条理的整理术',tag:'生活技巧',d:'整理不只是打扫房间，更是整理思绪和提升幸福感的方式'}],
[{t:'数字时代如何保持专注',tag:'专注力',d:'手机和社交媒体在偷走你的注意力，教你几招夺回主动权'}],
];

const idx=(new Date().getDate()-1)%pools.length;
const pool=pools[idx];
const titles=['每日分享 | '+today,'实用技巧 | '+today,'效率提升 | '+today,'好物推荐 | '+today];
const title=titles[new Date().getDate()%titles.length];

feed.posts.unshift({slug,date:today,title:title,items:pool});
feed.updated=today;
fs.writeFileSync(fp,JSON.stringify(feed,null,2));

// Create post HTML
const dir=path.join(__dirname,'..','posts');
if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
const h=`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title><meta name="description" content="${pool.map(i=>i.t).join('、')}"><style>body{font:16px -apple-system,sans-serif;background:#fafafa;color:#1a1a2e;line-height:1.8;margin:0;padding:16px}.c{max-width:700px;margin:0 auto}article{background:#fff;padding:24px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.05)}h1{font-size:1.3rem;margin:0 0 4px}.date{font-size:.8rem;color:#666;margin-bottom:20px}.item{margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #eee}.item h2{font-size:1rem;margin:0 0 4px}.item p{font-size:.88rem;color:#555}.tag{display:inline-block;background:#eff6ff;color:#2563eb;font-size:.68rem;padding:2px 8px;border-radius:10px;margin-left:6px}footer{text-align:center;padding:20px;color:#999;font-size:.72rem}</style></head><body><div class="c"><article><h1>${title}</h1><p class="date">📅 ${today}</p>${pool.map(i=>'<div class="item"><h2>'+i.t+' <span class="tag">'+i.tag+'</span></h2><p>'+i.d+'</p></div>').join('')}</article></div><footer>每日自动更新</footer></body></html>`;
fs.writeFileSync(path.join(dir,slug+'.html'),h);
console.log('Generated:',title);
