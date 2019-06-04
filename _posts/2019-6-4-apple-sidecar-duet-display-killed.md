---
layout: post
categories: 数码
title: 这一次，苹果杀死了谁？
---

![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3peta6cjoj20lc0d0h1k.jpg)

*书航 6 月 4 日发于北京*

每次苹果升级 iOS / macOS 都会让一两个，以至更多第三方开发者直接“中枪”。这次 WWDC 2019，苹果又“杀死”了哪家第三方开发者？

相比以往，这次苹果的打击面更为广泛，不仅直接命中了前苹果工程师的著名作品 Duet Display，还可能会波及搭配 Mac 电脑的 Wacom 等第三方数位绘图板的销路。

即使自己的主打功能一夜之间被苹果“偷走”，一些著名的 iOS / macOS 辅助工具开发者也没有反应过激，他们还是尽力总结出自己跟系统自带功能相比的优越性，擦擦眼泪，继续向前。

## 走自己的路，让别人无路可走

历史上 iOS 跟 Android 或者 Windows 比较的时候，总会有诸多不便之处让用户抓狂。从早期“越狱”开始，一些开发者用自己的双手创造插件，为 iOS 带来众多用户呼唤已久的一些功能，或是干脆创造一些全新的交互方式。

但是，苹果有时候会用系统更新纳入一些第三方软件的功能，让这些软件——有些是收费软件，同时是软件作者的谋生手段——失去用武之地。

例如，在早期“越狱”中最常使用的功能是模仿安卓手机的全局下拉通知栏，苹果在 2011 年的 iOS 5 引入通知中心，让“越狱”装通知栏变得没有必要。

“越狱”的另一个重要用途是安装 iFile [1] 这样，类似 Windows 或安卓的文件管理器，改变 iOS 以应用为单位，不显示真实文件系统，无法做剪切、复制、粘贴文件等基本操作的状况。

苹果在 iOS 11 引入“文件”应用，并在这次 WWDC 发布的 iOS 13 对文件应用做重要更新，允许其直接读取 U 盘内容。虽然跟真实的文件系统仍有距离，但苹果无疑正逐步模拟人们以文件为单位的操作习惯，同时兼顾了安全性。

“越狱”还有一个颇受中国用户喜爱的用途是骚扰电话拦截。2016 年 iOS 10 引入的“来电阻止与身份识别”系统功能，允许 360、触宝、腾讯等第三方开发商，将自身积累的骚扰电话数据库和 iOS 系统级别的拦截相结合。[2]

在越狱销声匿迹之后，此类原本需要“魔改”系统的功能，都不得不服从于系统为第三方应用分配的能力，不得越雷池一步。尽管如此，仍有各种应用能“戴着镣铐跳舞”，引入一些系统级别的功能调整。

2016 年 iOS 以及 2017 年 macOS 加入的“夜览”功能，和自动调节显示器色温，以保护眼睛的专用小工具 F.lux 功能完全重合 [3] 。该产品从 2009 年开始已经正常更新多年，并获得了全球范围的拥趸。当时 F.lux 刚刚准备开发 iOS 版本，而且还必须先越狱才能用。

![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3pi1dz114j20ej0dywfh.jpg)

苹果自己做了“夜览”的这一变故，也使得 F.lux 的 iOS 版本始终停留在 0.9986，因为没有了开发正式版的必要。后来，Windows 10 也加入了按时段调整为黄光的“夜灯”功能，使得如今 F.lux 只有在 Linux 平台才具备不可替代性。

Mac 的文件管理器 Finder（访达）多年来一直缺少多标签页功能（其实 Windows 也缺少这个功能）。一款小工具 TotalFinder 可以为 Finder 窗口带来类似谷歌浏览器 Chrome 一样的标签页样式。[4]

![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3phtme863j21040nwnbb.jpg)

然而，苹果在 OS X 10.9 Mavericks 引入了官方的 Finder 多标签功能，与此同时为 TotalFinder 带来了不兼容的问题。

## 前苹果工程师 VS 苹果

6 月 3 日深夜，苹果召开 WWDC 2019 并宣布了单独的 iPad OS、新的 iOS 和 macOS 。当 Sidecar（直译为摩托车旁边加上的“车斗”，见题图）功能宣布的那一瞬间，我和 TechCrunch 的编辑 [5] 以及其它很多人一样都第一时间想到了同一个可怜的产品：Duet Display。

Duet Display 的作者 Rahul Dewan 是苹果前工程师，他是最早进入将 iPad 用作 Mac 副屏显示这一领域的开发者之一，他在苹果锻炼的专业技能，让 Duet Display 率先实现了以有线或无线方式显示 Mac 屏幕镜像或延伸，同时以手指触摸模拟鼠标单击的操作方式。

![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3phzxvmvqj20pv0etqke.jpg)

此后，Astropad 进一步支持将 iPad 作为 Mac 的主屏幕而不是副屏，这使得你可以让 iPad 搭配一个 Mac Mini 一起使用。[6]

