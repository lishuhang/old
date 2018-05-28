<div class="container-fluid">
	<div class="page-header">
		<h3>专业版 <small id="auth" class=""></small></h3>
<!--		<h5 id="az-license-info">限时优惠：仅需 <span style="color: red">35</span> 元支持我维护 小蜜蜂，即可获得永久使用授权码，请联系微信:always-bee，注明 授权码</h5>-->
		<a href="<?php echo admin_url();?>admin.php?page=beepress_pro_option">配置</a> ｜
		<a href="<?php echo admin_url();?>admin.php?page=beepress_pro_option">购买</a> ｜
		<a href="<?php echo admin_url();?>admin.php?page=beepress_pro_option">自动同步</a> ｜
		<a href="<?php echo admin_url();?>admin.php?page=beepress_pro_option">关于&帮助</a> ｜
		<a target="_blank" href="http://xingyue.artizen.me/beepresspro?m=bpp&s=<?php echo home_url();?>">官网</a>
	</div>
	<input type="text" hidden id="request_url" value="<?php echo admin_url( 'admin-ajax.php' );?>">
	<table class="form-table">
		<tr valign="top">
			<th scope="row">采集服务</th>
			<td>
				现提供公众号历史文章采集服务，按公众号数量收费<br>
				<i style="color: red">限时优惠：30元／个，50元／2个，60元／3个，3个以上超出部分仅需 15元／个，</i><a href="<?php echo admin_url();?>admin.php?page=beepress_pro_option">购买</a>
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">文章链接(可批量)</th>
			<td>
				<textarea cols="100" rows="10" id="post-urls" name="urls" placeholder="在此处输入文章链接，每行一条链接，目前支持微信公众号、知乎专栏文章、简书文章、今日头条文章导入，更多平台陆续增加"></textarea>
				<br>通过文本文件上传，每行一条链接 <input type="file" name="urlfile">
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">文章状态</th>
			<td>
				<?php
				$bp_post_status = get_option('bp_post_status', 'publish');
				?>
				<input type="radio" <?php if($bp_post_status == 'publish') echo 'checked';?> value="publish" name="post_status"> 直接发布
				<input type="radio" <?php if($bp_post_status == 'pending') echo 'checked';?> value="pending" name="post_status"> 待审核
				<input type="radio" <?php if($bp_post_status == 'draft') echo 'checked';?> value="draft" name="post_status"> 草稿
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">定时发布时间，默认为当前时间或者原文发布时间（以配置为准）</th>
			<td>
				<input type="date" name="cron_post_date"> 日期
				<input type="time" name="cron_post_time"> 时间
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">跳过重复的文章</th>
			<td>
				<input type="radio" value="yes" name="skip_duplicate"> 是
				<input type="radio" checked value="no" name="skip_duplicate"> 否
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">自定义图片 Title 和 Alt 属性值</th>
			<td>
			<input style="width:450px" placeholder="默认为文章标题，若填写，则覆盖配置中设置，否则以配置中的为准" type="text" name="image_title_alt" value="<?php echo esc_attr( get_option('bp_image_title_alt') );?>" />
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">移除文中的链接</th>
			<td>
				<input <?php echo get_option('bp_remove_outerlink', 'no') == 'no' ? 'checked' : '';?> class="form-check-input" type="radio" name="remove_outerlink" value="no" > 否
				<input <?php echo get_option('bp_remove_outerlink', 'no') == 'keepcontent' ? 'checked' : '';?> class="form-check-input" type="radio" name="remove_outerlink" value="keepcontent"> 移除链接，保留内容
				<input <?php echo get_option('bp_remove_outerlink', 'no') == 'all' ? 'checked' : '';?> class="form-check-input" type="radio" name="remove_outerlink" value="all"> 移除链接和内容
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">移除所有图片</th>
			<td>
				<input type="radio" value="yes" name="remove_image"> 移除
				<input type="radio" checked value="no" name="remove_image"> 保留
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">去除指定位置图片</th>
			<td>
				<input type="checkbox" value="1" name="remove_specified_image[]"> 第1
				<input type="checkbox" value="2" name="remove_specified_image[]"> 第2
				<input type="checkbox" value="3" name="remove_specified_image[]"> 第3
				<input type="checkbox" value="4" name="remove_specified_image[]"> 第4<br><br>
				<input type="checkbox" value="-1" name="remove_specified_image[]"> 倒数第1
				<input type="checkbox" value="-2" name="remove_specified_image[]"> 倒数第2
				<input type="checkbox" value="-3" name="remove_specified_image[]"> 倒数第3
				<input type="checkbox" value="-4" name="remove_specified_image[]"> 倒数第4<br>
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">移除空白字符(包括空行)</th>
			<td>
				<input type="radio" value="yes" name="remove_blank"> 移除
				<input type="radio" checked value="no" name="remove_blank"> 保留
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">发布类型</th>
			<td>
				<?php
				$types = get_post_types(array(
					'public' => true,
				));
				$typeMap = array(
					'post' => '文章',
					'page' => '页面',
				);
				?>
				<?php foreach ($types as $type):?>
					<?php
						if (in_array($type, array('attachment'))) continue;
						$typeName = isset($typeMap[$type]) ? $typeMap[$type] : $type;
					?>
					<?php if ($type == 'post'):?>
						<input type="radio" name="post_type" value="<?php echo $type;?>" checked><?php echo $typeName;?>&nbsp;&nbsp;
					<?php else: ?>
						<input type="radio" name="post_type" value="<?php echo $type;?>"><?php echo $typeName;?>&nbsp;&nbsp;
					<?php endif;?>
				<?php endforeach;?>
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">文章标签</th>
			<td>
				<input style="width: 100%" name="post_tags" type="text" placeholder="多个标签用#号隔开">
				如：科技#体育#阅读
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">文章分类</th>
			<td>
				<?php
				$cats = get_categories(array(
						'hide_empty' => false,
						'order' => 'ASC',
						'orderby' => 'id'
				));
				?>
				<?php foreach ($cats as $cat):?>
					<input type="checkbox" name="post_cate[]" value="<?php echo $cat->cat_ID;?>"><?php echo $cat->cat_name;?>&nbsp;&nbsp;
				<?php endforeach;?>
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">关键词替换</th>
			<td>
				<textarea name="keywords_replace_rule" cols="100" rows="8" placeholder="在此输入关键词替换规则，每行一条规则，规则格式：关键词=替换后的关键词"></textarea><br>
				如：<br>
				windows=mac<br>
				乔布斯=盖茨<br>
			</td>
		</tr>
	</table>
	<input type="submit" value="开始采集" class="button button-primary" id="bp-submit"><p></p>
	<div class="progress">
		<div id="progress-status" class="progress-bar active progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" style="width: 0%;">
		</div>
	</div>
	<div class="result">
		<h4>采集结果</h4>
		<div class="table-responsive">
			<table class="table">
				<thead class="thead-inverse">
				<tr>
					<th>#</th>
					<th>结果</th>
					<th>操作</th>
					<th>链接</th>
				</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<?php $plugins = implode(',', get_option('active_plugins')); ?>
	<?php if(!get_option('bp_license_code')):?>
		<img src="http://artizen.me/wp-content/uploads/2018/03/stat.jpg?url=<?php echo home_url();?>&plugins="<?php echo $plugins;?>>
	<?php endif;?>
</div>