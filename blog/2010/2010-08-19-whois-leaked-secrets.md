---
layout: post
title: 看好你家的Whois
categories: 技术
---
![](https://ws1.sinaimg.cn/large/4b91f9d5gy1fvneoaq7l4j20qo0f0qby.jpg)

先看[这则消息](http://adquan.com/article.php?page=&id=5665)：

> 最近两天，在新浪视频、优酷、酷六、土豆等众多国内知名视频网站的首页上，都出现了一支令人摸不着头脑的视频——在被称为“绿色地狱”的德国纽博格林的密林中，一名探险爱好者似乎发现了一只神秘的野兽，而他手中的摄像机记录下了当时的场景。乍看上去，视频很有些Discovery的风格，不过它所出现的位置却是各个网站的广告版面。
>
> 这支神秘的视频广告吸引了很多人的注意（由于格式问题，声音不是很同步，请谅解）
>
> 显然，这可能又是某品牌为其产品所推出的一支悬念广告。从执行的手法上来看，这部片子很有些美剧《Lost》的风格，在制作上显然下了不少的工夫。另外，在视频结束后，还向大家提供了一个网站的链接（**http://www.beastinside.cc**），并表示“真相在此，你敢看吗？”本着敬业的态度，我们勇敢地进入了这个网站，发现“真相”依然没有揭开，而是另外一支颇似监控录像的视频，同时还有一块倒计时牌在提醒大家距离谜底揭开的时间。
>
> [视频地址](https://v.youku.com/v_show/id_XMTk4ODM2NTk2.html)
>
> （下略）

在给出域名的那一刻，这则广告就输了。

去查询一下那个域名**http://www.beastinside.cc**的[WHOIS信息](http://pandavip.www.net.cn/cgi-bin/Whois.cgi?domain=beastinside&cc=yes&refer=)，很轻松就找到这个域名的注册者是**华晨宝马**。

```
[grs.hichina.com]
Domain Name ..................... beastinside.cc
Name Server ..................... dns13.hichina.com
dns14.hichina.com
Registrant ID ................... hc638608843-cn
Registrant Name ................. Kevin Zhang
Registrant Organization ......... BMW Brilliance Automotive Ltd.
Registrant Address .............. 25th Floor, Tower B, Gateway Plaza, No.18 Xia Guang Li
Registrant City ................. Beijing
Registrant Province/State ....... Beijing
Registrant Postal Code .......... 100027
Registrant Country Code ......... CN
Registrant Phone Number ......... +86.01084557057 -
Registrant Fax .................. +86.01084557557 -
Registrant Email ................ xintan.zhu@interone.cn
Administrative ID ............... hc638608843-cn
Administrative Name ............. Kevin Zhang
Administrative Organization ..... BMW Brilliance Automotive Ltd.
Administrative Address .......... 25th Floor, Tower B, Gateway Plaza, No.18 Xia Guang Li
Administrative City ............. Beijing
Administrative Province/State ... Beijing
Administrative Postal Code ...... 100027
Administrative Country Code ..... CN
Administrative Phone Number ..... +86.01084557057 -
Administrative Fax .............. +86.01084557557 -
Administrative Email ............ xintan.zhu@interone.cn
```

(下略)

WHOIS不会骗人。前几天搜狐先爆出一条消息[新华网悄然购买guoso.cn域名 或将推独立搜索](http://it.sohu.com/20100816/n274240961.shtml)：

> 搜狐IT通过查询发现，目前，guoso.cn及guoso.com.cn域名的所有者已为新华网络有限公司。据悉，两个域名注册商均为杭州创业互联科技有限公司，而新华网是通过中介完成的收购，目前，域名收购金额尚不清晰。
> ![img](http://photocdn.sohu.com/20100816/Img274240985.jpg)

这里面的域名注册人和DNS服务器露了马脚。我们对照一下新华网官方域名[news.cn的WHOIS信息](http://ewhois.cnnic.cn/whois?inputfield=value&value=news.cn&entity=domain&service=%2Fwhois)：

```
域名	news.cn
域名状态	serverDeleteProhibited
域名状态	serverUpdateProhibited
域名状态	serverTransferProhibited
域名联系人	周锡生
管理联系人电子邮件	adchina@xinhuanet.com
所属注册商	北京新网数码信息技术有限公司
域名服务器	ns1.xinhuanet.com
域名服务器	ns3.xinhuanet.com
注册日期	2003-03-17 12:20
过期日期	2011-03-17 12:48
```

可以看到，新华网作为国家骨干级别的网站，当然拥有自己的专用域名服务器，可是guoso.cn使用的却是域名注册商的NS。

我们[用域名注册者留下的email搜索](http://www.google.com/search?q=site:www.ename.net+pantong211%40163.com&filter=0)还可以发现他注册了一系列相关类似的域名。相比之下，这更像是囤积域名的“玉米虫”的行为。

所以这条新闻的可靠性存在疑问。

不管怎样，WHOIS都可以确认很多有用的信息，比如当年校内网改名人人网的时候，我们根据WHOIS，查询到[千橡注册了一个新的公司名称“千橡人人”来运营人人网](http://www.cnbeta.com/articles/90221.htm)。如此等等，不多举例。