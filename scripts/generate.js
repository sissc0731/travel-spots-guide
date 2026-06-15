const fs=require('fs'),path=require('path'),today=new Date().toISOString().slice(0,10),slug=today;
const fp=path.join(__dirname,'..','feed.json');
const feed=JSON.parse(fs.readFileSync(fp,'utf8'));
if(!feed.posts)feed.posts=[];
if(feed.posts.find(p=>p.slug===slug)){console.log('Already exists');process.exit(0)}

// Multi-topic pools for variety
const pools=[
[{t:'效率翻倍！3个小习惯让你每天多出2小时',tag:'效率技巧',d:'切换任务消耗精力，专注一件事做完再做下一件。手机通知关掉，设固定时间统一处理消息。睡前花5分钟列第二天的3件要事。简单但有效。',img:'手机+笔记本+咖啡的桌面俯拍图'},
{t:'2026年最值的5个免费在线工具',tag:'免费工具',d:'图片压缩→squoosh、PDF处理→ilovepdf、思维导图→excalidraw、在线PS→photopea、笔记工具→notion。全部免费不用下载。',img:'工具软件图标拼图'},
{t:'为什么你的待办清单总是完不成',tag:'时间管理',d:'列的太多、没有优先级、不会拆解大任务。每天只列3件最重要的事，大任务拆成15分钟能完成的小步骤。做完一项划掉一项，成就感驱动。',img:'清单本+笔的桌面图'}],
[{t:'从社恐到自信表达，我用了这4个方法',tag:'个人成长',d:'提前准备3个话题、把注意力放在对方身上而不是自己、语速放慢一半、允许自己不完美。社交能力是可以练习的，不是天生的。',img:'两人轻松聊天的场景图'},
{t:'月薪5k到月入2w，这份技能清单建议收藏',tag:'职业规划',d:'Excel数据处理（数据透视表+VLOOKUP）、PPT设计（审美+逻辑）、文案写作（任何行业都需要）、基础Python（自动化办公）。每项学1个月，半年后不一样。',img:'办公桌+技能图标拼图'},
{t:'上班族省钱妙招，一年轻松省下1万块',tag:'生活方式',d:'自备午餐比外卖省一半、用二手平台买大件家电、取消自动续费的闲置会员、公共交通比打车月省500+、不买咖啡改自己冲，一年2000块。',img:'钱包/存钱罐和记账本'}],
[{t:'女生独居的安全小技巧，建议收藏',tag:'安全知识',d:'门外放一双男鞋、快递收件人用男性名字、晚归走大路别抄近道、手机设紧急联系人快捷拨号。这些小习惯能避免很多麻烦。',img:'女生房间夜景'},
{t:'租房避坑完整指南：签合同前必查',tag:'生活攻略',d:'检查水压和热水器、拍下入住时所有墙面损伤、确认物业费谁交、问清楚违约金条款、测试所有插座。入住前不检查，退房时都是你的锅。',img:'租房门钥匙+合同'},
{t:'失眠怎么办？这3个方法让我秒睡',tag:'健康科普',d:'4-7-8呼吸法（吸气4秒憋气7秒呼气8秒）×3轮、睡前1小时不碰手机蓝光、卧室温度控制在18-22度。连续3天就能感受到变化。',img:'舒适的卧室灯光图'}],
[{t:'第一次养猫必看：新手最容易犯的5个错',tag:'宠物养护',d:'不封窗就接猫、频繁洗澡破坏皮脂、喂谷物含量高的便宜猫粮、忽视疫苗和驱虫、不提供猫抓板和垂直空间。养猫前做好功课，猫咪少生病你也少焦虑。',img:'可爱猫咪在家照片'},
{t:'新手学做菜的万能公式，记住这4条就够了',tag:'厨房技巧',d:'热锅冷油不粘锅、炒肉先腌10分钟更嫩、炖汤中途不加水、青菜大火快炒脆爽。不用背菜谱，掌握原理什么菜都能做。',img:'厨房烹饪场景'},{t:'花最少的钱布置出租屋，温馨不输宜家',tag:'家居灵感',d:'投影仪代替电视省空间、洞洞板上墙收纳翻倍、落地灯+地毯改造氛围只需200块、绿植点缀让房间有生命力。房子是租的生活不是。',img:'温馨出租屋布置图'}],
[{t:'职场沟通技巧：开会发言不再紧张',tag:'职场技能',d:'准备一个观点+一个数据+一个建议。先说结论再解释。声音放慢一点显自信。别人发言时点头+记笔记，轮到你时把这些记下来的反馈给对方。',img:'会议室场景'},
{t:'普通人做副业的3个原则',tag:'副业指南',d:'选边际成本低的方向（一次做好无限次卖）、用主业积累的技能做副业（不用从零学）、低投入试错不要一上来就辞职。副业是慢慢养出来的。',img:'副业收入截图或工作台'},
{t:'面试被问缺点怎么回答才不扣分',tag:'求职技巧',d:'不要说我没有缺点、不要说什么事都太认真这种假缺点。说一个真实的但正在改进的缺点，比如公开演讲不太好但最近在Toastmasters练习。',img:'面试场景'}],
[{t:'每天10分钟的小习惯，坚持30天身体变化明显',tag:'健康生活',d:'早起一杯温水唤醒代谢、饭后靠墙站10分钟改善体态、睡前拉伸放松肌肉、每天快走6000步。不需要健身房不需要私教。',img:'运动/伸展场景'},
{t:'焦虑的时候试试这个5分钟冥想',tag:'心理疗愈',d:'闭上眼睛专注呼吸、从脚趾到头顶逐一放松每个部位、不评判任何脑海里出现的想法只是观察。每天5分钟，大脑焦虑回路真的会改变。',img:'冥想/放松场景'},
{t:'如何判断一份工作该不该辞职',tag:'职业思考',d:'三个信号：每天醒来不想去上班持续超过1个月、学不到新东西只是在消耗已有技能、身体出现失眠/胃痛等应激反应。任何两个信号同时出现，认真考虑换。',img:'办公桌+思考表情'}],
[{t:'自由职业一年，我的真实收入和支出',tag:'自由职业',d:'月均收入12000但波动大（最高2万最低6k）、社保自己缴月均1800、办公在家省交通费但咖啡厅消费增加、最重要的能力不是专业是自律和客户管理。',img:'在家工作的办公桌'},
{t:'小红书起号3个月涨粉5000的真实经验',tag:'自媒体',d:'封面决定点击率标题决定阅读量、日更比周更容易起号、前30条不要去管数据只管发、找到3个对标账号拆解他们的爆款逻辑。',img:'小红书APP+涨粉数据截图'},
{t:'用AI做副业的3个方向，零基础也能做',tag:'AI副业',d:'AI生成头像/壁纸在小红书卖、AI写文案接单（淘宝闲鱼）、AI做数据整理（企业对Excel+VBA需求很大）。不需要会编程，会用工具就行。',img:'AI工具界面截图'}],
[{t:'这5个习惯让我从月光族到存下10万',tag:'理财入门',d:'发工资先存20%再花、记账一个月才知道钱去哪了、买东西前先加购物车等3天、卸载所有购物APP只用网页版、找到不花钱的快乐来源（骑行/看书/爬山）。',img:'存钱罐/记账本'},
{t:'信息过载时代如何保护注意力',tag:'专注力',d:'每天只看2次新闻（早晚各10分钟）、取关制造焦虑的博主、手机屏幕模式改灰度（色彩降低刺激）、每周半天完全不碰任何屏幕。',img:'手机屏幕时间报告'},
{t:'别被同龄人压力搞垮：你不需要和别人比进度',tag:'心理成长',d:'社交媒体上看到的是别人的高光时刻、朋友圈之外的生活你从来没看到、唯一该比较的人是你自己昨天。25岁没房没车很正常，别人也是贷款买的。',img:'夜景/独处思考'}],
];

