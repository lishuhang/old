---
layout: post
title: 解决优化后XP不能自动更新的问题
categories: 技术
---
![](http://ww1.sinaimg.cn/large/4b91f9d5gy1g1s2u8qyhuj20dw08etec.jpg)

曾经听到有人推荐让WindowsXP快10倍的软件，这是一个德国人做的优化程序，以停止部分服务 达到优化的目的，但是在按照要求进行优化以后，很多比较有用的服务也不能使用了，包括防火墙、安全中心、自动更新。别的好说，如果机器不能自动更新，实在 是一件让人烦心的事。今天下午本人就碰到了这个问题。

在访问Windows Update或者Microsoft Update网站时，网页提示错误代码 0x80070422 （显示在屏幕右上角），大意是提示Windows Update服务被禁用，需要到组策略启动相应的服务。不过鉴于在此之前我们曾经做过优化，在进行操作之前必须先用那个优化程序的还原功能，也就是在操作 时选第4项。可是在操作时又出现了问题。

启动自动更新服务时出现提示对话框，说与此服务相关的组件未能启动，因此启动失败。这显然也是那个优化方案的结果。为此又去百度进行了查找，发现了需要先重新注册的dll文件。

> 注册 qmgr.dll和qmgrproxy.dll
>
> ```
> regsvr32 qmgr.dllregsvr32 qmgrproxy.dll
> ```

在注册 qmgrproxy.dll 时单击“确定”后系统提示说找不到模块，经过测试不影响恢复。

做完后我们回到组策略窗口，启动所有能启动的服务。不行的话再从头到尾来一遍。

一切工作完成，问题解决。

Windows自动更新是一项至关重要的功能，现在xp破解正版验证的软件满天飞，所以在能保证绕过正版验证的情况下，建议大家开启自动更新功能，这是接受高危补丁、必要更新的最方便的方式。

下面把运行windows update时遇到错误情况的解决方案归纳如下，请遇到问题时依次尝试：

> 1、确保用的是IE，不是firefox或者opera（为了cb广大的opera fans特别提醒，不要习惯成自然^_^）
> 2、禁止当前浏览器拦截弹出窗口，换句话说就是允许弹出窗口（同样很简单，但是容易被忽略）。
> 3、查看hosts文件有没有被修改，恢复其原状。hosts文件一般位于$WINDIR$system32driversetc。
> 4、清空IE缓存，临时文件、历史记录。
> 5、**确保自己当前是系统管理员，或者在“控制面板”-“用户帐户”删除所有不用的帐户，然后重新启动。这一条是最重要的，即使不用管理员帐号也能更新，但是也许会出现不可预知的错误**
> 6、适当的调整ie对activex、javascript的限制，可以在internet选项的“安全”选项卡里调整。如果怕影响安全性，可以仅对http://update.microsoft.com进行调整。
> 7、注册URLMON.dll，MSXML3.dll，jscript.dll，qmgr.dll和qmgrproxy.dll：regsvr32 dll名称.dll。
> 8、将WUAUSERV和BITS添加到SvcHost进程中：打开REGEDIT，浏览到HKEY_Local_MachineSoftware MicrosoftWindowsNTCurrentVersionSvcHost，打开“netsvcs”项。在“数值数据”下，将 “BITS”和“WUAUSERV”添加到服务列表中。修改以后重新启动。【适用于错误代码0x8007043B】
> 9、如果 DataStore 文件夹中的内容不匹配，【适用于错误代码0x80070002】可以考虑删除%windir%SoftwareDistributionDataStore 文件夹的所有内容，删除不了就先把自动更新服务停用。
> 10、不要使用代理。检查是不是Windowsupdate在受限站点的名单里面；如果是，将其删掉。
> 11、设置合理的系统日期和时间。
> 12、确保相关服务启动。服务名称：Automatic update（或者“自动更新”），BITS（或者“后台智能传送服务”）等。方法：运行services.msc，然后启动相应的服务，如果不知道应该启动哪个，就把能启动的都启动，日后再逐一排除。

摘自ms知识库，百度知道，以及搜索结果