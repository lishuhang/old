---
layout: post
title: 如何解决MSN登陆错误代码8100030d问题
categories: 技术
---
![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g1s2v19h2vj20hs04l400.jpg)

如果你在登录WLM时检测到错误代码8100030d，请按以下提示操作：

1、检测并安装最新版本的WLM；
2、删除缓存文件。

MSN Messenger用户

打开命令提示符，依次输入以下命令：

> cd
> cd %appdata%microsoft
> cd “msn messenger”
> del /s listcache.dat

Windows Live Messenger 用户

进入你的个人文件夹下，找到下列的目录，并且删除它们和其中的所有子文件夹。记得首先要在文件夹选项里勾选显示隐藏和系统文件，还有显示已知文件类型的扩展名。

winxp用户

> C:Documents and Settings Your Windows logon name Contacts Your Messenger e-mail address
> C:Documents and Settings Your Windows logon name Local SettingsApplication DataMicrosoftWindows Live Contacts Your Messenger email address

Vista用户

> C:Users Your Windows logon name Contacts Your Messenger e-mail address
> C:Users Your Windows logon name AppDataLocalMicrosoftWindows Live Contacts Your Messenger e-mail address

[源文档](http://messenger-support.spaces.live.com/Blog/cns!8B3F39C76A8B853F!13937.entry)