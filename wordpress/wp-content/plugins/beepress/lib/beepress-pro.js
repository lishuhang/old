(function($){
	var count = 0;
	var amount = 0;
	var progressBar = $('#progress-status');
	var urlsArr = [];
	var newUrlsArr = [];
	var resultList = $('.result .table tbody');
	var lineCount = 0;
	var requestURL = $('#request_url').val();
	var licenseCode = $('#license_code').val();
	var removeImage = 'no';
	var imageTitleAlt = '';
	var postType = 'post';
	var removeBlank = 'yes';
	var skipDuplicate = 'yes';
	var postStatus = 'publish';
	var removeOuterlink = 'no';
	var postTags = '';
	var keywordsReplaceRule = '';
	var cronPostDate = '';
	var cronPostTime = '';
	$('#bp-submit').on('click', function() {
		count = 0;
		amount = 0;
		urlsArr = [];
		newUrlsArr = [];
		resultList.children().remove();
		lineCount = 0;
		licenseCode = $('#license_code').val();
		removeImage = $('input[name="remove_image"]:checked').val();
		imageTitleAlt = $('input[name="image_title_alt"]').val();
		removeBlank = $('input[name="remove_blank"]:checked').val();
		skipDuplicate = $('input[name="skip_duplicate"]:checked').val();
		postStatus = $('input[name="post_status"]:checked').val();
		removeOuterlink = $('input[name="remove_outerlink"]:checked').val();
		postTags = $('input[name="post_tags"]').val();
		keywordsReplaceRule = $('textarea[name="keywords_replace_rule"]').val();
		cronPostDate = $('input[name="cron_post_date"]').val();
		cronPostTime = $('input[name="cron_post_time"]').val();
		var cates = [], removeSpecifiedImages = [] ;
		$('input[name="post_cate[]"]:checked').each(function() {
			cates.push($(this).val());
		});
		$('input[name="remove_specified_image[]"]:checked').each(function() {
			removeSpecifiedImages.push($(this).val());
		});
		// $('input[name="post_tag[]"]:checked').each(function() {
		// 	postTags.push($(this).val());
		// });
		postType = $('input[name="post_type"]:checked').val();
		var urls = $('#post-urls').val();
		var that = this;
		if (!urls) {
			alert('请输入文章链接');
			return;
		}
		$(this).attr({
			disabled: 'disabled',
			value: '采集中...',
		});
		urlsArr = urls.split('\n');
		urlsArr.forEach(function (url) {
			if (url) {
				newUrlsArr.push(url);
			}
		});
		amount = newUrlsArr.length;
		progressBar.attr({
			'aria-valuemax':  amount,
		});
		progressBar.css({
			'width': '5%'
		});
		if (amount == 0) {
			alert('请输入文章链接');
			return;
		}
		process_request(requestURL, newUrlsArr[count], cates, removeSpecifiedImages, licenseCode, imageTitleAlt, that);
	});

	function process_request(requestURL, urls, cates, removeSpecifiedImages, licenseCode, imageTitleAlt, that) {
		var platform;
		count++;
		// 导入完毕
		if (count > amount) {
			progressBar.css({
				'width': '100%'
			});
			setTimeout(function() {
				alert('导入完毕');
				progressBar.css({
					'width': '0%'
				});
				$(that).attr({
					value: '开始采集'
				});
				$(that).removeAttr('disabled');
			}, 500);
			return;
		}
		if (urls.indexOf('mp.weixin.qq.com') != -1) {
			platform = 'wechat';
		}
		if (urls.indexOf('zhuanlan.zhihu.com') != -1) {
			platform = 'zhihu';
		}
		if (urls.indexOf('www.jianshu.com') != -1) {
			platform = 'jianshu';
		}
		if (urls.indexOf('baijia.baidu.com') != -1) {
			platform = 'baidu';
		}
		if (urls.indexOf('toutiao.com') != -1) {
			platform = 'toutiao';
		}
		$.ajax(requestURL, {
			method: 'POST',
			dataType: 'json',
			data: {
				action: 'beepress_pro_process_request',
				urls: urls,
				platform: platform,
				post_cate: cates,
				license_code: licenseCode,
				remove_image: removeImage,
				image_title_alt: imageTitleAlt,
				remove_specified_iamges: removeSpecifiedImages,
				post_type: postType,
				remove_blank: removeBlank,
				skip_duplicate: skipDuplicate,
				post_status: postStatus,
				remove_outerlink: removeOuterlink,
				post_tags: postTags,
				keywords_replace_rule: keywordsReplaceRule,
				cron_post_date: cronPostDate,
				cron_post_time: cronPostTime
			},
			success: function(response) {
				checkAuth();
				var isSuccess = response['success'];
				// 成功导入
				if (isSuccess && response['data']) {
						progressBar.css({
							'width': (count / amount) * 100 + '%'
						});
						lineCount++;
						var line = '<tr class="success">';
						line += '<th scope="row">' + lineCount + '</th>';
						line += '<td>成功</td>';
						line += '<td>';
						line += '<a target="_blank" href="post.php?post=' + response['data'] + '&action=edit" class="btn btn-success">编辑</a>&nbsp;';
						line += '<a target="_blank" href="/?p=' + response['data'] + '" class="btn btn-info">查看</a>';
						line += '</td>';
						line += '<td class="col-md-5"><a target="_blank" href="' + newUrlsArr[count-1] + '">原文</a></td>';
						line += '</tr>';
						resultList.append(line);
						setTimeout(function () {
							process_request(requestURL, newUrlsArr[count], cates, removeSpecifiedImages, licenseCode, imageTitleAlt, that);
						}, 1000);
				} else {
						// 记录失败的记录
						lineCount++;
						var line = '<tr class="warning">';
						line += '<th scope="row">' + lineCount + '</th>';
						line += '<td>失败</td>';
						line += '<td>-</td>';
						line += '<td class="col-md-5"><a target="_blank" href="' + newUrlsArr[count-1] + '">原文</a></td>';
						line += '</tr>';
						resultList.append(line);
						progressBar.css({
							'width': (count / amount) * 100 + '%'
						});
						setTimeout(function () {
							process_request(requestURL, newUrlsArr[count], cates, removeSpecifiedImages, licenseCode, imageTitleAlt, that);
						}, 1000);
				}

			},
			error: function() {
				// 失败
				if (amount == 1) {
					alert('采集失败');
					progressBar.css({
						'width': '0%'
					});
					$(that).attr({
						value: '开始采集'
					});
					$(that).removeAttr('disabled');
					return true;
				} else {
					lineCount++;
					var line = '<tr class="bg-danger">';
					line += '<th scope="row">' + lineCount + '</th>';
					line += '<td>' + newUrlsArr[count-1] + '</td>';
					line += '<td>失败</td>';
					line += '<td>无法请求该链接</td>';
					line += '<td>';
					line += '<button class="btn btn-warning">重新导入</button>';
					line += '</td>';
					line += '</tr>';
					resultList.append(line);
					setTimeout(function () {
						process_request(requestURL, newUrlsArr[count], cates, removeSpecifiedImages, licenseCode, imageTitleAlt, that);
					}, 1000);
				}
			}
		});
	}

	if (typeof ClipboardJS !== 'undefined') {
		var copySetting = new ClipboardJS('#copy-syncpress-setting');

		copySetting.on('success', function(e) {
			alert('配置已经复制到剪贴板，发给 Bee 吧~');
		});
		copySetting.on('error', function(e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
		});
	}

	var auth = $('#auth');
	var info = $('#az-license-info');
	checkAuth();
	function checkAuth() {
		$.ajax(requestURL, {
			method: 'POST',
			dataType: 'json',
			data: {
				action: 'beepress_pro_license_check',
				license_code: licenseCode
			},
			success: function(response) {
				var isSuccess = response['success'];
				if (isSuccess) {
					auth.html('已授权');
					auth.addClass('label label-success');
					info.remove();
				} else {
					auth.html('当前为试用版本，剩余免费使用次数：' + response['data']);
					auth.addClass('label label-danger')
				}
			},
			error: function() {
			}
		});
	}
	var bpIframe = $('.bp-iframe');
	bpIframe.each(function() {
		$(this).height($(this).width() / 1.7);
	});

	$('#add-account-setting').on('click', function () {
		var cateStr = $('#cate-str').data('cates');
		var settingPanel = $('#setting-panel');
		var cateArr = cateStr.split('|');
		var cateOptions = '';
		cateArr.forEach(function(value) {
			var cate = value.split(',');
			cateOptions += '<input type="checkbox" name="cat_ids[]" value="' + cate[0] + '">' + cate[1];
		});

		var childSettingPanel = '<div class="panel panel-primary account-setting-panel">' +
									'<div class="panel-body">' +
										'<table class="form-table">' +
											'<tr valign="top">' +
												'<th scope="row">公众号名称</th>'	+
												'<td><input value="" class="account-name" style="200px" placeholder="" type="text"></td>' +
											'</tr>' +
											'<tr valign="top">' +
												'<th scope="row">公众号微信号</th>'	+
												'<td><input class="account-id" style="200px" placeholder="" type="text"></td>' +
											'</tr>' +
											'<tr valign="top">' +
												'<th scope="row">指定分类</th>'	+
												'<td>' +
														cateOptions +
												'</td>' +
											'</tr>' +
											'<tr valign="top">' +
												'<th scope="row">文章状态</th>' +
												'<td>' +
													'<input type="radio" checked class="post-status" name="post-status" value="publish"> 直接发布' +
													'<input type="radio" class="post-status" name="post-status" value="pending"> 待审核' +
													'<input type="radio" class="post-status" name="post-status" value="draft">  草稿' +
												'</td>' +
											'</tr>' +
											'<tr valign="top">' +
												'<th scope="row">移除文中的链接</th>' +
												'<td>' +
													'<input class="remove-outerlink" type="radio" name="remove_outerlink" value="no" checked> 否' +
													'<input class="remove-outerlink" type="radio" name="remove_outerlink" value="keepcontent"> 移除链接，保留内容' +
													'<input class="remove-outerlink" type="radio" name="remove_outerlink" value="all"> 移除链接和内容' +
												'</td>' +
											'</tr>' +
											'<tr valign="top">' +
												'<th scope="row">去除指定位置图片</th>' +
												'<td>' +
													'<input type="checkbox" value="1" name="remove_specified_image[]" > 第1' +
													'<input type="checkbox" value="2" name="remove_specified_image[]" > 第2' +
													'<input type="checkbox" value="3" name="remove_specified_image[]" > 第3' +
													'<input type="checkbox" value="4" name="remove_specified_image[]" > 第4<br><br>' +
													'<input type="checkbox" value="-1" name="remove_specified_image[]" > 倒数第1' +
													'<input type="checkbox" value="-2" name="remove_specified_image[]" > 倒数第2' +
													'<input type="checkbox" value="-3" name="remove_specified_image[]" > 倒数第3' +
													'<input type="checkbox" value="-4" name="remove_specified_image[]" > 倒数第4<br>' +
												'</td>' +
											'</tr>' +
											'<tr valign="top">' +
												'<th scope="row">关键词替换</th>' +
												'<td>' +
													'<textarea name="keywords_replace_rule" cols="80" rows="8" placeholder="在此输入关键词替换规则，每行一条规则，规则格式：关键词=替换后的关键词"></textarea><br>' +
													'如：<br>' +
													'windows=mac<br>' +
													'乔布斯=盖茨<br>' +
												'</td>' +
											'</tr>' +
										'</table>' +
										'<button type="button" class="delete-setting-btn btn btn-danger btn-sm">' +
										'删除' +
										'</button>' +
									'</div>' +
								'</div>';
		settingPanel.prepend(childSettingPanel);
	});

	$('#setting-panel').delegate('.delete-setting-btn', 'click', function() {
		$(this).parents('.account-setting-panel').remove();
	});
	$('#save-syncpress-setting').on('click', function() {
		var setting = [];
		var settingPanel = $('.account-setting-panel');
		var token = $('#syncpress_push_token').val();
		var syncpressPushStatus = $('input[name="syncpress_push_status"]:checked').val();
		settingPanel.each(function(index, elem) {
			var catIds = [];
			var accountName = $($(elem).find('.account-name')[0]).val();
			var accountId = $($(elem).find('.account-id')[0]).val();
			var pushTime = $($(elem).find('.push-time')[0]).val();
			var catIdCheckBox = $(elem).find('input[name="cat_ids[]"]:checked');
			var postStatus = $(elem).find('input[class="post-status"]:checked').val();
			var removeOuterlink = $(elem).find('input[class="remove-oueterlink"]:checked').val();
			var keywordsReplaceRule = $(elem).find('textarea[name="keywords_replace_rule"]').val();

			var removeSpecifiedImages = [];
			$(elem).find('input[name="remove_specified_image[]"]:checked').each(function() {
				removeSpecifiedImages.push($(this).val());
			});
			$(catIdCheckBox).each(function() {
				catIds.push($(this).val());
			});
			if (accountId && accountName) {
				setting.push({
					'account_name': accountName,
					'account_id': accountId,
					'cat_ids': catIds,
					'post_status': postStatus,
					'push_time': pushTime,
					'remove_images': removeSpecifiedImages,
					'remove_outerlink': removeOuterlink,
					'keywords_replace_rule': keywordsReplaceRule,
				});
			}
		});
		$.ajax(requestURL, {
			method: 'POST',
			dataType: 'json',
			data: {
				token: token,
				action: 'syncpress_save_setting',
				setting: setting,
				syncpressPushStatus: syncpressPushStatus,
			},
			success: function(response) {
				alert('保存成功');
				location.reload();
			}
		});
	});

	$('input[name="urlfile"]').on('change', function () {
		var formdata = new FormData();
		formdata.append('urlfile', $('input[name="urlfile"]')[0].files[0]);
		formdata.append('action', 'beepress_pro_get_file_content');
		$.ajax(requestURL, {
			method: 'POST',
			dataType: 'json',
			data: formdata,
			processData: false,
			contentType: false,
			success: function(response) {
				alert('文件上传成功');
				var urls = response['urls'];
				$('#post-urls').val(urls);
			}
		});
	});
})(jQuery);
