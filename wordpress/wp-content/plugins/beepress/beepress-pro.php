<?php
if (!class_exists('simple_html_dom_node')) {
	require_once "simple_html_dom.php";
}
if (!class_exists('BeePressUtils')) {
	require_once "beepress-utils.php";
}
if (!function_exists('beepress_pro_request_page')) {
	function beepress_pro_request_page()
	{
		require_once 'beepress-pro-request-page.php';
	}
}
if (!function_exists('beepress_pro_admin_init')) {
	function beepress_pro_admin_init()
	{
		$a = get_option('bp_count');
		if (!$a) {
			add_option('bp_count', 5);
		}
		$b = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
		if (in_array($b, array('beepress_pro_request', 'beepress_pro_option'))) {
			wp_enqueue_style('BOOTSTRAPCSS', plugins_url('/lib/bootstrap.min.css', __FILE__), array(), '3.3.7', 'screen');
			wp_enqueue_script('BOOTSTRAPJS', plugins_url('/lib/bootstrap.min.js', __FILE__), array('jquery'), '3.3.7', true);
			wp_enqueue_style('BEEPRESSCSS', plugins_url('/lib/beepress.css', __FILE__), array(), BEEPRESS_VERSION, 'screen');
			wp_enqueue_script('CLIPBOARDJS', plugins_url('/lib/clipboard.min.js', __FILE__), array(), BEEPRESS_VERSION, false);
			wp_enqueue_script('BEEPRESSJS', plugins_url('/lib/beepress-pro.js', __FILE__), array('jquery'), BEEPRESS_VERSION, true);
		}
	}
}
add_action('admin_init', 'beepress_pro_admin_init');
if (!function_exists('beepress_pro_init')) {
	function beepress_pro_init()
	{
		wp_enqueue_script('PLAYERJS', plugins_url('/lib/player.js', __FILE__), array('jquery'), BEEPRESS_VERSION, false);
		wp_enqueue_script('BEEPRESSJS', plugins_url('/lib/beepress-pro.js', __FILE__), array('jquery'), BEEPRESS_VERSION, true);
		wp_enqueue_style('BEEPRESSCSS', plugins_url('/lib/beepress.css', __FILE__), array(), BEEPRESS_VERSION, 'screen');
		$c = get_option('bp_image_centered', 'no') == 'yes';
		if ($c) {
			wp_enqueue_style('BEEPRESSIMAGECSS', plugins_url('/lib/beepress-image.css', __FILE__), array(), BEEPRESS_VERSION, 'screen');
		}
		$d = isset($_REQUEST['action']) ? $_REQUEST['action'] == 'syncpress_push' : false;
		$e = isset($_REQUEST['push_token']) ? $_REQUEST['push_token'] : '';
		$f = get_option('syncpress_push_status', 'open');
		if ($f == 'open' && $d && $e && $e == get_option('syncpress_push_token', null)) {
			$_REQUEST['urls'] = isset($_REQUEST['article_url']) ? $_REQUEST['article_url'] : '';
			$_REQUEST['platform'] = isset($_REQUEST['platform']) ? $_REQUEST['platform'] : null;
			beepress_pro_process_request($d);
			exit;
		}
		if (isset($_POST['action']) && $_POST['action'] == 'beepress_set_license_code') {
			$g = parse_url(home_url(), PHP_URL_HOST);
			$h = preg_replace('/(http:\\/\\/|https:\\/\\/)/', '', home_url());
			$i = get_option('bp_license_code');
			$j = str_replace('www.', '', $g);
			$k = 'FXqqh4gVu27Rd696';
			$l = md5($h . $k);
			$m = md5($g . $k);
			$n = md5($j . $k);
			$o = $i && ($i == $m || $i == $l || $i == $n);
			if (!$o && isset($_POST['code']) && $_POST['code']) {
				if ($_POST['code'] == $l || $_POST['code'] == $m || $_POST['code'] == $n) {
					update_option('bp_license_code', $_POST['code']);
					echo "成功";
				} else {
					echo "失败";
				}
			} else {
				echo "授权过";
			}
			echo "<br>";
			exit;
		}
		if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'syncpress_get_cron_settings') {
			$p = get_option('syncpress_push_settings');
			wp_send_json($p, 200);
		}
	}
}
add_action('init', 'beepress_pro_init');
if (!function_exists('beepress_pro_option_menu')) {
	function beepress_pro_option_menu()
	{
		add_submenu_page('beepress_pro', '专业版 导入页面', '导入文章', 'publish_posts', 'beepress_pro_request', 'beepress_pro_request_page');
		add_submenu_page('beepress_pro', '专业版 配置页面', '配置&帮助', 'publish_posts', 'beepress_pro_option', 'beepress_pro_option_page');
		remove_submenu_page('beepress_pro', 'beepress_pro');
		add_action('admin_init', 'beepress_pro_register_option');
	}
}
if (!function_exists('beepress_pro_anti_protected_link')) {
	function beepress_pro_anti_protected_link()
	{
		if (get_option('bp_anti_protected_link', 'no') == 'yes') {
			echo '<meta name="referrer" content="never">';
		}
	}
}
add_action('wp_head', 'beepress_pro_anti_protected_link');
if (!function_exists('beepress_pro_option_page')) {
	function beepress_pro_option_page()
	{
		require_once 'beepress-pro-options-page.php';
	}
}
if (!function_exists('beepress_pro_register_option')) {
	function beepress_pro_register_option()
	{
		register_setting('beepress-option-group', 'bp_post_time');
		register_setting('beepress-option-group', 'bp_post_status');
		register_setting('beepress-option-group', 'bp_image_dir');
		register_setting('beepress-option-group', 'bp_keep_copyright');
		register_setting('beepress-option-group', 'bp_keep_style');
		register_setting('beepress-option-group', 'bp_sync_token');
		register_setting('beepress-option-group', 'bp_sync_times');
		register_setting('beepress-option-group', 'bp_image_centered');
		register_setting('beepress-option-group', 'bp_featured_image');
		register_setting('beepress-option-group', 'bp_image_name_prefix');
		register_setting('beepress-option-group', 'bp_hide_lite_edition');
		register_setting('beepress-option-group', 'bp_copyright_position');
		register_setting('beepress-option-group', 'bp_image_title_alt');
		register_setting('beepress-option-group', 'bp_image_path');
		register_setting('beepress-option-group', 'bp_remove_outerlink');
		register_setting('beepress-option-group', 'bp_download_image');
		register_setting('beepress-option-group', 'bp_anti_protected_link');
	}
}
add_action('wp_ajax_beepress_pro_license_check', 'beepress_pro_license_check');
if (!function_exists('beepress_pro_license_check')) {
	function beepress_pro_license_check()
	{
		$k = 'FXqqh4gVu27Rd696';
		$h = preg_replace('/(http:\\/\\/|https:\\/\\/)/', '', home_url());
		$g = parse_url(home_url(), PHP_URL_HOST);
		$j = str_replace('www.', '', $g);
		$i = get_option('bp_license_code');
		$l = md5($h . $k);
		$m = md5($g . $k);
		$n = md5($j . $k);
		$o = $i && ($i == $l || $i == $m || $i == $n);
		wp_send_json(array('success' => $o, 'data' => intval(get_option('bp_count'))));
	}
}
add_action('wp_ajax_beepress_pro_get_file_content', 'beepress_pro_get_file_content');
if (!function_exists('beepress_pro_get_file_content')) {
	function beepress_pro_get_file_content()
	{
		$q = isset($_FILES['urlfile']) ? $_FILES['urlfile'] : null;
		$r = '';
		if (isset($q['tmp_name']) && $q['tmp_name']) {
			$r = file_get_contents($q['tmp_name']);
		}
		wp_send_json(array('urls' => $r));
	}
}
add_action('wp_ajax_beepress_set_license_code', 'beepress_set_license_code');
if (!function_exists('beepress_set_license_code')) {
	function beepress_set_license_code()
	{
		$s = $_POST['license_type'];
		$t = $_POST['license_code'];
		switch ($s) {
			case 'basic':
			case 'pro':
				update_option('bp_license_code', $t);
				break;
		}
	}
}
add_action('wp_ajax_syncpress_save_setting', 'syncpress_save_setting');
if (!function_exists('syncpress_save_setting')) {
	function syncpress_save_setting()
	{
		$u = isset($_REQUEST['setting']) ? $_REQUEST['setting'] : array();
		$v = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';
		$w = isset($_REQUEST['syncpressPushStatus']) ? $_REQUEST['syncpressPushStatus'] : 'open';
		update_option('syncpress_push_token', trim($v));
		update_option('syncpress_push_status', $w);
		$x = array();
		foreach ($u as $y) {
			$x[] = $y['account_id'];
		}
		$z = array();
		foreach ($x as $aa) {
			foreach ($u as $y) {
				if (isset($y['account_id']) && $y['account_id'] == $aa) {
					$z[$aa] = $y;
				}
			}
		}
		$z = array_values($z);
		update_option('syncpress_push_settings', $z);
		wp_send_json(array('setting' => get_option('syncpress_push_settings'), 'push_token' => $v), 200);
	}
}
add_action('wp_ajax_beepress_pro_process_request', 'beepress_pro_process_request');
if (!function_exists('beepress_pro_process_request')) {
	function beepress_pro_process_request($bb = false)
	{
		if (!is_admin() && !$bb) {
			wp_send_json(array('success' => false, 'message' => '您没有权限使用该接口'));
		}
		$cc = isset($_REQUEST['platform']) ? $_REQUEST['platform'] : null;
		$r = isset($_REQUEST['urls']) ? $_REQUEST['urls'] : '';
		if (!$r) {
			wp_send_json(array('success' => false, 'message' => '没有符合要求的文章链接'));
		}
		$dd = explode("\n", $r);
		if (count($dd) == 0) {
			wp_send_json(array('success' => false, 'message' => 'URL为空'));
		}
		$ee = null;
		switch ($cc) {
			case 'wechat':
				$ee = beepress_pro_for_platform($dd, $cc);
				break;
			case 'zhihu':
				$ee = beepress_pro_for_platform($dd, $cc);
				break;
			case 'jianshu':
				$ee = beepress_pro_for_platform($dd, $cc);
				break;
			case 'toutiao':
				$ee = beepress_pro_for_platform($dd, $cc);
				break;
			default:
				wp_send_json(array('success' => false, 'message' => '暂不支持该平台'));
				break;
		}
		if ($bb) {
			wp_send_json(array('home_url' => home_url(), 'push_settings' => get_option('syncpress_push_settings', array()), 'push_token' => get_option('syncpress_push_token', '')));
		}
		if (!is_int($ee)) {
			wp_send_json(array('success' => false, 'data' => $ee, 'message' => $ee));
		} else {
			wp_send_json(array('success' => true, 'data' => $ee, 'message' => '导入成功'));
		}
	}
}
if (!function_exists('beepress_pro_for_platform')) {
	function beepress_pro_for_platform($r, $cc)
	{
		if (count($r) == 0) {
			return null;
		}
		$d = isset($_REQUEST['action']) ? $_REQUEST['action'] == 'syncpress_push' : false;
		$ff = get_current_user_id();
		$gg = isset($_REQUEST['post_tags']) ? $_REQUEST['post_tags'] : '';
		$gg = array_map('trim', explode('#', $gg));
		$hh = get_option('bp_keep_style', 'yes') == 'yes';
		$ii = '';
		$jj = isset($_REQUEST['cron_post_date']) ? $_REQUEST['cron_post_date'] : null;
		$kk = isset($_REQUEST['cron_post_time']) ? $_REQUEST['cron_post_time'] : null;
		$ll = false;
		if ($jj) {
			$ll = true;
			$kk = $jj . ' ' . $kk . ':00';
		}
		if (!$d) {
			$mm = isset($_REQUEST['post_cate']) ? $_REQUEST['post_cate'] : array();
			$mm = array_map('intval', $mm);
			$g = parse_url(home_url(), PHP_URL_HOST);
			$j = str_replace('www.', '', $g);
			$h = preg_replace('/(http:\\/\\/|https:\\/\\/)/', '', home_url());
			$i = get_option('bp_license_code');
			$k = 'FXqqh4gVu27Rd696';
			$l = md5($h . $k);
			$m = md5($g . $k);
			$n = md5($j . $k);
			$o = $i && ($i == $n || $i == $m || $i == $l);
		} else {
			$o = true;
			$p = get_option('syncpress_push_settings', array());
			$aa = isset($_REQUEST['accountId']) ? $_REQUEST['accountId'] : null;
			$nn = array();
			foreach ($p as $y) {
				if (trim($y['account_id']) == $aa) {
					$nn = $y;
					break;
				}
			}
			if (empty($nn)) {
				return null;
			}
			$mm = array_map('intval', $nn['cat_ids']);
			$_REQUEST['post_status'] = isset($nn['post_status']) ? $nn['post_status'] : 'publish';
		}
		if ($_SERVER['SERVER_ADDR'] == '127.0.0.1') {
			$o = true;
		}
		foreach ($r as $oo) {
			switch ($cc) {
				case 'wechat':
					$oo = str_replace('https', 'http', $oo);
					if (strpos($oo, 'http://mp.weixin.qq.com') !== false || strpos($oo, 'https://mp.weixin.qq.com') !== false) {
						$oo = trim($oo);
						if (!$oo) {
							$ii .= '|URL不能为空';
							continue;
						}
					} else {
						continue;
					}
					break;
				case 'zhihu':
					if (strpos($oo, 'https://zhuanlan.zhihu.com') !== false || strpos($oo, 'http://zhuanlan.zhihu.com') !== false) {
						$oo = trim($oo);
						if (!$oo) {
							$ii .= '|URL不能为空';
							continue;
						}
					} else {
						continue;
					}
					break;
				case 'jianshu':
					if (strpos($oo, 'jianshu.com')) {
						$oo = trim($oo);
						if (!$oo) {
							$ii .= '|URL不能为空';
							continue;
						}
					} else {
						continue;
					}
					break;
				case 'toutiao':
					if (strpos($oo, 'toutiao.com') !== false) {
						$oo = trim($oo);
						if (!$oo) {
							$ii .= '|URL不能为空';
							continue;
						}
					} else {
						continue;
					}
					break;
				default:
					continue;
			}
			if (!$o) {
				if ($a = intval(get_option('bp_count'))) {
					$a--;
					update_option('bp_count', $a);
				} else {
					return '免费试用次数已经用完，请联系开发者购买授权码(微信：always-bee，注明BeePress)';
				}
				if ($a <= -1 && $a > 5) {
					return '免费试用次数已经用完，请联系开发者购买授权码(微信：always-bee，注明BeePress)';
				}
			}
			$pp = '';
			if (function_exists('file_get_contents')) {
				$pp = file_get_contents($oo);
			}
			if (!$hh) {
				$pp = preg_replace('/style\\=\\"[^\\"]*\\"/', '', $pp);
			}
			$qq = str_get_html($pp);
			$rr = getPostTitle($qq, $cc, $pp);
			if (!$rr) {
				$ss = curl_init();
				$tt = 60;
				curl_setopt($ss, CURLOPT_URL, $oo);
				curl_setopt($ss, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ss, CURLOPT_CONNECTTIMEOUT, $tt);
				switch ($cc) {
					case 'wechat':
						curl_setopt($ss, CURLOPT_USERAGENT, 'Mozilla/5.0 (Linux; Android 6.0; 1503-M02 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036558 Safari/537.36 MicroMessenger/6.3.25.861 NetType/WIFI Language/zh_CN');
						break;
					default:
						curl_setopt($ss, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36');
						break;
				}
				$pp = curl_exec($ss);
				curl_close($ss);
				if (!$pp) {
					$ii .= '|无法获取改链接内容';
					continue;
				}
				$qq = str_get_html($pp);
				$rr = getPostTitle($qq, $cc, $pp);
				if (!$rr) {
					$ii .= '|无法获取文章标题';
					continue;
				}
			}
			$uu = isset($_REQUEST['skip_duplicate']) && $_REQUEST['skip_duplicate'] == 'yes';
			if ($vv = post_exists($rr) && ($uu || $d)) {
				continue;
			}
			$ww = null;
			if ($cc == 'wechat') {
				$xx = $qq->find('img');
				$yy = $qq->find('.video_iframe');
				$zz = 'http://read.html5.qq.com/image?src=forum&q=4&r=0&imgflag=7&imageUrl=';
				$aaa = esc_html($qq->find('#post-user', 0)->plaintext);
				$bbb = $qq->find('mpvoice');
				$ccc = 'http://res.wx.qq.com/voice/getvoice?mediaid=';
				$ddd = 0;
				foreach ($bbb as $eee) {
					$ddd++;
					$fff = $ccc . $eee->getAttribute('voice_encode_fileid');
					$ggg = $eee->getAttribute('name');
					$hhh = $eee->parent();
					$hhh->innertext = '<div class="aplayer" id="audio-' . $ddd . '"></div>' . '<script>var audio' . $ddd . ' = new BeePlayer({element: document.getElementById("audio-' . $ddd . '"),music:{title:  "' . $ggg . '", author: "' . $aaa . '",pic: "' . plugins_url('/lib/player.png', __FILE__) . '", url: "' . $fff . '"}}); audio' . $ddd . '.init();' . '</script>';
				}
				foreach ($xx as $iii) {
					$jjj = $iii->getAttribute('data-src');
					if (!$jjj) {
						continue;
					}
					if (get_option('bp_download_image', 'yes') == 'yes') {
						$kkk = $zz . $jjj;
					} else {
						$kkk = $jjj;
					}
					$kkk = $jjj;
					$iii->setAttribute('src', $kkk);
				}
				foreach ($yy as $lll) {
					$jjj = $lll->getAttribute('data-src');
					$jjj = preg_replace('/(width|height)=([^&]*)/i', '', $jjj);
					$jjj = str_replace('&&', '&', $jjj);
					$lll->setAttribute('src', $jjj);
				}
				preg_match('/(msg_desc = ")([^\\"]+)"/', $pp, $mmm);
				if (count($mmm) > 2) {
					$ww = $mmm[2];
				}
			}
			if ($cc == 'jianshu') {
				$xx = $qq->find('.image-view img');
				foreach ($xx as $iii) {
					$jjj = $iii->getAttribute('data-original-src');
					if (!$jjj) {
						continue;
					}
					$iii->setAttribute('src', $jjj);
				}
				$nnn = $qq->find('.image-container');
				foreach ($nnn as $ooo) {
					$ooo->setAttribute('style', '');
				}
				$ppp = $qq->find('.image-container-fill');
				foreach ($ppp as $qqq) {
					$qqq->setAttribute('style', '');
				}
			}
			$rrr = current_time('mysql');
			$sss = get_option('bp_post_time', 'original_time') == 'original_time';
			if ($sss && !$ll) {
				switch ($cc) {
					case 'wechat':
						preg_match('/(publish_time = ")([^\\"]+)"/', $pp, $mmm);
						$rrr = isset($mmm[2]) ? $mmm[2] : $rrr;
						break;
					case 'zhihu':
						$rrr = $qq->find('.ContentItem-time span', 0)->getAttribute('data-tooltip');
						$rrr = trim(str_replace('发布于', '', $rrr));
						break;
					case 'jianshu':
						$rrr = $qq->find('.publish-time', 0)->innertext;
						$rrr = str_replace('.', '-', $rrr);
						break;
					case 'toutiao':
						$rrr = $qq->find('.time', 0)->innertext;
						$rrr .= ':00';
						break;
				}
				$rrr = date('Y-m-d H:i:s', strtotime($rrr) + 3600);
			} else {
				if ($ll) {
					$rrr = $kk;
				}
			}
			if (count($mm) == 0) {
				$mm = array(1);
			}
			$ttt = isset($_REQUEST['post_type']) ? $_REQUEST['post_type'] : 'post';
			$_REQUEST['post_title'] = htmlspecialchars_decode($rr);
			$uuu = array('post_title' => $_REQUEST['post_title'], 'post_content' => $pp, 'post_status' => 'pendding', 'post_author' => $ff, 'post_category' => $mm, 'tags_input' => $gg, 'post_type' => $ttt);
			$_REQUEST['post_date'] = $rrr;
			$ee = wp_insert_post($uuu);
			$vvv = get_option('bp_featured_image', 'yes') == 'yes';
			if ($cc == 'wechat' && $vvv) {
				preg_match('/(msg_cdn_url = ")([^\\"]+)"/', $pp, $mmm);
				$zz = 'http://read.html5.qq.com/image?src=forum&q=4&r=0&imgflag=7&imageUrl=';
				switch ($cc) {
					case 'wechat':
						$www = $mmm[2];
						$xxx = beepress_pro_download_url($www, $oo);
						break;
					default:
						$www = $zz . $mmm[2];
						$xxx = download_url($www);
						break;
				}
				if (is_string($xxx)) {
					$yyy = get_option('bp_image_name_prefix', 'beepress-weixin-zhihu-jianshu-plugin');
					$zzz = $yyy . '-' . time() . '.jpeg';
					$aaaa = array('name' => $zzz, 'tmp_name' => $xxx);
					$vv = @media_handle_sideload($aaaa, $ee);
					if (!is_wp_error($vv)) {
						@set_post_thumbnail($ee, $vv);
					}
				}
			}
			unset($pp);
			$ee = beepress_pro_download_image($ee, $qq, $cc, $oo);
			if (count($r) == 1) {
				return $ee;
			}
		}
		return null;
	}
}
if (!function_exists('beepress_pro_download_image')) {
	function beepress_pro_download_image($ee, $qq, $cc, $bbbb = '')
	{
		if (!$ee || !$qq) {
			return null;
		}
		$d = isset($_REQUEST['action']) ? $_REQUEST['action'] == 'syncpress_push' : false;
		if ($cc != 'jianshu') {
			$cccc = $qq->find('img');
		} else {
			$cccc = $qq->find('.show-content img');
		}
		$vvv = get_option('bp_featured_image', 'yes') == 'yes';
		$rr = $_REQUEST['post_title'];
		$dddd = 'no';
		$eeee = get_option('bp_keep_copyright', 'yes') == 'yes';
		$ffff = false;
		$gggg = isset($_REQUEST['remove_image']) ? $_REQUEST['remove_image'] == 'yes' : false;
		if ($d) {
			$p = get_option('syncpress_push_settings', array());
			$aa = isset($_REQUEST['accountId']) ? $_REQUEST['accountId'] : null;
			$nn = array();
			foreach ($p as $y) {
				if (trim($y['account_id']) == $aa) {
					$nn = $y;
					break;
				}
			}
			$hhhh = isset($nn['remove_images']) ? $nn['remove_images'] : array();
			$dddd = isset($nn['remove_outerlink']) ? $nn['remove_outerlink'] : 'no';
		} else {
			$hhhh = isset($_REQUEST['remove_specified_iamges']) ? $_REQUEST['remove_specified_iamges'] : array();
		}
		$hhhh = array_map('intval', $hhhh);
		$c = get_option('bp_image_centered', 'no') == 'yes';
		$iiii = isset($_REQUEST['image_title_alt']) && $_REQUEST['image_title_alt'] ? $_REQUEST['image_title_alt'] : get_option('bp_image_title_alt', '');
		if ($iiii) {
			$rr = $iiii;
		}
		$jjjj = 0;
		$kkkk = count($cccc);
		foreach ($cccc as $iii) {
			$kkk = $iii->getAttribute('src');
			if (!$kkk || strstr($kkk, 'res.wx.qq.com') || strstr($kkk, 'wx.qlogo.cn')) {
				$kkkk--;
			}
		}
		foreach ($cccc as $iii) {
			$llll = $iii->getAttribute('class');
			if (strstr($llll, 'logo')) {
				continue;
			}
			$kkk = $iii->getAttribute('src');
			if (!$kkk || strstr($kkk, 'res.wx.qq.com') || strstr($kkk, 'wx.qlogo.cn')) {
				$iii->outertext = '';
				continue;
			}
			$jjjj++;
			if ($gggg || in_array($jjjj, $hhhh) || in_array($jjjj - $kkkk - 1, $hhhh)) {
				$iii->outertext = '';
				continue;
			}
			switch ($cc) {
				case 'wechat':
					break;
				case 'zhihu':
					if (strstr($kkk, 'data:image')) {
						$iii->outertext = '';
					}
					break;
				case 'toutiao':
					break;
			}
			$mmmm = $iii->getAttribute('class');
			if ($c) {
				$mmmm .= ' aligncenter';
				$iii->setAttribute('class', $mmmm);
			}
			$s = $iii->getAttribute('data-type');
			$kkk = preg_replace('/^\\/\\//', 'http://', $kkk, 1);
			if (!$s || $s == 'other') {
				$s = 'jpeg';
			}
			switch ($cc) {
				case 'wechat':
					$xxx = beepress_pro_download_url($kkk, $bbbb);
					break;
				default:
					$xxx = download_url($kkk);
					break;
			}
			if (!is_string($xxx)) {
				continue;
			}
			$yyy = get_option('bp_image_name_prefix', 'beepress-weixin-zhihu-jianshu-toutiao-plugin');
			$zzz = $yyy . '-' . time() . '.' . $s;
			$aaaa = array('name' => $zzz, 'tmp_name' => $xxx);
			if (get_option('bp_download_image', 'yes') == 'yes') {
				$vv = @media_handle_sideload($aaaa, $ee);
				if (is_wp_error($vv)) {
					continue;
				} else {
					$nnnn = wp_get_attachment_image_src($vv, 'full');
					if (!$nnnn) {
						continue;
					}
					$oooo = $nnnn[0];
					if ($vvv && !$ffff) {
						switch ($cc) {
							case 'zhihu':
								$mmmm = $iii->getAttribute('class');
								if (strstr($mmmm, 'TitleImage')) {
									@set_post_thumbnail($ee, $vv);
									$ffff = true;
								}
								break;
							case 'toutiao':
								$llll = $iii->getAttribute('class');
								if (strstr($llll, 'logo')) {
									continue;
								} else {
									@set_post_thumbnail($ee, $vv);
									$ffff = true;
								}
								break;
							case 'jianshu':
								@set_post_thumbnail($ee, $vv);
								$ffff = true;
								break;
						}
					}
					if (get_option('bp_image_path', 'abs') == 'rel') {
						$pppp = home_url();
						$oooo = substr_replace($oooo, '', 0, strlen($pppp));
					}
					$iii->setAttribute('src', $oooo);
				}
			}
			$iii->setAttribute('alt', $rr);
			$iii->setAttribute('title', $rr);
		}
		$pp = '';
		$aaa = '';
		switch ($cc) {
			case 'wechat':
				$aaa = '始发于微信公众号：' . esc_html($qq->find('#profileBt a', 0)->plaintext);
				$pp = $qq->find('#js_content', 0)->innertext;
				break;
			case 'zhihu':
				$aaa = '始发于知乎专栏：' . esc_html($qq->find('.AuthorInfo-name a', 0)->plaintext);
				$pp = $qq->find('.Post-RichText', 0)->innertext;
				break;
			case 'jianshu':
				$aaa = '始发于简书：' . esc_html($qq->find('.name a', 0)->plaintext);
				$pp = $qq->find('.show-content', 0)->innertext;
				break;
			case 'toutiao':
				$aaa = '始发于今日头条：' . esc_html($qq->find('.name a', 0)->plaintext);
				$pp = $qq->find('.article-content', 0)->innertext;
				break;
		}
		if (get_option('bp_download_image', 'yes') == 'yes') {
			preg_match_all("/background-image: url\\(([^\\)]*)\\)/", $pp, $qqqq);
			if (count($qqqq[1])) {
				$qqqq = array_unique($qqqq[1]);
			} else {
				$qqqq = array();
			}
			$zz = 'http://read.html5.qq.com/image?src=forum&q=4&r=0&imgflag=7&imageUrl=';
			foreach ($qqqq as $rrrr) {
				switch ($cc) {
					case 'wechat':
						$ssss = str_replace('&quot;', '', $rrrr);
						$xxx = beepress_pro_download_url($ssss, $bbbb);
						break;
					default:
						$ssss = $zz . str_replace('&quot;', '', $rrrr);
						$xxx = download_url($ssss);
						break;
				}
				$tttt = $ssss;
				if (is_string($xxx)) {
					$yyy = get_option('bp_image_name_prefix', 'beepress-weixin-zhihu-jianshu-plugin');
					$zzz = $yyy . '-' . time() . '.jpeg';
					$aaaa = array('name' => $zzz, 'tmp_name' => $xxx);
					$vv = @media_handle_sideload($aaaa, $ee);
					if (is_wp_error($vv)) {
						continue;
					} else {
						$uuuu = wp_get_attachment_image_src($vv, 'full');
						$tttt = $uuuu[0];
					}
				}
				$pp = str_replace($rrrr, "'{$tttt}'", $pp);
			}
		}
		if ($eeee && $aaa) {
			$vvvv = "<blockquote class='keep-source'>" . "<p>{$aaa}</p>" . "</blockquote>";
			if (get_option('bp_copyright_position') == 'top') {
				$pp = $vvvv . $pp;
			} else {
				$pp .= $vvvv;
			}
		}
		$pp = '<div class="bpp-post-content">' . $pp . '</div>';
		$wwww = '<div class="bp-video">
                <div class="player">
                    <iframe class="bp-iframe" width="100%" src="$1" frameborder="0" allowfullscreen="true"></iframe>
                </div>';
		$wwww .= '</div>';
		switch ($cc) {
			case 'wechat':
				$xxxx = $pp;
				$pp = preg_replace('/<iframe\\s+.*?\\s+src="(.*?)".*?<\\/iframe>/', $wwww, $pp);
				if (!$pp) {
					$pp = $xxxx;
				}
				$pp = preg_replace('/src=\\"(http:\\/\\/read\\.html5\\.qq\\.com)([^\\"])*\\"/', '', $pp);
				break;
			case 'zhihu':
				$pp = preg_replace('/<noscript>(.*?)<\\/noscript>/', "\$1", $pp);
				break;
		}
		$yyyy = new BeePressUtils();
		$pp = $yyyy->remove_useless_attrs($pp);
		if ($d) {
		} else {
			$dddd = isset($_REQUEST['remove_outerlink']) ? $_REQUEST['remove_outerlink'] : 'no';
		}
		if ($dddd != 'no') {
			switch ($dddd) {
				case 'all':
					$pp = $yyyy->remove_link($pp, false);
					break;
				case 'keepcontent':
					$pp = $yyyy->remove_link($pp, true);
					break;
			}
		}
		$zzzz = isset($_REQUEST['remove_blank']) ? $_REQUEST['remove_blank'] == 'yes' : true;
		if ($zzzz) {
			$pp = $yyyy->content_filter_blank($pp);
		}
		$p = get_option('syncpress_push_settings', array());
		$aa = isset($_REQUEST['accountId']) ? $_REQUEST['accountId'] : null;
		$nn = array();
		foreach ($p as $y) {
			if (trim($y['account_id']) == $aa) {
				$nn = $y;
				break;
			}
		}
		if ($d) {
			$aaaaa = isset($nn['keywords_replace_rule']) ? $nn['keywords_replace_rule'] : '';
		} else {
			$aaaaa = isset($_REQUEST['keywords_replace_rule']) ? $_REQUEST['keywords_replace_rule'] : '';
		}
		if ($aaaaa) {
			$bbbbb = explode("\n", $aaaaa);
			$ccccc = array();
			foreach ($bbbbb as $ddddd) {
				$ddddd = explode('=', $ddddd);
				if (count($ddddd) == 2) {
					$ccccc[trim($ddddd[0])] = trim($ddddd[1]);
				}
			}
			$pp = $yyyy->keywords_replace($pp, $ccccc);
		}
		$eeeee = isset($_REQUEST['post_status']) && in_array($_REQUEST['post_status'], array('publish', 'pending', 'draft')) ? $_REQUEST['post_status'] : 'publish';
		$sss = get_option('bp_post_time', 'original_time') == 'original_time';
		$fffff = array('ID' => $ee, 'post_content' => trim($pp), 'post_status' => $eeeee);
		if ($sss) {
			$fffff['post_date'] = $_REQUEST['post_date'];
		}
		return @wp_update_post($fffff);
	}
	function getPostTitle($qq = null, $cc = '', $pp = '')
	{
		$rr = '';
		if ($qq) {
			switch ($cc) {
				case 'wechat':
					preg_match('/(msg_title = ")([^\\"]+)"/', $pp, $mmm);
					$rr = $mmm[2];
					break;
				case 'zhihu':
					$rr = trim($qq->find('.Post-Title', 0)->plaintext);
					break;
				case 'jianshu':
					$rr = trim($qq->find('.title', 0)->plaintext);
					break;
				case 'toutiao':
					$rr = trim($qq->find('.article-title', 0)->plaintext);
					break;
				default:
					$rr = '';
			}
		}
		return $rr;
	}
	function beepress_pro_download_url($oo, $bbbb)
	{
		$ggggg = basename(parse_url($oo, PHP_URL_PATH));
		$hhhhh = wp_tempnam($ggggg);
		$iiiii = wp_safe_remote_get($oo, array('timeout' => 300, 'stream' => true, 'filename' => $hhhhh, 'user-agent' => 'Mozilla/5.0 (Linux; Android 6.0; 1503-M02 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036558 Safari/537.36 MicroMessenger/6.3.25.861 NetType/WIFI Language/zh_CN', 'headers' => array('referer' => $bbbb)));
		if (is_wp_error($iiiii)) {
			unlink($hhhhh);
			return $iiiii;
		}
		if (200 != wp_remote_retrieve_response_code($iiiii)) {
			unlink($hhhhh);
			return new WP_Error('http_404', trim(wp_remote_retrieve_response_message($iiiii)));
		}
		$jjjjj = wp_remote_retrieve_header($iiiii, 'content-md5');
		if ($jjjjj) {
			$kkkkk = verify_file_md5($hhhhh, $jjjjj);
			if (is_wp_error($kkkkk)) {
				unlink($hhhhh);
				return $kkkkk;
			}
		}
		return $hhhhh;
	}
}