而硬件产品 Luna Display 则允许电脑将 iPad 识别为一个物理显示器，而不是使用模拟的镜像技术，以避免延迟。

几家产品之间你追我赶，功能不断升级。2018 年 12 月，Duet Display 宣布使用 Mac 的硬件加速功能 [7] ，并号称比 Luna Display 连接速度更快，而且是以纯软件的方式，花费仅为购买 Luna Display 硬件的 1/10。

在 WWDC 之前，就有媒体已经曝光了苹果将官方支持 iPad 作为附属显示器的传闻；随着 macOS 10.15 Catalina 的 Sidecar 功能由传闻变为现实，原本留给 Duet、Luna、Astropad 等厂商的最后一线希望也随之破灭。

## 数位板成为被殃及的“池鱼”

iPad Pro 和 Apple Pencil 的搭配可以说非常完美——假如你是严格限定在 iOS 应用生态圈内的话。

在 Pencil 出现之前，我曾经买过一根第三方的 iOS 触控笔，是由著名绘图应用 Paper 开发商 FiftyThree 推出的笔，名字也叫 Pencil。在 Apple Pencil 上市的第一时间，我曾前去试用，结果并不意外：“53 或成最大输家”。[8]

>“如果不看价格，可以说 Apple Pencil 和 Surface Pro 触控笔是并列第一的，要远远超过 53 Pencil 的使用感受……我认为 Apple Pencil 是铅笔，而 Surface Pro 触控笔更像是中性笔或者钢笔，53 Pencil 像是记号笔或者是蘸满墨的毛笔。”

尽管初代 Apple Pencil 插入 iPad 充电口的配对方式极其滑稽，但这依然无法阻挡 Apple Pencil 成为业界公认的在 iPad 上表现最好的触控笔产品，而 53 Pencil 则成为如上所述，又一个“官方逼死同人”的牺牲品。

利用 Apple Pencil 可以在 iOS 内置的备忘录，以及 GoodNotes、OneNote 等第三方笔记软件上画出非常精彩的作品，软件会帮你动态调整运笔时可能的一些瑕疵，让你在屏幕上书写的效果甚至好于用真正的纸和笔手写。

![()](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3phwuwsexj20c80gbqc4.jpg)

（图片来源：航通社）

只不过，iPad 上面的应用跟 Mac 上的有着“生殖隔离”，而描绘矢量图象则重度依赖 Adobe Illustrator、CorelDRAW 这些 Mac 应用，Apple Pencil 的优势并不能直接移植过去。

截至今日之前，假设你想对着电脑桌面做背景直接描图，而不是从一张白纸开始创作的话，那么像 Wacom 这样的第三方数位板厂商，依然是唯一的选择。

Sidecar 不仅是官方替代 Duet Display 等工具的手段，而且是所有同类功能中，唯一官方支持 Apple Pencil 精确定位的。这就意味着，这只完全有能力和 Wacom 等高端笔同台竞技的笔，从此可以起到和 Wacom 差不多的效果了。

而数位板价格之高，也是不在画画这行的普通人难以想象的。现在，花同样甚至更少的钱，你可以买到一个精度不差太远的板子和笔，而且这块板又可以当 iPad 使（它其实就是 iPad），是不是高下立现了？

## 苹果“借用”第三方创意是否有尽头？

苹果长期将 iPad Pro 定义为生产力工具，而真正适用于大多数人的生产力工具，差不多必须有鼠标、键盘，必须支持多窗口、平行多任务，必须有一个高度开放的文件系统，等等。

也就是说，人们心目中对“生产力工具”的定义，长期以来受到 PC 和 Mac 的思维定势的深深束缚。而强迫人们改用 iPad ，以触控等新方式重塑生产流程，既需要繁琐的培训，也没太大必要。这深深限制了 iPad 向着苹果所期望的“生产力”方向的演进。

很多人呼吁干脆让 iPad 直接用上 macOS，或者让 MacBook 支持屏幕触控——隔壁的 Windows 10 已经通过 Surface 这样的二合一平板证明了这种方式的可行性。然而从很多方面来说，苹果都绝不想就这么让步。

一方面，苹果设备和服务现在最大的竞争力就是生态、安全与隐私。传统的“生产力”设备，用户对机器有太大的操作权限，而很多“生产力”的实现也是通过对权限的深度破解来曲线达成的，例如修改 hosts，用终端运行 python 等命令行程序，在浏览器用 F12 调出开发者工具等。如果完全平移 macOS 的架构，会对 iPad 这个产品线此前一直积累的安全技术、操作习惯和业已建立的 App Store 生态同时构成威胁。

另一方面，这也是个“面子”问题。苹果曾在 WWDC 2006 公开取笑微软当时的旗舰新系统 Windows Vista 借鉴模仿了大量 Mac OS X 累积更新功能，如 Spotlight、Safari RSS 阅读器、独立的邮件和日历应用等。[9]

![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3phvk6fi7j20u80dw4bg.jpg)

