---
layout: post
title: Flash中调用外部程序
comments: true
categories: 技术
---
![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g1s2cub34zj20e207p0t6.jpg)

累死我了…………

需要调用一个外部的程序（swf转成的exe）。结果发现Flash5中可以使用的fscommand的exec方法，Flash6中不能使用了。 Flash5的代码如下：

> on (release) {
> fscommand(“exec”, “Test.exe”);
> }

后来去网上查找了一下相关资料，发现在Flash6以上为了提高安全性。对从Flash中调用外部程序有几个要求：

首先需要把swf文件发布为exe的工程。如：Flash程序a要调用外部程序b.exe，则Flash程序a必须发布为可执行文件格式。即文件名为a.exe。

要调用的程序必须位于调用程序同目录下的fscommand目录中，而且不能位于fscommand的子目录。如以上面为例b.exe必须a.exe下的fscommand目录中。

在flash 里的action里不要写fscommand 的路径，直接写exe文件全名。

这样修改了之后，问题解决。