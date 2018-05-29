(function() {

// ------------------------------------------------------------------------------
// UI ��չ Begin

// ���ö���
    var body = $(document.body), doc = document.documentElement;




    /**
     * �����������
     * @param {HtmlElement,HtmlElementArray,HtmlCollection} ���Ƶ�����Ԫ��
     * @param {HtmlElement,HtmlElementArray,HtmlCollection} ������
     * @param {String} ������ʾ��������¼���
     * @param {Number} ������ʱ����λ���룬Ĭ��Ϊ300����
     */
    $.ui.PopupLayer = function(ctrl, content, eventName, delay) {
        if (!arguments.length) {
            return;
        }

        var t = this;
        t.constructor = arguments.callee;

        t._ctrl = ctrl;
        t._content = content;
        t.delay = isNaN(delay) ? 300 : delay;

        var delayHide = t.delayHide.bind(t),
            clearDelay = t.clearDelay.bind(t);

        $.event.addEvent(ctrl, eventName, t.show.bind(t));
        $.event.addEvent(ctrl, "mouseout", delayHide);
        $.event.addEvent(ctrl, "mouseover", clearDelay);
        $.event.addEvent(content, "mouseover", clearDelay);
        $.event.addEvent(content, "mouseout", delayHide);
    };

// ����������෽��
    $.ui.PopupLayer.prototype = {
        /**
         * ��ʾ������
         */
        show : function() {
            $.style.addCss(this._content, "display:block;");
            this.onShow && this.onShow();
        },

        /**
         * ���ص�����
         */
        hide : function() {
            $.style.addCss(this._content, "display:none;");
            this.onHide && this.onHide();
        },

        /**
         * ��ʱ���ص�����
         */
        delayHide : function() {
            if (this._timerId === undefined) {
                this._timerId = setTimeout(this.hide.bind(this), this.delay);
            }
        },

        /**
         * ȡ����ʱ����
         */
        clearDelay : function() {
            if (this._timerId !== undefined) {
                clearTimeout(this._timerId);
                this._timerId = undefined;
            }
        }
    };



// UI ��չ End
// ------------------------------------------------------------------------------


// ------------------------------------------------------------------------------
// �༭�� Begin

    /**
     * �༭����
     * @param {HtmlElement} �༭����Ԫ�أ�����ΪiframeԪ�أ�
     * @param {String} ����
     * @param {String} �༭����Ĭ��Css
     * @param {Content} Ĭ������
     */
    function Editor(editor, encoding, defaultCss, content) {
        if (!arguments.length) {
            return;
        }

        var t = this;
        t.constructor = arguments.callee;

        t._area = editor;
        t._areaWin = t._area.contentWindow;
        t._areaDoc = t._areaWin.document;

        t._areaDoc.designMode = "on";
        t._areaDoc.contentEditable = true;
        t._areaDoc.charset = encoding;

        // д��Ԥ��Html
        t._areaDoc.open();
        t._areaDoc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=' + encoding + '" /><meta http-equiv="X-UA-Compatible" content="IE=7" />');
        if (defaultCss) {
            t._areaDoc.write('<link href="' + defaultCss + '" rel="stylesheet" type="text/css" />');
        }
        t._areaDoc.write('</head><body>' + (typeof content !== 'string' ? '<p></p>' : this._replaceRealElement(content)) + '</body></html>');
        t._areaDoc.close();

        $.event.addEvent(t._areaDoc, "keydown", t._fixKey.bind(t));
        if (t._areaDoc.createRange) {        // For FF
            $.event.addEvent(t._areaDoc, "keydown", t._setCursorInP.bind(t));
        }
        //���FF�� Ctrl+B/I/U��ݼ���ռ�õĽ������
        $.event.addEvent(t._areaDoc, "keydown", t._fixShortcut.bind(t));

        t._sendCommand("styleWithCSS", "false");	// ʹ��CSS��For FF

        // ��ʱ����
        $.event.addEvent(t._areaWin, "focus", function() {
            t.listen();
            if (!t._rangeTimer) {
                t._rangeTimer = setInterval(t.listen.bind(t), 600);
            }
        });
        $.event.addEvent(t._areaWin, "blur", function() {
            t._rangeTimer && clearInterval(t._rangeTimer);
            t._rangeTimer = null;
        });

        (function(){
            var fillChar = '\u200B',
                doc = t._areaDoc,
                startContainer,startOffset,
                endContainer,endOffset,
                isWebkit = function(){
                    return /webkit/.test(navigator.userAgent.toLowerCase());
                },
                isEmptyNode = function(node){
                    return !node.firstChild;
                },
                positionCursor = function(startContainer,startOffset,endContainer,endOffset,range,selection){
                    range.setStart(startContainer, startOffset);
                    range.setEnd(endContainer, endOffset);
                    selection.removeAllRanges();
                    selection.addRange(range);
                },
                selectNodeContents = function(node, range, selection){
                    range.setStart(node, 0);
                    //!range.endContainer && range.collapse(true);
                    range.setEnd(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);
                    //!range.endContainer && range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                },
                transformWordHtml = function () {
                    function isWordDocument( strValue ) {
                        var re = new RegExp( /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<v:)/ig );
                        return re.test( strValue );
                    }

                    function ensureUnits( v ) {
                        v = v.replace( /([\d.]+)([\w]+)?/g, function ( m, p1, p2 ) {
                            return (Math.round( parseFloat( p1 ) ) || 1) + (p2 || 'px');
                        } );
                        return v;
                    }

                    function filterPasteWord( str ) {
                        str = str.replace( /<!--\s*EndFragment\s*-->[\s\S]*$/, '' )
                            //remove link break
                            .replace( /^(\r\n|\n|\r)|(\r\n|\n|\r)$/ig, "" )
                            //remove &nbsp; entities at the start of contents
                            .replace( /^\s*(&nbsp;)+/ig, "" )
                            //remove &nbsp; entities at the end of contents
                            .replace( /(&nbsp;|<br[^>]*>)+\s*$/ig, "" )
                            // Word comments like conditional comments etc
                            .replace( /<!--[\s\S]*?-->/ig, "" )
                            //ת��ͼƬ
                            .replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi,function(str){
                                var width = str.match(/width:([ \d.]*p[tx])/i)[1],
                                    height = str.match(/height:([ \d.]*p[tx])/i)[1],
                                    src =  str.match(/src=\s*"([^"]*)"/i)[1];
                                return '<img width="'+ptToPx(width)+'" height="'+ptToPx(height)+'" src="' + src + '" />'
                            })
                            //ȥ�����������
                            .replace( /v:\w+=["']?[^'"]+["']?/g, '' )
                            // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content, MS Office namespaced tags, and a few other tags
                            .replace( /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi, "" )
                            //convert word headers to strong
                            .replace( /<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>" )
                            //remove lang attribute
                            .replace( /(lang)\s*=\s*([\'\"]?)[\w-]+\2/ig, "" )
                            //��������font����ƥ��&nbsp;�п����ǿո�
                            .replace( /<font[^>]*>\s*<\/font>/gi, '' )
                            //��������class
                            .replace( /class\s*=\s*["']?(?:(?:MsoTableGrid)|(?:MsoNormal(Table)?))\s*["']?/gi, '' );

                        // Examine all styles: delete junk, transform some, and keep the rest
                        //�޸���ԭ�е�����, ����style='fontsize:"����"'ԭ����ƥ��ʧЧ��
                        str = str.replace( /(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function( str, tag, tmp, style ) {

                            var n = [],
                                i = 0,
                                s = style.replace( /^\s+|\s+$/, '' ).replace( /&quot;/gi, "'" ).split( /;\s*/g );

                            // Examine each style definition within the tag's style attribute
                            for ( var i = 0; i < s.length; i++ ) {
                                var v = s[i];
                                var name, value,
                                    parts = v.split( ":" );

                                if ( parts.length == 2 ) {
                                    name = parts[0].toLowerCase();
                                    value = parts[1].toLowerCase();
                                    // Translate certain MS Office styles into their CSS equivalents
                                    switch ( name ) {
                                        case "mso-padding-alt":
                                        case "mso-padding-top-alt":
                                        case "mso-padding-right-alt":
                                        case "mso-padding-bottom-alt":
                                        case "mso-padding-left-alt":
                                        case "mso-margin-alt":
                                        case "mso-margin-top-alt":
                                        case "mso-margin-right-alt":
                                        case "mso-margin-bottom-alt":
                                        case "mso-margin-left-alt":
                                        case "mso-table-layout-alt":
                                        case "mso-height":
                                        case "mso-width":
                                        case "mso-vertical-align-alt":
                                            //trace:1819 ff�»������padding��table��
                                            if(!/<table/.test(tag))
                                                n[i] = name.replace( /^mso-|-alt$/g, "" ) + ":" + ensureUnits( value );
                                            continue;
                                        case "horiz-align":
                                            n[i] = "text-align:" + value;
                                            continue;

                                        case "vert-align":
                                            n[i] = "vertical-align:" + value;
                                            continue;

                                        case "font-color":
                                        case "mso-foreground":
                                            n[i] = "color:" + value;
                                            continue;

                                        case "mso-background":
                                        case "mso-highlight":
                                            n[i] = "background:" + value;
                                            continue;

                                        case "mso-default-height":
                                            n[i] = "min-height:" + ensureUnits( value );
                                            continue;

                                        case "mso-default-width":
                                            n[i] = "min-width:" + ensureUnits( value );
                                            continue;

                                        case "mso-padding-between-alt":
                                            n[i] = "border-collapse:separate;border-spacing:" + ensureUnits( value );
                                            continue;

                                        case "text-line-through":
                                            if ( (value == "single") || (value == "double") ) {
                                                n[i] = "text-decoration:line-through";
                                            }
                                            continue;
                                        case "mso-zero-height":
                                            if ( value == "yes" ) {
                                                n[i] = "display:none";
                                            }
                                            continue;
                                        case 'margin':
                                            if ( !/[1-9]/.test( parts[1] ) ) {
                                                continue;
                                            }
                                    }

                                    if ( /^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test( name ) ) {
                                        if ( !/mso\-list/.test( name ) )
                                            continue;
                                    }
                                    n[i] = name + ":" + parts[1];        // Lower-case name, but keep value case
                                }
                            }
                            // If style attribute contained any valid styles the re-write it; otherwise delete style attribute.
                            if ( i > 0 ) {
                                return tag + ' style="' + n.join( ';' ) + '"';
                            } else {
                                return tag;
                            }
                        } );
                        str = str.replace( /([ ]+)<\/span>/ig, function ( m, p ) {
                            return new Array( p.length + 1 ).join( '&nbsp;' ) + '</span>';
                        } );
                        return str;
                    }

                    return function ( html ) {
                        //����word,����תp->li
                        first = null;
                        parentTag = '',liStyle = '',firstTag = '';
                        if ( isWordDocument( html ) ) {
                            html = filterPasteWord( html );
                        }
                        return html.replace( />[ \t\r\n]*</g, '><' );
                    };
                }();

            function getClipboardData( callback ) {
                if ( doc.getElementById( '_pastebin' ) ) {
                    return;
                }

                var selection = doc.getSelection(),
                    rangeSelect = selection.getRangeAt(0),
                    range = doc.createRange(),
                    pastebin = doc.createElement( 'div' );

                startContainer = rangeSelect.startContainer;
                startOffset = rangeSelect.startOffset;
                endContainer = rangeSelect.endContainer;
                endOffset = rangeSelect.endOffset;

                pastebin.id = '_pastebin';

                pastebin.appendChild( doc.createTextNode( fillChar + fillChar ) );
                doc.body.appendChild( pastebin );
                pastebin.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;";

                selectNodeContents(pastebin, range, selection);
                setTimeout( function() {
                    if (isWebkit()) {
                        for(var i=0,pastebins = doc.querySelectorAll('#_pastebin'),pi;pi=pastebins[i++];){
                            if(isEmptyNode(pi)){
                                pi.parentNode.removeChild(pi);
                            }else{
                                pastebin = pi;
                                break;
                            }
                        }
                    }
                    try{
                        pastebin.parentNode.removeChild(pastebin);
                    }catch(e){}

                    callback( pastebin );
                }, 0 );
            }

            function filter(div){
                var html;
                if ( div.firstChild ) {
                    html = div.innerHTML;
                    //console.log(html);
                    html = transformWordHtml(html);
                    positionCursor(startContainer,startOffset,endContainer,endOffset,doc.createRange(),doc.getSelection());
                    //console.log(html);
                    t.insertHtml(html);
                }
            }

            !$.browser.ie && $.event.addEvent(t._areaDoc, 'paste',function(e){
                getClipboardData( filter );
            });
        })();
    }


// �༭��ԭ�ͣ��������壩
    Editor.prototype = {
        // _pagingSep: $.browser.msie? '' : '#!!#',
        _pagingSep: $.browser.msie ? '' : '!',

        /**
         * ����
         */
        listen : function() {
            this._setRange();
        },

        /*
         * �������
         */
        clear : function() {
            this._areaDoc.body.innerHTML = "";
        },

        /**
         * ���õ�ǰ���
         * @return {Object} ��ǰ���
         */
        _setRange : function() {
            var t = this;
            //if (document.activeElement === t._area) {
            if (t._areaDoc.selection) {        // For IE
                t._curRange = t._areaDoc.selection.createRange();
            } else if (t._areaWin.getSelection) {        // For FF
                t._curRange = t._areaWin.getSelection();
            }
            //}
            return t._curRange;
        },

        /**
         * ѡ�е�ǰ�������λ��
         */
        _selectRange : function() {
            var range = this._curRange;
            if (!range) {
                this._areaDoc.body.focus();
                range = this._setRange();
            }
            try {
                if (range && range.select) {
                    range.select();
                }
            } catch(e) {
            }
            return range;
        },

        /**
         * ��ȡ��ǰ������ڵĽڵ�
         */
        getLocalNode : function() {
            var range = this._curRange, node;
            if (range) {
                if (range.getRangeAt) {
                    range = range.getRangeAt(0);
                    node = 1 === range.startContainer.nodeType ? range.startContainer.childNodes[range.startOffset] : range.startContainer;
                } else if (range.select) {
                    node = null != range.text ? range.parentElement() : range(0);
                }
                if (node && node.nodeType !== 1) {
                    node = node.parentNode;
                }
            }
            return node;
        },

        /**
         * ��ȡ��ǰ������ڵĿ鼶�ڵ�
         */
        getLocalBlock : function() {
            var node = this.getLocalNode(), display;
            while (node && node.nodeName !== "BODY") {
                display = $.style.getCurrentStyle(node, "display", this._areaWin).toLowerCase();
                if ("block" === display || "table" === display) {
                    return node;
                } else {
                    node = node.parentNode;
                }
            }
        },

        /**
         * ���ֻ��һ�����䣬�ѹ���赽�ô���For FF
         */
        _setCursorInP : function() {
            var areaDoc = this._areaDoc, areaBody = areaDoc.body, child = areaBody.firstChild;
            if (child && child === areaBody.lastChild) {
                if ("BR" === child.nodeName) {        // ȫѡɾ��ʱʣ��<br />��ɾ��֮�����<p>Ԫ��
                    areaBody.removeChild(child);
                    child = areaDoc.createElement("P");
                    areaBody.appendChild(child);
                }
                if ("P" === child.nodeName && "" === child.innerHTML) {        // �Ƿ�ն��䣿
                    var range = this._setRange();
                    if (range && range.getRangeAt) {
                        range = range.getRangeAt(0);
                        range.setStart(child, 0);
                        range.setEnd(child, 0);
                        range.collapse(false);
                        this._curRange = range;
                    }
                }
            }
        },

        /**
         * ���FF�� Ctrl+B/I/U��ϵͳռ�õĽ������
         */
        _fixShortcut: function(e) {
            var fireCommand = {
                66 : 'setBold',
                73 : 'setItalic',
                85 : 'setUnderline'
            },
                e = e || window.event,
                kc = e.keyCode;
            if (e.ctrlKey && fireCommand[kc]) {
                this[fireCommand[kc]]();
                e.preventDefault(true);
                return false;
            }
        },

        /**
         * ȫѡ�༭������
         */
        selectAll : function() {
            var t = this;
            t._areaWin.focus();
            t._setRange();

            if (t._curRange.expand) {
                t._curRange.expand("textedit");
                t._curRange.select();
            } else if (t._curRange.selectAllChildren) {
                t._curRange.selectAllChildren(t._areaDoc.body);
            }
        },

        /**
         * �۽����༭����
         */
        focus : function() {
            this._areaWin.focus();
        },

        /**
         * ����Enter��Shift+Enter�ļ�����
         */
        _fixKey : function(e) {
            if (13 === e.keyCode && !$.browser.msie && !$.browser.opera && !e.shiftKey) {
                var self = this;
                //	////this.insertHtml("<p></p>");
                //	//var node = this._areaDoc.createElement("p"), range = this._curRange.getRangeAt(0);
                //	//range.insertNode(node);
                //	//range.setStart(node, 0);
                //	//range.setEnd(node, 0);
                //	//range.collapse(false);
                //	//e.preventDefault();
                setTimeout(function() {
                    var anchor = self._curRange.anchorNode;
                    if (anchor && anchor.className) {
                        anchor.className = '';
                    }
                }, 0);
            }
        },

        /**
         * �޸���ǩ������
         * @param {String} HTML
         * @return {String} �޸����HTML
         */
        fixTags : function(html) {
            var pagingSep = this._pagingSep;
            // �滻�ɷ�ҳ��
            html = html.replace(/<hr(?:.*?)color=("?)#ff0123(\1)(?:.*?)>/gi, '<div class="pageBreak">' + pagingSep + '</div>');
            html = html.replace(/<(?:div|DIV).*?class=(['\"]?)pageBreak(['\"]?)>#!!#/g, '<div class="pageBreak">' + pagingSep + '</div>');
            // �滻hr��ҳ��
            html = html.replace(/<hr(?:\s*?)class=("?)pageBreak(\1)(?:[\s\/]*?)>/gi, '<div class="pageBreak">' + pagingSep + '</div>');
            // �滻ˮƽ��
            //html = html.replace(/<hr(?:\s+[^<>]*)?>/gi, '<div class="f_hr">' + pagingSep + '</div>');
            html = html.replace(/<hr(?:\s*?)class=("?)f_hr(\1)(?:[\s\/]*?)>/gi, '<div class="f_hr">' + pagingSep + '</div>');

            return html;
        },

        /**
         * �ָ���ǩ
         * @param {String} HTML
         * @return {String} �ָ����HTML
         */
        resumeTags : function(html) {
            // �ָ�hr
            var reg = new RegExp('<div(?:.*?)class=("?)f_hr(\1)(?:.*?)>' + this._pagingSep + '<\/div>', 'ig');
            html = html.replace(reg, '<hr />');
            return html;
        },

        /**
         * ����ģʽ�滻include��ǩת��
         * @param {String} HTML
         * @return {String} �滻���HTML
         */
        replaceIncludeTags : function(html) {
            html = html.replace(/&lt;(!--#include.*?--)&gt;/gi,
                function($1, $2) {
                    return "<" + $2 + ">";
                }).replace(/&lt;(!--position.*?--)&gt;/gi, function($1, $2) {
                    return "<" + $2 + ">";
                });
            return html;
        },

        /**
         * ��ͼģʽ�ָ�include��ǩת��
         * @param {String} HTML
         * @return {String} �滻���HTML
         */
        resumeIncludeTags : function(html) {
            html = html.replace(/<(!--#include.*?--)>/gi,
                function($1, $2) {
                    return "&lt;" + $2 + "&gt;";
                }).replace(/<(!--position.*?--)>/gi, function($1, $2) {
                    return "&lt;" + $2 + "&gt;";
                });
            return html;
        },

        /**
         * ���ͱ༭����
         */
        _sendCommand : function(cmd, value) {
            try {
                this._areaDoc.execCommand(cmd, false, value);
            } catch (e) {

            }
        },


        /**
         * ��ʽ����ǰ��
         * @param {String} ���ǩ��
         */
        formatBlock : function(tagName) {
            this._selectRange();
            this._sendCommand("FormatBlock", "<" + tagName + ">");
        },

        /**
         * ɾ����ʽ��ǩ
         */
        clearFormats : function() {
            this._selectRange();
            this._sendCommand("RemoveFormat");
        },

        /**
         * ��������
         * @param {String} ����HTML
         */
        setContent : function(html) {
            this._areaDoc.body.innerHTML = this._replaceRealElement(html);
        },

        /**
         * ����HTML
         * @param {String} HTML����
         * @param {Number} ����λ�ã�0����ͷ��1��������ڴ���2ĩβ��Ĭ��Ϊ1
         */
        insertHtml : function(html, position) {
            position = position == null ? 1 : position;
            html = this._replaceRealElement(html);
            var t = this;
            switch (position) {
                case 0:
                    t._areaDoc.body.innerHTML = html + t._areaDoc.body.innerHTML;
                    break;

                case 1:
                    var range = t._selectRange();
                    if (range && range.pasteHTML) {
                        range.pasteHTML(html);
                    } else {
                        t._sendCommand("InsertHTML", html);
                    }

                    break;

                case 0:
                    t._areaDoc.body.innerHTML = t._areaDoc.body.innerHTML + html;
                    break;
            }
        },

        /**
         * ����ͼƬ
         * @param {String,Array} һ�Ż����ͼƬ
         */
        insertImage : function(imgs) {
            var html = [];
            imgs = imgs.length != null ? imgs : [imgs];
            for (var i = 0; img = imgs[i]; i++) {
                html.push('<p class="f_center">');
                if (img.psurl != null) {
                    html.push(' <a href="' + img.psurl + '">');
                }
                html.push('<img');
                for (var j in img) {
                    if (j != "psurl") {
                        html.push(' ' + j + '="' + img[j] + '"');
                    }
                }
                html.push(' />');
                if (img.psurl != null) {
                    html.push('</a>');
                }
                if (img.alt != null) {
                    html.push('<br />' + img.alt);
                }
                html.push('</p>');
            }

            this.insertHtml(html.join(""));
        },

        /**
         * ����Flash
         * @param {String} Flash��ַ
         * @param {Number} ��
         * @param {Number} ��
         * @param {String} ���뷽ʽ
         * @param {Boolean} �Ƿ��Զ���ʼ
         * @param {Boolean} �Ƿ��ظ�����
         * @param {String} ����
         * @param {Object} ��������
         */
        insertFlash : function(src, width, height, align, isAutoPlay, isLoop, quality, others, videoParams) {
            var id = "flash_" + parseInt(Math.random() * 90001 + 10000);

            var objCode = [
                '<object',
                'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"',
                'codebase="http://fpdownload2.macromedia.com/get/shockwave/cabs/flash/swflash.cab"',
                'id="' + id + '"'
            ],
            paramsCode = [
                '<param name="movie" value="' + src + '" />'
            ],
            embedCode = [
                '<embed',
                'type="application/x-shockwave-flash"',
                'pluginspace="http://www.adobe.com/go/getflashplayer"',
                'src="' + src + '"',
                'name="' + id + '"'
            ],
            temp;

            if (width != null) {
                temp = 'width="' + width + '"';
                objCode.push(temp);
                embedCode.push(temp);
            }
            if (height != null) {
                temp = 'height="' + height + '"';
                objCode.push(temp);
                embedCode.push(temp);
            }
            if (quality != null) {
                paramsCode.push('<param name="quality" value="' + quality + '" />');
                embedCode.push('quality="' + quality + '"');
            }
            if (isAutoPlay != null) {
                if (isAutoPlay) {
                    paramsCode.push('<param name="play" value="true" />');
                    embedCode.push('play="true"');
                } else {
                    paramsCode.push('<param name="play" value="false" />');
                    embedCode.push('play="false"');
                }
            }
            if (isLoop != null) {
                if (isLoop) {
                    paramsCode.push('<param name="loop" value="true" />');
                    embedCode.push('loop="true"');
                } else {
                    paramsCode.push('<param name="loop" value="false" />');
                    embedCode.push('loop="false"');
                }
            }

            if (others) {
                for (var i in others) {
                    paramsCode.push('<param name="' + i + '" value="' + others[i] + '" />');
                    embedCode.push(i + '="' + others[i] + '"');
                }
            }
            videoParams && objCode.push('thumbnail="' + videoParams.thumbnail + '"');
            var wholeCode = objCode.join(" ") + ">" + paramsCode.join("") + embedCode.join(" ") + " />" + "</object>";
            wholeCode = this._createFakeElement(wholeCode);
            if (align != null) {
                wholeCode = '<p class="f_' + align + '">' + wholeCode
                    + ( videoParams ? '<br/><a href="' + videoParams.url + '" target="_blank">' + videoParams.title + '</a>' : '' ) + '</p>';
            }

            this.insertHtml(wholeCode);
        },

        insertVideo : function(src, width, height, align, others, videoParams) {
            var objCode = ['<object id="FPlayer' + (+new Date) + '"'],
            paramsCode = [],
            flashVars = [],
            temp;

            if (width != null) {
                temp = 'width="' + width + '"';
                objCode.push(temp);
            }
            if (height != null) {
                temp = 'height="' + height + '"';
                objCode.push(temp);
            }

            if (others) {
                for (var i in others) {
                    paramsCode.push('<param name="' + i + '" value="' + others[i] + '" />');
                }
            }
            if(temp = videoParams.flashvars) {
                for(var i in temp){
                    if(temp.hasOwnProperty(i)){
                        flashVars.push(i + '=' + temp[i]);
                    }
                }
                paramsCode.push('<param name="flashvars" value="' + flashVars.join('&') + '" />');
            }

            var wholeCode = objCode.join(" ") + (' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" thumbnail="' + videoParams.thumbnail + '"') + ">" +
                            '<param name="movie" value="' + src + '" />' +
                            paramsCode.join("") + '<!--[if !IE]>-->' +
                            objCode.join(" ") + (' data="' + src + '"') + ' type="application/x-shockwave-flash"' + ">" +
                            paramsCode.join("") +  "</object><!--<![endif]--></object>";

            wholeCode = this._createFakeElement(wholeCode);
            if (align != null) {
                wholeCode = '<p class="f_' + align + '">' + wholeCode
                    + ( videoParams ? '<br/><a href="' + videoParams.url + '" target="_blank">' + videoParams.title + '</a>' : '' ) + '</p>';
            }

            this.insertHtml(wholeCode);
        },

        /**
         * �滻����objectԪ��
         */
        _replaceRealElement: function(html) {
            var fakeelementReg = /(?:<object.*?>)((\n|\r|.)*?)(?:<\/object>)(<!--<!\[endif\]--><\/object>)?/ig, result, fakeHtml;
            while ((result = fakeelementReg.exec(html)) !== null) {
                fakeHtml = this._createFakeElement(result[0]);
                html = html.replace(result[0], fakeHtml);
                fakeelementReg.lastIndex = 1;
            }
            return html;
        },
        /**
         * ��imgռλ����ԭ��ʵ������
         */
        _restoreRealElement: function(html) {
            var realelementReg = /<img.[^>]*_realelement="(.*?)"\s*\/?>/ig, result;
            while ((result = realelementReg.exec(html)) !== null) {
                result[1] = decodeURIComponent(result[1]);
                html = html.replace(result[0], result[1]);
                realelementReg.lastIndex = 1;
            }
            return html;
        },

        _addNewPara: function() {
            if ($.browser.mozilla) {
                var sel = this._curRange,
                    range = this._areaDoc.createRange(),
                    newP = this._areaDoc.createElement('P'),
                    parent = sel.anchorNode.parentNode;

                // �ڷָ�����������µĶ���P
                newP.innerHTML = '<br />';

                // ȥ����ҳ���е�ռλ��
                // if(parent.innerHTML === this._pagingSep) {
                // 	parent.removeChild(parent.firstChild);
                // }

                range.selectNode(parent);
                sel.removeAllRanges();
                sel.addRange(range);
                range.collapse(false);
                range.insertNode(newP);
                range.detach();

                // �ѹ���Ƶ��ָ��������PԪ����
                range = this._areaDoc.createRange();
                range.selectNodeContents(newP);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                this.focus();
            }
        },

        /**
         * ����
         */
        paging : function() {
            this.insertHtml('<div class="pageBreak">' + this._pagingSep + '</div>');
            this._addNewPara();
        },

        /**
         * ��ȡ����
         */
        getContent : function() {
            return this._restoreRealElement(this._areaDoc.body.innerHTML);
        },

        /**
         * ������ת��ΪXHTML���룬���ѹ��˶��������
         */
        getXhtml : function() {
            var xhtml = this.getContent();

            //xhtml = xhtml.replace(/<\!--[\W\w]*?-->/g, "");		// ȥע��
            //xhtml = xhtml.replace(/<hr(?:.*?)color=("?)#ff0123(\1)(?:.*?)>/gi, '<hr class="pageBreak" />');		// �滻�ɷ�ҳ��

            // ȥ������ı�ǩ�����ԣ���ǩ��������Сд��������ֵ��˫����
            xhtml = xhtml.replace(/<(\/?)([\w1-6]+)([^<>]*?)((?:\s*\/)?)>/g, function($1, $2, $3, $4, $5) {
                $3 = $3.toLowerCase();		// ��ǩ��Сд��

                var tempAttrs = [];
                if ($4) {        // ���������
                    // ����ֵ������ && �����Ż�Ϊ˫����, ����align=center -> align="center"
                    $4 = $4.replace(/\s+(\w+=)(?=[^\"])(\'?)([^\2>\s]+)\2/g, ' $1"$3"');
                    // ������ת�Ƶ�������
                    $4 = $4.replace(
                        /(\w+)\s*=\s*"([^"]*)"/g,
                        function($$1, $$2, $$3) {
                            $$2 = $$2.toLowerCase();
                            if ($$3 !== "" && $$2 !== "uniqueidforntes") {
                                tempAttrs.push($$2 + '="' + $$3 + '"');
                            }
                            return "";
                        }
                    );
                    // ����ֵ�������ֵ, ����checked -> checked="checked"
                    $4 = $4.replace(
                        /\s+(\w+)\s+/g,
                        function($$1, $$2) {
                            tempAttrs.push($$2 + '="' + $$2 + '"');
                            return "";
                        }
                    );
                }
                // ��������
                $4 = tempAttrs.length ? " " + tempAttrs.join(" ") : "";
                // ����ǰ�ӿո�
                if ("/" === $5) {
                    $5 = " /";
                }

                return "<" + $2 + $3 + $4 + $5 + ">";
            });

            // �رյ���ǩ, <br> -> <br />
            xhtml = xhtml.replace(
                /<(br|img|hr|param|embed)([^<>]*?)\/?>/gi,
                function($1, $2, $3) {
                    return "<" + $2 + " " + $3.trim() + " />";
                }
            );

            // ����ն��䡢������
            xhtml = xhtml.replace(/<(p|a)(?:\s+[^<>]*)?>(?:\s*|(?:&nbsp;)*)<\/\1>/gi, "");

            // ������׿ո�
            xhtml = xhtml.replace(/(<p(?:\s+[^<>]*)?>)[����]+/gi, "$1");

            // ȥ��hr��Χ��p/div
            xhtml = xhtml.replace(/<([\w1-6]+)(\s+[^<>]*)?>(.*?)(<hr[^<>]*>)(.*?)<\/\1>/gi, "<p$2>$3</p>$4<p$2>$5</p>");

            // �滻include��ǩ��ת���ַ�
            xhtml = mainEditor.replaceIncludeTags(xhtml);

            //ɾ��ͼƬǰ��Ļ��У�IE���image֮��Ļ�����Ϊһ��TextNode
            xhtml = xhtml.replace(/(<a.*?>)?\n*(<img.*?>)\n*(<\/a>)?\n*/ig, "$1$2$3");

            return xhtml;
        },


        /**
         * �����ú���
         */
        test : function() {
            this.format();
            alert(this.getXhtml());
        }
    };

    var mainEditor = new Editor($("#mainPreview"), "gb2312", Config.editor.previewCss);
    mainEditor._mode = "view";	// Ĭ��Ϊ��ͼģʽ

    /**
     * �л��༭��ģʽ
     * @param {String} ģʽ��viewΪ��ͼģʽ��codeΪhtml����ģʽ
     */
    mainEditor.switchMode = function(mode) {
        var t = this;
        mode = mode.toLowerCase();
        if (t._mode != mode) {
            var preview = $("#mainPreview"), code = $("#mainCode");
            switch (mode) {
                case "code":    // ��ǰ����ͼģʽ���л�������ģʽ
                    code.value = this._restoreRealElement(mainEditor.replaceIncludeTags(t._areaDoc.body.innerHTML.replace(/>\s*</g, ">\r\n<")));
                    preview.style.display = "none";
                    code.style.height = code.parentNode.offsetHeight + "px";
                    code.style.display = "block";
                    for (var i in t.btns) {
                        if (i !== "fullScreen" && i !== "help") {
                            $.style.addCss(this.btns[i], "unavailable");
                        }
                    }
                    break;

                case "view":    // ��ǰ�Ǵ���ģʽ���л�����ͼģʽ
                    t._areaDoc.body.innerHTML = this._replaceRealElement(mainEditor.resumeIncludeTags(code.value));
                    code.style.display = "none";
                    preview.style.display = "block";
                    for (var i in t.btns) {
                        $.style.removeCss(this.btns[i], "unavailable");
                    }
                    break;
            }
            this._mode = mode;
        }
    };

    /**
     * ͬ����ť״̬
     */
    mainEditor._syncBtns = function() {
        var t = this;
        if (document.activeElement === t._area && "code" !== t.mode) {
            var node = t.getLocalNode();
            if (node) {
                var textDecoration = getCurrentStyle(node, "textDecoration", t._areaWin),
                    fontWeight = getCurrentStyle(node, "fontWeight", t._areaWin),
                    fontStyle = getCurrentStyle(node, "fontStyle", t._areaWin),
                    textAlign = getCurrentStyle(node, "textAlign", t._areaWin),
                    //active = "active",
                    btns = t.btns, actives = [], unactives = [];

                btns["underline"].className = textDecoration.indexOf("underline") >= 0 ? "underline active" : "underline";
                btns["del"].className = textDecoration.indexOf("line-through") >= 0 ? "del active" : "del";
                btns["bold"].className = "bold" === fontWeight || fontWeight >= 700 ? "bold active" : "bold";
                btns["italic"].className = "italic" === fontStyle ? "italic active" : "italic";
                btns["alignLeft"].className = "left" === textAlign ? "alignLeft active" : "alignLeft";
                btns["alignRight"].className = "right" === textAlign ? "alignRight active" : "alignRight";
                btns["alignCenter"].className = "center" === textAlign ? "alignCenter active" : "alignCenter";
                btns["alignJustify"].className = "justify" === textAlign ? "alignJustify active" : "alignJustify";
            }
        }
    };

    /**
     * ��ʽ������
     * @return {String} ��ʽ����Ĵ���
     */
    mainEditor.format = function() {

        /*$("#formatList").style.visibility = "hidden";*/
        this.switchMode("view");
        var t = this,
            temp, i,
            isClearLinks = $("#isClearLinks").checked,
            isClearTables = $("#isClearTables").checked,
            isClearTableStyles = $("#isClearTableStyles").checked,
            isClearImgs = $("#isClearImgs").checked,
            isToDBCCase = $("#isToDBCCase").checked,
            isKeepFontColor = $("#isKeepFontColor").checked,
            isDeleteBr = $("#isDeleteBr").checked,
            isKeepFont = $("#isKeepFont").checked;

        //this.selectAll();
        //this.clearFormats();

        ///\s+on(?:load|click|keydown|keyup|mouseover|mouseout|mouseup|error)=(['"]?).*?\1\s+/gi;
        ///\s+alt=(['"]?).*?\1\s+/gi

        var pageBreak = $("div.pageBreak", t._areaDoc), hr = t._areaDoc.createElement("hr");
        hr.className = "pageBreak";
        for (i = pageBreak.length - 1; i >= 0; i--) {
            $.dom.replaceNode(pageBreak[i], hr.cloneNode(false));
        }

        // ����ˮƽ���ڸ�ʽ���е�����
        hr.className = "f_hr";
        var f_hr = $("div.f_hr", t._areaDoc);
        for (i = f_hr.length - 1; i >= 0; i--) {
            $.dom.replaceNode(f_hr[i], hr.cloneNode(false));
        }

        // div -> p
        var xhtml = t.resumeTags(t.getXhtml()).replace(/<div/gi, "<p").replace(/<\/div>/gi, "</p>");
        //xhtml = mainEditor.resumeIncludeTags(xhtml);

        // ȥ�¼�
        xhtml = xhtml.replace(/\s+on(?:load|click|keydown|keyup|mouseover|mouseout|mouseup|error)=(['"]?).*?\1\s*/gi, " ");

        //<P onclick="alert('a');">klsjdklfajskldfjalsjdflasjldjfakljdsfklsjlfjsljfklasjdklfjalskdfjlsjfsjfs<IMG onerror=sdfklsdjf src="http://localhost:1630/CMS/sfsdf"></P>

        // ��center�滻��p
        xhtml = xhtml.replace(/<(\/)?center(?:\s+[^>]*)?>/ig, "<$1p>");

        // <br /> -> <p> �����ѡ��ȥ��br��ť���򲻱�Ϊp��ֱ��ȥ��br�����<br />ǰ����<img />����</object>���Ͳ�ȥ��
        xhtml = isDeleteBr ? xhtml.replace(/<br(?:\s+[^>]*)?>/gi, "") : xhtml.replace(/(<\/object>|<img(?:\s+[^>]*)?>)?\s*<br(?:\s+[^>]*)?>/gi, function($0, $1) {
            return $1 ? $0 : "</p><p>"
        });

        // �ɵ�����ǰ��Ŀո�
        xhtml = xhtml.replace(/<p(?:\s+[^>]*)?>(?:\s|��|&nbsp;)+/gi, "<p>").replace(/(?:\s|��|&nbsp;)+<\/p>/gi, "<\/p>");
        // �ɵ�strong����Ŀո�
        xhtml = xhtml.replace(/<strong(?:\s+[^>]*)?>(?:\s|��|&nbsp;)+/gi, "<strong>");
        // ��֤���ݵ������p������Ƕ�׵�p�ó���
        xhtml = "<p>" + xhtml.replace(/<\/p>/gi, "<p>").replace(/<p/gi, "</p><p") + "</p>";
        // �ɵ�p����ʽ
        xhtml = xhtml.replace(/<p(?:\s+[^<>]*)?>/gi, "<p>");
        // �ɵ�����h��ǩ��span��ǩ
        xhtml = xhtml.replace(/<\/?(?:h1|h2|h3|h4|h5|h6|span|style|sub|o)(?:\s+[^<>]*)?>/gi, "");
        //ȥ��\n�Ļ��з�
        xhtml = xhtml.replace(/\n/gi, "");

        // ��д����
        this._areaDoc.body.innerHTML = xhtml;

        // ���ܾ���
        temp = $("p", t._areaDoc.body);
        i = temp.length;
        while (--i >= 0) {
            if ($("img,table,object", temp[i]).length) {
                temp[i].className = "f_center";
            }
        }

        // table�ӱ߿򡢾��з���
        temp = $("table", t._areaDoc.body);
        i = temp.length;
        while (--i >= 0) {
            $.style.addCss(temp[i], "f_table");
            //temp[i].align = "center";
        }

        xhtml = this.getXhtml();
        xhtml = mainEditor.resumeIncludeTags(xhtml);

        // ������
        if (isClearLinks) {
            xhtml = xhtml.replace(/<\/?a(?:\s+[^<>]*)?>/gi, "");
        }

        if (isClearTables) {        // ����
            xhtml = xhtml.replace(/<\/?(?:table|thead|tfoot|tbody|tr)(?:\s+[^<>]*)?>/gi, "").replace(/<(\/?)(td|th|caption)(?:\s+[^<>]*)?>/gi, "<$1p>");
        } else if (isClearTableStyles) {        // �����ʽ
            xhtml = xhtml.replace(/<(table|thead|tfoot|tbody|tr|td|th|caption)((?:\s+[^<>]*)?)>/gi, function($1, $2, $3) {
                return '<' + $2 + ($3.match(/\s(rowspan|colspan)="\d+"/ig) || '') + '>';
            });
        }

        // ɾ��ͼƬ
        if (isClearImgs) {
            xhtml = xhtml.replace(/<img(?:\s+[^<>]*)?>/gi, "");
        }

        // ȫ��ת��Ϊ���
        if (isToDBCCase) {
            xhtml = xhtml.replace(/[\uFF10-\uFF19\uFF21-\uFF5A\uFF3E-\uFF3F]/g, function($0) {
                return String.fromCharCode($0.charCodeAt(0) - 65248) || $0;
            });
        }

        if (isKeepFontColor || isKeepFont) {
            xhtml = xhtml.replace(/<font(\s+[^<>]*)?>(.*?)<\/font>/gi, function($0, $1, $2) {
                var styles = [];
                if (isKeepFontColor) {
                    /color\s*=\s*(['"]?)([^\s>]+)\1/i.test($1);
                    styles.push('color="' + RegExp.$2 + '"');
                }
                if (isKeepFont) {
                    /face\s*=\s*(['"]?)([^\s>]+)\1/i.test($1);
                    styles.push('face="' + RegExp.$2 + '"');
                }
                return '<font ' + styles.join(" ") + '">' + $2 + '</font>';
            });
        } else {
            xhtml = xhtml.replace(/<\/?font(?:\s+[^<>]*)?>/gi, "");
        }

        // ����ն��䡢������
        xhtml = xhtml.replace(/<(p|a|div|span)(?:\s+[^<>]*)?>(?:\s*|(?:&nbsp;)*)<\/\1>/gi, "");

        t._areaDoc.body.innerHTML = this._replaceRealElement(t.fixTags(xhtml));


        /*var hrPageBreak = $("hr.pageBreak", t._areaDoc);                                      0
         for (i = hrPageBreak.length - 1; i >= 0; i--) {
         $.dom.replaceNode(hrPageBreak[i], pageBreak[i]);
         }*/

        hr = null;

        // ��¼��ʽ������
        this.saveFormatSettings(isClearLinks, isClearTables, isClearTableStyles, isClearImgs, isToDBCCase, isKeepFontColor, isDeleteBr, isKeepFont);
    };

    /**
     * ��¼��ʽ�����õ�Cookie
     */
    mainEditor.saveFormatSettings = function() {
        for (var i = arguments.length - 1; i >= 0; i--) {
            arguments[i] ? $.cookie.set("AF" + i, 1, 30 * 24 * 60) : $.cookie.del("AF" + i);
        }
    };

    /**
     * �л������ӻ�ģʽ������ȡXhtml����
     * @return {String} Xhtml����
     */
    mainEditor.submit = function() {
        this.switchMode("view");
        return this.getXhtml();
    };

    /**
     * ����༭����߶���Cookie
     */
    mainEditor.saveAreaHeight = function() {
        $.cookie.set("editorHeight", this._area.offsetHeight, 90 * 24 * 60, "", "/");
    };

    /**
     * �ָ�Cookie��¼�ı༭���߶�
     */
    mainEditor.resumeAreaHeight = function() {
        var height = $.cookie.get("editorHeight");
        height && ($("#mainEditor div.frameBorder")[0].style.height = height + "px");
    };

// ��¼ԭ�߶�
    mainEditor.origHeight = parseInt($("#mainEditor div.frameBorder")[0].offsetHeight);

// �ָ�ԭ�߶�
    mainEditor.resumeAreaHeight();

// ��¼��ť
    var btns = $("#mainEditor ul.btns li");
    mainEditor.btns = {};
    for (var i = 0; i < btns.length; i++) {
        mainEditor.btns[btns[i].className] = btns[i];
    }

// ��ɫ����
    new $.ui.PopupLayer(mainEditor.btns["color"], $(">.sub", mainEditor.btns["color"])[0], "click");

// �ָ�Ĭ�ϸ�ʽ������
    NTES.cookie.get("AF" + 0) && ($("#isClearLinks").checked = true);
    NTES.cookie.get("AF" + 1) && ($("#isClearTables").checked = true);
    NTES.cookie.get("AF" + 2) && ($("#isClearTableStyles").checked = true);
    NTES.cookie.get("AF" + 3) && ($("#isClearImgs").checked = true);
    NTES.cookie.get("AF" + 4) && ($("#isToDBCCase").checked = true);
    NTES.cookie.get("AF" + 5) && ($("#isKeepFontColor").checked = true);
    NTES.cookie.get("AF" + 6) && ($("#isDeleteBr").checked = true);
    NTES.cookie.get("AF" + 7) && ($("#isKeepFont").checked = true);


    window.Editor = Editor;
    window.mainEditor = mainEditor;

// �༭�� End
// ------------------------------------------------------------------------------


// �л���������ͼ
    $("#toContentCode").addEvent("click", function(e) {
        e.preventDefault();
        this.addCss("current");
        $("#toContentView").removeCss("current");
        mainEditor.switchMode("code");
        this.blur();
    });
// �л������ӻ���ͼ
    $("#toContentView").addEvent("click", function(e) {
        e.preventDefault();
        this.addCss("current");
        $("#toContentCode").removeCss("current");
        mainEditor.switchMode("view");
        this.blur();
    });
//���༭��������ɺ�������ҳ����������ͬ�Ŀ��
    $("#changeViewWidth").addEvent("click", function(e) {
        e.preventDefault();
        var editWrap = $("#frameBorder_1"),w = $.style.getCurrentStyle(editWrap, "width");
        if (w !== "575px") {
            editWrap.addCss("width:575px;");
            mainEditor._areaDoc.body.style.overflowY = "scroll";
            this.blur();
        } else {
            editWrap.addCss("width:auto;");
            mainEditor._areaDoc.body.style.overflowY = "auto";
            this.blur();
        }
    });
// ���ӱ༭���߶��¼�
    $("#increaseHeight").addEvent("click", function(e) {
        mainEditor.increaseHeight(50);
        mainEditor.saveAreaHeight();
        CSuggestion.initColumnsWidth();
        e.preventDefault();
    });
// ���ٱ༭���߶��¼�
    $("#decreaseHeight").addEvent("click", function(e) {
        mainEditor.decreaseHeight(50);
        mainEditor.saveAreaHeight();
        CSuggestion.initColumnsWidth();
        e.preventDefault();
    });



// �Զ�����
    new $.ui.selectFilter($("#source"), $("#sources"), $('#source-dropdown'));
    new $.ui.AutoSelect($("#topicKeyword"), $("#topicidlist"));
    /**
     * �Զ�������
     * @param {HtmlElement} �����Ԫ��
     */
    $.ui.Autocomplete = function (input) {
        if (!arguments.length) {
            return;
        }

        var t = this;
        t.constructor = arguments.callee;

        t.input = input,t.cache = {},t.delay = 100,t.results = [],t.liElementHeight = 25;
        t.index = -1,t.isShowed = false,t.keyword = "",t.keywordSwitch = true;
        t.timeout = t.timeout2 = t.timeout3 = null,t.flag = 0,t.swift = 0;

        t.input.setAttribute("autocomplete", "off");
        t.ulElement = $(document.createElement("ul"));
        t.divElement = $(document.createElement("div"));
        t.divElement.id = "sourceResults";
        body.appendChild(t.divElement);
        if ($.browser.msie && $.browser.version < 7) {
            t.divElement.innerHTML = "<iframe style='position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border:1px solid #DDD;z-index:-1'></iframe>";
        }
        t.divElement.appendChild(t.ulElement);
        t.setPosition();
        $.event.addEvent(t.input, "keyup", t.processKey.bind(t));
        $.event.addEvent(t.input, "keydown", function (e) {

            !suggestObj.keywordSwitch && ( suggestObj.keywordSwitch = true );

            var kc = e.keyCode;
            switch (kc) {

                case 13:// enter ( ��ֹenter�����ⲿ��submit�¼� )
                    if (e.preventDefault) e.preventDefault()
                    else e.returnValue = false;
                    if (e.stopPropagation) e.stopPropagation();
                    else e.cancelBubble = true;
                    break;

                case 38:// up
                    t.flag = 1;
                    t.flag && t.selectResult(t.index - 1, "keyEvent");
                    break;

                case 40:// down
                    t.flag = 1;
                    ( t.index == -1 ) && t.index++;
                    t.flag && t.selectResult(t.index + 1, "keyEvent");
                    break;
            }
        });
        $.event.addEvent(t.input, "blur", t.hide.bind(t));
        $.event.addEvent(window, "resize", t.setPosition.bind(t));
    }

    $.ui.Autocomplete.prototype = {
        /**
         * ��������
         */
        search : function () {
            var t = this;

            t.keywordSwitch && ( t.keyword = t.input.value.trim() );

            if (!t.keywordSwitch || t.keyword != "") {

                //��ʼĬ��ֵ
                t.divElement.style.overflowY = "hidden";
                t.divElement.style.height = "auto";
                t.index = -1;

                t.getResults(t.keyword);
                if (t.results.length > 0) {

                    if (t.results.length > 10) {
                        t.divElement.style.overflowY = "auto";
                        t.divElement.style.height = "250px";
                        $.event.addEvent(t.divElement, "scroll", t.preventMouseOverEvent.bind(t, 100));
                    } else if ($.browser.msie && $.browser.version < 7) {
                        t.divElement.style.height = (t.results.length * this.liElementHeight) + "px";
                    }
                    t.ulElement.innerHTML = t.formatHtml(t.results);
                    t.preventMouseOverEvent.call(t, 100);
                    t.show();
                    t.ulElement.$("li").addEvent("mouseover", function() {
                        if (!t.swift) {
                            var index = 0;
                            index = parseInt($(this).$("em")[0].innerHTML);
                            t.selectResult(index, "mouseEvent");
                        }
                    });
                    t.ulElement.$("li").addEvent("click", function() {
                        t.selectCurrentResult();
                        t.hide();
                    });
                } else {
                    t.hide();
                }
            } else {
                t.hide();
            }
        },
        /**
         * �������KEYUP��Ӧ�¼�
         * @param {Event} �¼�����
         */
        processKey : function (e) {
            var t = this , kc = e.keyCode;
            //console.log( " keyCode = " + kc);
            if (kc == 13 || kc == 27 || kc == 38 || kc == 40) {

                switch (kc) {

                    case 38:// up
                        var t = this;
                        !t.flag && t.selectResult(t.index - 1, "keyEvent");
                        t.flag = 0;
                        break;

                    case 40:// down
                        ( t.index == -1 ) && t.index++;
                        !t.flag && t.selectResult(t.index + 1, "keyEvent");
                        t.flag = 0;
                        break;

                    case 13:// enter
                        t.selectCurrentResult();
                        t.hide();
                        break;

                    case 27://	escape
                        t.hide();
                        break;
                }

            } else {
                if (t.timeout) {
                    window.clearTimeout(t.timeout);
                    t.timeout = null;
                    t.results = [];
                }
                t.timeout = window.setTimeout(t.search.bind(t), t.delay);
            }
        },
        /**
         * ����������
         * @param {String} ���������
         */
        getResults: function (kw) {
            var t = this , data;
            if (t.keywordSwitch) {
                for (var i = 0 , len = sourcelistjson.length; i < len; i++) {
                    data = window.sourcelistjson[i]["sn"];
                    if (data.indexOf(kw) !== -1) {
                        t.results.push(data);
                    }
                }
            } else {
                for (var i = 0 , len = sourcelistjson.length; i < len; i++) {
                    data = window.sourcelistjson[i]["sn"];
                    if (data.indexOf(kw) !== -1) {
                        t.results.push(data);
                    }
                }
                t.results = sourcelistjson;
            }
        },
        /**
         * �����ݸ�ʽ����HTML
         * @param {Array} ������������
         * @return {Sting} ��ʽ��������
         */
        formatHtml : function (results) {
            var html = [];
            for (var i = 0, len = results.length; i < len; i++) {
                html.push('<li>' + results[i] + '<em>' + (i + 1) + '</em></li>');
            }
            return html.join("");
        },
        /**
         * ѡ����
         * @param {Event} �¼�����
         */
        selectResult : function(index, type) {
            var t = this;

            if (t.isShowed) {
                t.index > 0 && $(t.ulElement.$("li")[t.index - 1]).removeCss("background:#2682C6");

                ( index > t.results.length ) && ( index = 0 );
                ( index < 0 ) && ( index = t.results.length );

                if (type == "keyEvent") {
                    if (index < 10) {
                        if (t.divElement.scrollTop != 0) {
                            t.divElement.scrollTop = 0;
                            t.preventMouseOverEvent.call(t, 1000);
                        }
                    } else {
                        t.divElement.scrollTop = ( index - 9 ) * this.liElementHeight;
                        t.preventMouseOverEvent.call(t, 1000);
                    }
                }
                if (index != 0) {
                    $(t.ulElement.$("li")[index - 1]).addCss("background:#2682C6");
                    type == "keyEvent" && ( t.input.value = $(t.ulElement.$("li")[index - 1]).firstChild.nodeValue );
                } else {
                    type == "keyEvent" && ( t.input.value = t.keyword );
                }

                t.index = index;
            }
        },
        /**
         * ѡ��ǰ�����������VALUEֵ
         * @param {Number}
            */
        selectCurrentResult : function () {
            var t = this;
            if (t.index > 0) {
                t.input.value = t.ulElement.$("li")[t.index - 1].firstChild.nodeValue;
            }
            addSourceToContent.call(t);

        },
        /**
         * ��ȡ�ڵ���������������˺��϶�
         * @param {HtmlElement} ���ҵ�Ԫ��
         */
        fetchOffset: function (obj) {
            var left_offset = obj.offsetLeft;
            var top_offset = obj.offsetTop;
            while ((obj = obj.offsetParent) != null) {
                left_offset += obj.offsetLeft;
                top_offset += obj.offsetTop;
            }
            return {
                'left': left_offset,
                'top': top_offset
            };
        },
        /**
         * ���ý���������
         */
        setPosition : function () {
            var t = this, position = this.fetchOffset(t.input);
            t.divElement.style.top = ( position.top + t.input.offsetHeight + 1) + "px";
            t.divElement.style.left = ( position.left ) + "px";
            t.divElement.style.width = ($("#source").offsetWidth - 2 ) + "px";
        },
        /**
         * ��ʾ���ݲ�
         */
        show : function () {
            var t = this;
            if (!t.isShowed) {
                t.divElement.style.visibility = "visible";
                t.isShowed = true;
            }
        },
        /**
         * �������ݲ�
         */
        hide : function () {
            var t = this;
            if (t.isShowed) {
                t.timeout2 = window.setTimeout(function() {
                    t.divElement.style.visibility = "hidden";
                    t.isShowed = false;
                    t.input.focus();
                }, 200);
            }
        },
        /**
         * ����������ı�״̬����onmouseover�¼�
         */
        preventMouseOverEvent : function(delay) {
            var t = this;
            if (t.swift != 1) {
                //console.log( delay );
                t.swift = 1;
                t.timeout3 && clearTimeout(t.timeout3);
                t.timeout3 = setTimeout(function() {
                    t.swift = 0;
                }, delay);
            }
        }
    }
})();

// #region old code
function setDialog(URLStr) {
    try {
        window.showModelessDialog(URLStr, window, "dialogWidth:620px;dialogHeight:400px;status:no;scroll:yes;help:no;");
    } catch(e) {
        var win = window.open(URLStr, "popup", "height=400,width=620,resizable=no,scrollbars=yes,modal=yes");
        win.focus();
    }
}