而万一 macOS 和 iOS 之间的触摸“次元壁”真的打通，这一向 Windows 10 和 Surface 的终极“致敬”，其程度可就远远超出当时苹果所谴责的对象。

所以，利用 Sidecar 将 Mac 屏幕投射到 iPad 上，已经是苹果对“生产力”定义做出让步的一个极限。

目前，仍有一些 iOS 和 macOS 的小工具，其实质上就是在 iOS 复制一些仅在 Mac 或者 PC 才具备的功能，或是一些跨平台的应用要单独开发一个 iOS 版本。但苹果暂时不愿意彻底打通 iOS 和 macOS 的应用体系，还是给剩余的此类工具留下了喘息之机。这可能也是苹果“逼死”第三方应用所能到达的尽头。

## 被苹果“借鉴”了怎么办？

对于 F.lux、TotalFinder、Duel Display 等前赴后继的先烈来说，当他们跟其它人一样追完 WWDC 之后，马上面临的一个问题就是：我今后怎么办？

它们给出的答案是：扩展自己除了主力功能之外的其他功能；进一步打磨差异化的用户体验；利用跨平台优势，构建跨操作系统、多终端同步的护城河。

TotalFinder 之前因 Finder 多标签为人所知，在官方引入此功能后，它需要想一些其它的办法来留住付费用户和吸引新用户。

例如，它可以给文件和文件夹整体标注彩色标签，比系统自带的小圆点更醒目；可以将某个标签页的文件夹固顶显示，总在最前；可以在一个窗口内并列打开两个左右对称的文件夹，方便在文件夹之间拖动文件，等等。

苹果官方抢了生意并没有打消 TotalFinder 的斗志，它愈挫愈勇，把 Finder 玩出了花，也让一些有余力有兴趣折腾和优化系统的忠实用户继续跟随下去。

在 Sidecar 公布之后，同样做 iPad 副屏显示的 Luna Display 发布了功能对比表格 [10] ，劝告付费用户：“我们不是给所有人准备的。但如果你是专业人士，我们会满足你的需要。”

对比指出，跟苹果 Sidecar 相比，Luna Display 的独有优势包括：天生跟所有 Mac 应用适配，而不是仅仅适配 Adobe 等少部分产品；可以兼容 Mac Mini；因为是硬件信号放大器，可以在 10 米远的地方链接；可以校正颜色；可以获得优先技术支持。

![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g3phftyi14j20sg0ngq71.jpg)

这些列出的好处是否足以让人掏钱买一个苹果官方免费提供的功能，尚且令人存疑，但看到这溢出屏幕的“求生欲”，还是很值得人们赞赏的。

更多的产品，选择了苹果最不可能“抄袭”的一条道路：将自己的服务延伸到 Android 和 Windows。

苹果曾一度考虑将自家服务延伸到 Windows 上，iTunes、Safari 和 iCloud 控制面板都有 Windows 版本。不过近几年，这些 Windows 版本陆续停止了技术支持。除了 Apple Music 有推出 Android 客户端，Apple TV 延伸到一些第三方厂家的电视机之外，苹果总体上的策略是将生态收缩到自家的设备和系统内部，让自己做的服务成为苹果用户的特权。

对于一些“果粉”来说，苹果的生态构建是成功的，他们从手机、平板、电脑到手表全都选择苹果一家的产品，也能因此获得最好的体验。但他们跟所有数码设备用户相比，只是极少数。

这样的策略也就让一些以联机服务形式存在，而不是仅仅售卖一份软件拷贝了事的产品，可以将自己的触角延伸到 Windows、Android 等平台，服务同时购买多台不同厂家设备的用户。

尽管各操作系统厂商，都各自有 iCloud、Google Drive 和 OneDrive 的云端硬盘方案，这仍然不妨碍 Dropbox 获得长足发展。

像是 LastPass、1Password 等第三方密码管理工具，虽然在 iOS 12 的“钥匙链”升级之后功能被替代，但要想在 Windows 电脑和 iPhone，或者 Mac 和安卓手机之间共享密码库，还是非它们莫属。

想必今后像 Duet Display 这样的产品，也能通过开发让 iPad 作为 Windows 10 电脑副屏等类似的能力，在苹果“借鉴”后也能获得一线生机。

[1] <http://cydia.saurik.com/package/eu.heinelt.ifile/>

[2] <https://www.ithome.com/html/iphone/257791.htm>

[3] <https://justgetflux.com/news/2016/01/14/apple.html>

[4] <https://www.lizhi.io/review/81767732>

[5] <https://techcrunch.com/2019/06/03/apples-new-sidecar-feature-is-great-for-users-but-third-parties-take-a-hit/>

[6] <https://www.macx.cn/archiver/tid-2218538.html>

[7] <https://techcrunch.com/2018/12/05/duet-display-2-uses-hardware-acceleration-to-catch-up-with-luna-display/>

[8] <https://cn.technode.com/post/2015-12-07/3-smart-pens/>

[9] <https://www.youtube.com/watch?v=N-2C2gb6ws8>

[10] <https://lunadisplay.com/pages/luna-vs-apple-sidecar>