const idx=(new Date().getDate()-1)%pools.length;
const pool=pools[idx];
const titles=['每日分享 | '+today,'实用推荐 | '+today,'效率手册 | '+today,'生活灵感 | '+today];
const title=titles[new Date().getDate()%titles.length];

feed.posts.unshift({slug,date:today,title:title,items:pool});
feed.updated=today;
fs.writeFileSync(fp,JSON.stringify(feed,null,2));

// === WEBSITE POST ===
const dir=path.join(__dirname,'..','posts');
if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
const h=`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title><meta name="description" content="${pool.map(i=>i.t).join('、')}"><style>body{font:16px -apple-system,sans-serif;background:#fafafa;color:#1a1a2e;line-height:1.8;margin:0;padding:16px}.c{max-width:700px;margin:0 auto}article{background:#fff;padding:24px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.05)}h1{font-size:1.3rem;margin:0 0 4px}.date{font-size:.8rem;color:#666;margin-bottom:20px}.item{margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #eee}.item h2{font-size:1rem;margin:0 0 4px}.item p{font-size:.88rem;color:#555}.tag{display:inline-block;background:#eff6ff;color:#2563eb;font-size:.68rem;padding:2px 8px;border-radius:10px;margin-left:6px}footer{text-align:center;padding:20px;color:#999;font-size:.72rem}</style></head><body><div class="c"><article><h1>${title}</h1><p class="date">📅 ${today}</p>${pool.map(i=>'<div class="item"><h2>'+i.t+' <span class="tag">'+i.tag+'</span></h2><p>'+i.d+'</p></div>').join('')}</article></div><footer>每日自动更新</footer></body></html>`;
fs.writeFileSync(path.join(dir,slug+'.html'),h);

// === DOUYIN TEXT-IMAGE POST ===
const douyinDir=path.join(__dirname,'..','douyin');
if(!fs.existsSync(douyinDir))fs.mkdirSync(douyinDir,{recursive:true});

const emojis=['🔥','💡','⚡','🎯','✨','🚀','💎','📌','🌟','✅','❤️','🔑'];
const hook=emojis[new Date().getDate()%emojis.length];
const dateStr=today;

// Pick primary item for the main post
const main=pool[0];
const dypost=`${hook} ${main.t}
${dateStr}

${main.d}

${pool.length>1?'━━━━━━━━━━\n更多推荐：\n':''}${pool.slice(1).map(i=>`▫️ ${i.t}
${i.d.substring(0,50)}...`).join('\n\n')}

━━━━━━━━━━
💬 收藏不迷路，每天分享实用干货
🔗 更多内容看主页

#干货分享 #效率提升 #实用技巧 #自我成长 #每天进步一点点`;

const dyFile=path.join(douyinDir,`${slug}.txt`);
fs.writeFileSync(dyFile,dypost);

// Also write latest
fs.writeFileSync(path.join(douyinDir,'latest.txt'),dypost);
console.log('Generated:',title);
console.log('Douyin post:',dyFile);
