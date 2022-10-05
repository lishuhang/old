---
layout: post
title: 为什么切换到“地址”栏的键盘快捷键很奇怪？
categories: 历史
---
![img](http://ww1.sinaimg.cn/large/4b91f9d5gy1funbwt4q88j20pw0gmaym.jpg)

据说，所有看起来很小的谎言，都需要更大的谎言来弥补。这句话的适用范围不仅限于说谎——任何一个你初看无法理解的，匪夷所思的事情背后，可能都是为了弥补其他地方一个小小问题而引发的连锁反应。线索扭曲到一起，环环相扣，你会发现只能如此。

今天我们再听隔壁老王……不对， [老陈（Raymond Chen）的博客](https://blogs.msdn.microsoft.com/oldnewthing/20170314-00) 来讲一个关于连锁反应的小故事。

Windows XP 同时为我们带来了 Internet Explorer 6，这是不止一代互联网开发者们既爱又恨的事实上的另一套互联网标准，直到它的位置被 Chrome 等现代浏览器所取代。

Windows Vista 及以前的资源管理器和 IE 共用一个外壳/Shell，所以你可以在“我的电脑”的地址栏输入网址，也可以在 IE 打开 C 盘。

在 IE 和资源管理器当中，一个不太有人关注的问题是： **为什么把屏幕焦点切换到“地址”栏的键盘快捷键是 Alt + D？**

中国的用户可能会以为 D 是“地址”的拼音首字母，然而这种解释不能让人信服：其他的快捷键几乎都是采用的英文首字母，比如“保存”（Save）Ctrl + S，“打印”（Print）Ctrl + P。与此同时，使用英文的小伙伴也在怀疑为什么“地址”（Address）不是 Alt+A。

原因很简单：**Alt+A 被占用了。它的用途是……展开“收藏”菜单** 。然而，“收藏”（Favorite）不应该是 Alt + F 吗？

原因也很简单：**Alt + F 的用途是……展开“文件”（File）菜单。**

这种热键被占用的问题，其实只要是用 PC 或 Mac 的都应该多少了解，而因为 Windows 用了更多的键盘快捷键，它出现的热键冲突问题更为频繁。

早期一个版本的 QQ 在部分电脑上只要装好第一次运行，就会提醒你“截图热键被系统占用”，你需要手动更换一个键位组合或者放弃用键盘调用该功能。

![img](http://ww1.sinaimg.cn/large/4b91f9d5gy1funbwhbnlkj20ca05etax.jpg)

但对于系统应用之间，是严格不允许出现热键冲突问题的，好在系统级应用可以优先抢占一部分热键。

也由于第三方浏览器有很多键使用不了，所以只能去找更冷门的键位组合，在 Firefox 等浏览器中地址栏热键是 Ctrl + L。在高冷了很多很多很多很多年以后，IE 同时支持用 Alt + D 和 Ctrl + L 定位到地址栏。

对于这两种快捷键用法，群众褒贬不一，有人认为微软的 Alt + D 因为用单手就能摁住，所以相对更好用一些。而 [Office 2007 开始引入的 Ribbon 界面](https://cn.technode.com/post/2017-10-04/hts-171004/) 和后来的 UWP 应用，则都是面向图形界面和触屏用户的，对快捷键的设置也就越来越随性了。

不管怎样，至少在现阶段，键盘依然是众多要使用电脑的工种效率最高的输入方式。对我们码字的和程序猴子们，那自然是不言而喻；而就算你平时是修图的，给你一套这样的 [PS 快捷键速查键盘贴](http://enfuzed.com/adobe-creative-suite-keyboard-shortcuts/) ，相信你也会运指如飞，大大提高工作效率吧。

![img](http://ww1.sinaimg.cn/large/4b91f9d5gy1funbw835mzj20lc08kn31.jpg)

[动点科技](https://cn.technode.com/post/2018-01-30/alt-d-for-address-bar/)

