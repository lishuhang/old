(function() {

window.Config = {
	
	// Ajax�������
	ajax : {
		headers : { "Content-Type" : "text/plain;charset=GBK;" }		// ����ͷ
	},
	
	// �༭������
	editor : {
		/* debug
		previewCss : "css/preview.css",
		uploader : "uploadFile.swf"
		// */
		
		// formal
		previewCss : "/css/preview.css",
		uploader : "/swf/uploadFile.swf"
		//uploader : "https://cms.ws.netease.com/swf/uploadFile.swf"
		// */
	},
	
	// Ajax����Դ
	dataSrc : {
		/* debug
		videoTopics : "data/videotreeforjson.asp",
		videoList : "data/videolistforjson.asp",
		videoSwf : "data/video.asp",
		imageList : "data/imagelistforjson.asp"
		// */
		
		// formal
		videoTopics : "/post/videotreeforjson.jsp",
		videoList : "/post/videolistforjson.jsp",
		videoSwf : "/temp/video.jsp",
		imageList : "/cms/associatedquery.do"
		// */
	},
	
	// ��ʾ
	tips : {
		loading : "��ȡ�У����Ժ󡭡�",
		noPicture : "������ƥ���ͼƬ",
		noVideoResult : "������ƥ�����Ƶ",
		noVideo : "������Ƶ"
	},
	
	// ���β˵�
	tree : {
		
		shrinkIcon : "/images/new_cms_img/tree_shrink.png",	// ������ͼ��
		expandIcon : "/images/new_cms_img/tree_expand.png",	// չ����ͼ��*/
		
		/*shrinkIcon : "images/tree_shrink.png",	// ������ͼ��
		expandIcon : "images/tree_expand.png",	// չ����ͼ��*/
		
		shrinkText : "����",
		expandText : "չ��",
		defaultExtended : 1		// Ĭ��չ������
	},
	
	// ��Ƶ����
	video : {
		width: 490,
		height: 394,
		swfUrl : 'http://swf.ws.126.net/flvplayer081128/~false~<#=topicid#>_<#=vid#>~<#=imgpath#>~.swf',
		swfParams : {
			AllowScriptAccess : "always",
			Scale : "ShowAll",
			BgColor : "#ffffff",
			AllowFullScreen : true,
            wmode : 'opaque'
		},
		videoParams : {
            allowfullscreen : 'true',
            allowscriptaccess : 'always',
            allownetworking : 'all',
            wmode : 'opaque'
		}
	}
};


// ------------------------------------------------------------------------------
// ���ߺ�����չ Begin

var isUrl = /^https?:\/\//i, isDate = /^(\d{4})-(\d{1,2})(?:-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?)?$/;

/**
 * �ж�ָ���ַ����Ƿ�Url
 * @param {String} ָ���ַ���
 * @return {Boolean} ָ���ַ����Ƿ�Url
 */
$.util.isUrl = function(str) {
	return isUrl.test(str);
};

/**
 * ȥ��ָ���ַ�����ͷ��http(s)://
 * @param {String} ָ���ַ���
 * @return ��������ַ���
 */
$.util.trimUrl = function(str) {
	return str.replace(isUrl, "");
};


/**
 * �ж�ָ���ַ����Ƿ�������ڸ�ʽ
 * @param {String} ָ���ַ���
 * @return {Boolean} ָ���ַ����Ƿ�������ڸ�ʽ
 */
$.util.isDate = function(str) {
	var dateParts = str.match(isDate);
	if (dateParts) {
		dateParts[1] = parseInt(dateParts[1]);	// ��
		if (dateParts[1] < 1970) {
			return false;
		}
		dateParts[2] = parseInt(dateParts[2]);	// ��
		if (dateParts[2] < 1 || dateParts[2] > 12) {
			return false;
		}
		if (dateParts[3] != "") {	// ��
			var temp = new Date(dateParts[1], dateParts[2], 0);
			dateParts[3] = parseInt(dateParts[3]);
			if (dateParts[3] < 1 || dateParts[3] > temp.getDate()) {
				return false;
			}
		}
		if (dateParts[4] != "" && dateParts[5] != "" && dateParts[6] != "") {	// ʱ���֡���
			dateParts[4] = parseInt(dateParts[4]);
			dateParts[5] = parseInt(dateParts[5]);
			dateParts[6] = parseInt(dateParts[6]);
			if (dateParts[4] < 0 || dateParts[4] > 23 ||
				dateParts[5] < 0 || dateParts[5] > 59 ||
				dateParts[6] < 0 || dateParts[6] > 59) {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
};


/**
 * ��һ���ַ��������л�Ϊjson����
 * @param {String} ָ���ַ���
 * @return {Object} json����
 */
$.util.toJson = "undefined" != typeof JSON ? JSON.parse : function(str) {
	var data;
	try {
		eval("data = " + str + ";");
	} catch(e) {
	}
	return data;
};


var chsNumbers = ["��", "һ", "��", "��", "��", "��", "��", "��", "��", "��", "ʮ", "ʮһ", "ʮ��", "ʮ��", "ʮ��", "ʮ��", "ʮ��", "ʮ��", "ʮ��", "ʮ��", "��ʮ", "��ʮһ", "��ʮ��", "��ʮ��", "��ʮ��", "��ʮ��", "��ʮ��", "��ʮ��", "��ʮ��", "��ʮ��", "��ʮ"];
/**
 * ��ָ�����֣�0��30��ת��Ϊ��������
 * @param {Number} ָ������
 * @return {String} ��������
 */
$.util.toChsNumber = function(num) {
	return chsNumbers[num];
};


/**
 * #����ָ���ַ����ĳ��ȣ����ְ������ַ�����
 * ������ascii�������127�Ķ��������ַ����ȣ���ֹ����������Щ���ֽ��ַ���ռ�������ַ��Ŀ��
 * @param {String} ָ���ַ���
 * @return {Number} ָ���ַ����ĳ���
 */
$.util.countText = function(str) {
	//return str.replace(/[^\x00-\xff]/g, "**").length / 2;
	var len = str.length, result = 0;
    if(typeof str != "string") {
        return result;
    }
    while(len) {
        result += str.charCodeAt(--len) > 127? 1: 0.5;
    }
    return result;
};

$.util.copyToClipboard = function(txt) {
	if(window.clipboardData) { 
		window.clipboardData.clearData();   
		window.clipboardData.setData("Text",txt);
	} else if(window.netscape) {   
		try {   
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
		} catch (e) {   
			alert("��������ܾ���\n�����������ַ������'about:config'���س�\nȻ��'signed.applets.codebase_principal_support'����Ϊ'true'");   
		}   
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard),
			trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!clip || !trans) {  
			return; 
		}
		trans.addDataFlavor('text/unicode'); 
		
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString); 
		str.data = txt;   
		trans.setTransferData("text/unicode", str, txt.length*2);   
		var clipid = Components.interfaces.nsIClipboard;   
		if (!clip) {   
			return false;
		}
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
	return true;
}

$.util.getFromClipboard = function() {
	var data;
	if (window.clipboardData) {
		data = window.clipboardData.getData("Text");
	} else if(window.netscape) {
		try {   
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
		} catch (e) {   
			alert("��������ܾ���\n�����������ַ������'about:config'���س�\nȻ��'signed.applets.codebase_principal_support'����Ϊ'true'");   
		}   
		
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard),
			trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!clip || !trans) {  
			return; 
		}
		trans.addDataFlavor("text/unicode");
		
		clip.getData(trans, clip.kGlobalClipboard);
		var str	= {};
		var strLength = {};
		trans.getTransferData("text/unicode", str, strLength);
		if (str) {
			str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
			data = str.data.substring(0, strLength.value / 2);
		}
	}
	return data;
}
	
	
/**
 * ��ָ������ת��Ϊ��λ���ַ���
 * @param {Object} ����
 * @return {String} ��λ�����ַ���
 */
var toTwoDigit = function(num) {
	return num < 10 ? "0" + num : num.toString();
};
/**
 * ����ָ����ʽ�������ַ���
 * @param {String} ��ʽ�ַ���
 * @return {String} ָ����ʽ�������ַ���
 */
Date.prototype.format = function(formation) {
	var year = this.getFullYear(),
		month = this.getMonth() + 1,
		date = this.getDate(),
		hours24 = this.getHours(),	// 24Сʱ��
		hours12 =  hours24 > 12 ? hours24 - 12 : hours24,	// 12Сʱ��
		minute = this.getMinutes(),
		second = this.getSeconds();

	return formation.replace(/[ymdhsHM]+/g, function($1) {
		switch ($1) {
			case "yyyy": return year;	
			case "yy": return year.toString().right(2);
			case "MM": return toTwoDigit(month);
			case "M": return month;
			case "dd": return toTwoDigit(date);
			case "d": return date;			
			case "HH": return toTwoDigit(hours24);			
			case "H": return hours24;
			case "hh": return toTwoDigit(hours12);
			case "h": return hours12;
			case "mm": return toTwoDigit(minute);
			case "m": return minute;
			case "ss": return toTwoDigit(second);
			case "s": return second;
			default: return $1;
		}
	});
};


/**
 * �滻�ڵ�
 * @param {HtmlElement} ԭ�ڵ�
 * @param {HtmlElement} �½ڵ�
 */
$.dom.replaceNode = function(oldNode, newNode) {
	if (oldNode.replaceNode) {
		oldNode.replaceNode(newNode);
	} else if (oldNode.parentNode.replaceChild) {
		oldNode.parentNode.replaceChild(newNode, oldNode);
	}
};


/**
 * ��ȡָ��Ԫ����ҳ���ϵľ���λ��
 * @param {HtmlElement} Ԫ��
 * @return {Object} ����
 */
$.style.getAbsPosition = function(elem) {
	var pos = {};
	if (elem.getBoundingClientRect) {
		var rect = elem.getBoundingClientRect();
		pos.y = rect.top + (document.body.scrollTop || document.documentElement.scrollTop);
		pos.x = rect.left + (document.body.scrollLeft || document.documentElement.scrollLeft);
	} else {
		pos.y = elem.offsetTop;
		pos.x = elem.offsetLeft;
	}
	
	return pos;
};

// ���ߺ�����չ End
// ------------------------------------------------------------------------------



// ------------------------------------------------------------------------------
// UI ��չ Begin

/**
 * ģ�徲̬��
 */
$.ui.Template = {
	
	/**
	 * ģ�建��
	 */
	_cache : {},
	
	/**
	 * ��ȡָ��ģ��Ĵ���
	 * @param {String} ģ����
	 * @return {String} ģ�����
	 */
	get : function(name) {	
		return this._cache[name] == null ? "" : this._cache[name];
	},
	
	/**
	 * ģ��ת��
	 * @param {String} ģ����
	 * @param {Object} ֵ����
	 * @return {String} ת����Ĵ���
	 */
	parse : function(name, values) {
		return $.util.parseTpl(this.get(name), values);
	},
	
	/**
	 * ��ȡҳ����ģ��������id Ϊtemplates���е�ģ����룬�˷������ڳ�ʼ������
	 */
	load : function() {
		var templates = $("#templates > div"), i = templates.length;
		while (--i >= 0) {
			this._cache[templates[i].title] = templates[i].innerHTML.replace(/(?:^\s*<!--)|(?:-->\s*$)/g, "");
		}
	}
};


/**
 * �ı����ȼ�����
 * @param {HtmlElement} �ı���Ԫ��
 * @param {HtmlElement} ��ʾ�ı����ȵ�Ԫ��
 */
$.ui.TextCounter = function(input, span) {
	if (!arguments.length) {
		return;
	}
	
	var t = this;
	t.constructor = arguments.callee;
	
	t._input = input; t._span = span;
	
	$.event.addEvent(input, "change", function() { t.getTextCount(); });
	$.event.addEvent(input, "keyup", function() {
		t._keyTimer && clearTimeout(t._keyTimer);
		t._keyTimer = setTimeout(t.getTextCount.bind(t), 120);
	 });
	
	t.getTextCount();
};

// �ı����ȼ�����ԭ�ͣ��������壩
$.ui.TextCounter.prototype = {
	/**
	 * ���ò���ȡ��ǰ�ı�����
	 * @return {Number} �ı�����
	 */
	getTextCount : function() {
		var textCount = $.util.countText(this._input.value);
		this._span.innerHTML = textCount;
		return textCount;
	}
};


/**
 * ����ҳ������
 * @param {Number} ��ǰҳ
 * @param {Number} ��ҳ��
 * @return {Object} ҳ������
 */
$.ui.buildPages = function(currentPage, pageCount) {
	var data = {
		pages : []
	};
	
	var i = 1, temp;
	
	while (i <= currentPage && i <= pageCount) {
		data.pages.push({
			seq : i,
			isCurrent : i == currentPage
		});
		
		if (1 == i) {
			i = Math.max(currentPage - 5, 2);
			if (i != 2) {
				data.pages.push({
					seq : -1
				});
			}
		} else {
			i++;
		}
	}
	
	i = currentPage; temp = Math.min(pageCount, currentPage + 5);
	while (++i <= temp) {
		data.pages.push({
			seq : i
		});
	}
	if (i - 1 < pageCount) {
		data.pages.push({
			seq : -1
		});
	}
	
	return data;
};

// UI ��չ End
// ------------------------------------------------------------------------------

})();