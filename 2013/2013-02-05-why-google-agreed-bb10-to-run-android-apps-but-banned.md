---
layout: post
title: 为什么黑莓可以跑Android应用，而阿里云就不行？
categories: 热点
---
![blackberry-android.jpg](http://ww1.sinaimg.cn/large/4b91f9d5gy1fulu5z1g2pj20i20a6n21.jpg)

黑莓公司日前在开发者大会上宣布，黑莓10内置的Android应用兼容功能已经开始[支持Android 4.1系统上的应用](https://web.archive.org/web/20130207020447/http://crackberry.com/blackberry-android-runtime-be-upgraded-android-41-jelly-bean)。而在开发者大会上也有消息爆出，现在黑莓应用商店近10万个程序中，[40%都来自Android应用的“一键移植”](https://web.archive.org/web/20130207020447/http://www.intomobile.com/2013/02/03/40-blackberry-10-apps-repackaged-android-apks/)。

这种取巧的办法不禁让人想起阿里云OS，它官方宣布兼容Android应用后没多久就接到谷歌最后通牒，又被拎出来到国际舞台上数落一番。

我查阅了双方一些技术文档后总结了黑莓和阿里云在兼容Android应用方面的几点区别，这可能是谷歌放过黑莓却对阿里云无法容忍的原因所在：

**1、在开发者一端，黑莓对Android应用的支持是通过重新打包实现的。**

黑莓向开发者提供Android Runtime，APK包要重新编译成BAR文件，并提交到App World，这个过程要开发者本人完成，他也拥有手中的源代码的版权，因此对自己开发的东西移植并不犯法。黑莓只多做了两件事——一是[一键移植，前所未有的简单](https://web.archive.org/web/20130207020447/http://www.cctime.com/html/2013-1-30/20131301525187790.htm)；二是前段时间只要[上传一个审核通过就给你100美元](https://web.archive.org/web/20130207020447/http://articles.csdn.net/shangwuzhuanqu/heimeizhuanqu/Java_Android_Rumtime/2012/1213/2812827.html)。

**2、在用户一端，黑莓对Android应用的支持是通过虚拟机实现的。**

Android早期版本也包含一个Java模拟器，并且在屏幕下方留下了虚拟方向键。现在连菜单、Home等实体按键都去掉的黑莓机器，使用虚拟机类的Android Player运行APK包，不仅无可非议而且也是比较好的解决方案。当然，这么做必然意味着牺牲性能。如果在黑莓平台上还依赖Android应用，为什么不直接买一部Android手机呢？

**3、黑莓有自己的原生应用格式。**

黑莓10的应用后缀名是BAR，这个文件格式的开发和内部结构都和Android有明显区别，它们可以支持的功能也不一样。Android应用被转制成黑莓应用后[会丢失大部分硬件功能](https://web.archive.org/web/20130207020447/http://subject.csdn.net/rim0113/)，比如蓝牙，麦克风，摄像头，NFC，VoIP，电话，光感器。当然不排除黑莓以后改进技术将上述接口映射到自己设备的可能，但这个过程将很艰难。就算它多年修炼做到了完美兼容，这个举动也不一定有意义。

阿里云自身的“应用”只是换了个方式的手机版网站书签，[“应用商店”里面全是Webapp](https://web.archive.org/web/20130207020447/http://apps.aliyun.com/index.htm)，给开发者的所谓SDK也是怎样部署移动版网站到阿里云服务器上，[没有原生应用的开发指南](https://web.archive.org/web/20130207020447/http://bbs.aliyun.com/simple/?t747.html)。这种情况下，还对APK完美兼容，就算整个事件硬被搞成一个罗生门，还是平息不了人们心中的疑问。

如果还有后来者想“借用”Android应用商店的东西，应该也要遵循和上述举措类似的规则。这些规则导致的结果就是安卓生态圈外的系统兼容性必然赶不上圈内的系统，也验证了“天下没有免费的午餐”这句话。

[Tech2IPO](http://tech2ipo.com/57932)