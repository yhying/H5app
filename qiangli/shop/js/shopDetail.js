mui.init({
	container: ".mui-scroll-wrapper", // 传入区域滚动父容器的选择器
})
mui('.mui-scroll-wrapper').scroll();
	//接收页面跳转参数
	//接收地址参数
	mui('mui-scroll-wrapper').scroll( );
	var Request = new Object();
	Request = GetRequest();
	var shopId,type;//获取商品id和属性
	shopId = Request["id"];
	type = Request["type"];
	//判断商品是：0普通商品，1拼团商品，2限时商品
	console.log('接收参数'+shopId+':type:'+type);
	
	var product_detail;//创建商品详情数组
	var PropertyArr = [];//创建商品属性数组
	var product_prices_id;//商品属性id
	
	if(type == 0){
		//0普通商品
		$('.groupData').hide();//隐藏拼团活动组件
		$('.deseno-box').hide();//隐藏限时抢购数据
		$('.groupBtn').hide();//隐藏底部拼团按钮
		//执行普通商品获取函数
		getShopDetail(shopId);
		$('.foot').show();//隐藏底部结算按钮
		$('.shopDetail-num').show();
	}
	if(type == 1){
		//1拼团商品
		$('.deseno-box').hide();//隐藏限时抢购数据
		$('.foot').hide();//隐藏底部结算按钮
		//执行拼团商品获取函数
		getGroupDetail(shopId);
		getMoreProducts(1);
		$('.groupBtn').show();//显示底部拼团按钮
		$('.groupData').show();//显示拼团活动组件
		$('.shopDetail-num').show();
	}
	if(type == 2){
		//2限时商品
		$('.groupData').hide();//隐藏拼团活动组件
		$('.groupBtn').hide();//隐藏底部拼团按钮
		$('.shopDetail-num').hide();
		//执行限时商品获取函数
		getDesenoDetail(shopId);
		$('.deseno-box').show();//显示限时抢购数据
		$('.foot').show();//隐藏底部结算按钮
		
	}
	
/***********************拼团部分****************************/
	//点击查看更多
	var moreGroupLenght;//更多拼团数据的长度
	mui('.groupPerson').on('tap','span',function(){
		if(moreGroupLenght > 0){
			mui("#popoverbox").popover('toggle', document.getElementById("divbox"));
		}else{
			mui.alert('暂无更多拼单产品');
		}
		
	})
	mui('.morebox').on('tap','button',function(){
		mui.alert('更多拼团');
	})
	//点击拼团
	mui('.groupScroll-box').on('tap','.goGroup',function(){
		// let arr = [
		// 	{name:'id',val:'5'},
		// 	{name:'page',val:'haha'},
		// ];
		// encryptData('a',arr);
		// let aa = decodeData('a');
		// console.log(JSON.stringify(aa));
		mui("#popover").popover('toggle', document.getElementById("div"));
	})
	//点击参与拼团
	mui('#popover').on('tap','button',function(){
		mui.alert('参与拼团');
	})
	//点击拼团弹窗中的关闭按钮
	mui('.groupPopover').on('tap','.Pop-close',function(){
		mui('#popover').popover('hide');
		mui('#popoverbox').popover('hide'); 
	})
	var GroupStatus;//判断单、多人购买数据。
	//拼团结算按钮
	mui('.groupBtn').on('tap','.mui-btn',function(){
		//防止事件冒泡
		event.stopPropagation();
		let type = this.getAttribute('data-type');
		GroupStatus = type;
		mui("#picture").popover('toggle');//这是可以用来关闭底部弹窗的事件
		//单人拼团
		if(type == 1){
			console.log('点击了单人拼');
		}
		//多人拼团
		else if(type == 2){
			console.log('点击了多人拼');
		}
	})
	/*
	 * 获取拼团商品数据函数：get_group_detail
	 * id：商品id
	 */
	function getGroupDetail(id){
		mui.ajax(baseUrl + '/api/pintuan/home/product_detail',{
			data:{
				product_id:id
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',
			timeout:10000,//超时时间设置为10秒；
			headers:{
				'Api-Token':'xx'
			},
			success:function(data){
				//获取数据成功
				console.log(JSON.stringify(data));
				if(data.code == 1000){
					product_detail = data.data;//保存详情数据
					//执行数据渲染函数
					renderGroupDetail(product_detail);
					console.log(JSON.stringify(data.data.product_props));
					//判断商品有几个属性，让数组PropertyArr长度等于属性个数 
					PropertyArr = getPropertyArrLength(data.data.product_props,PropertyArr);
					console.log('属性数组：'+JSON.stringify(PropertyArr));
				}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			}
		});
	}
	/*
	 * 拼团渲染函数：renderGroupDetail
	 */
	function renderGroupDetail(data){
		if(data){
			let datas = data.product_info[0];
//			console.log(JSON.stringify(datas.product_info));
			//轮播图渲染
			mui.each(datas.imgs,function(index,item){
				let html = `
					<div class="swiper-slide"><img src="${item.imgurl}" alt=""></div>
				`
				$('.swiper-wrapper').append(html);
			})
			//初始化轮播组件
			starSwiper();
			//商品数据渲染
			$('.shopDetail-data p').html(datas.name);//标题
			$('.subname').html(datas.subname);//副标题
			$('.shopPrice').html('¥'+datas.group_price);//拼团价
			let shopPrime = `<span class="prime shopPrime">¥${datas.original_price}</span>`
			$('.shopPrice').append(shopPrime);
			$('.shopSold').html('已售'+datas.virtual_sales+'件');//销量
			//商品详情渲染
			$('.detail').html(datas.detail);
			
			//正在拼团数据渲染 
			let activity_info = data.activity_info;
			mui.each(activity_info,function(index,item){
				if(activity_info){
					$('.groupData').show();
					let html = `
					<li class="groupScroll">
					  	<div class="groupScroll-l">
					  		<img src="${item.logo}" alt="" />
					  		<span>${item.nickname}</span>
					  	</div>
					  	<div class="groupScroll-data">`;
					  		let num = item.people_num - item.count_num;
					  		html+= `<p>还差<span>${num}人</span>拼成</p>`;
					  		html+= `<p>剩余23: 49：36</p>`;
					  	html+= `</div>
				  		<div class="goGroup">去拼团</div>
				    </li>`;
				    $('.groupScroll-box').append(html);
				}
				else{
					$('.groupData').hide();//没有商品隐藏容器
				}
			})
			//执行渲染属性函数
			renderGroupProp(data);
			//渲染底部按钮
			scroll_f();
			$('.groupBtn').children(":first").html('单人购买价格</br>￥'+datas.single_price);
			$(".groupBtn").children().eq(1).html(datas.group_num+'人购买价格</br>￥'+datas.group_price);
		}
	}
	/*
	 * 获取更多拼团产品：getMoreProducts
	 * page:页数
	 */
	function getMoreProducts(page){
		mui.ajax(baseUrl + '/api/pintuan/home/get_more_group',{
			data:{
				page:page
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',
			timeout:10000,//超时时间设置为10秒；
			headers:{
				'Api-Token':'xx'
			},
			success:function(data){
				//获取数据成功
				console.log(JSON.stringify(data));
				//执行数据渲染函数
				renderMoreProducts(data.data);
				//更多拼团数据的长度
				moreGroupLenght = data.data.length;
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			}
		});
	}
	/*
	 * 渲染更多拼团数据
	 * data:拼团数据
	 */
	function renderMoreProducts(data){
		if(data){
			mui.each(data,function(index,item){
				let html = `
					<div class="morelist">
						<img src="${item.logo}" alt="" />
						<div class="more-item">
							<span>${item.nickname}</span>
							<p>剩余23:31:59</p>
						</div>
						<button data-img="${item.logo}">去拼团</button>
					</div>
				`
				$('.mui-scroll').append(html);
			})
		}
	}
	//拼团滚动效果
	var scrollIndex = 0;
	var Timer = null;
	/*
	 * 拼团滚动函数：scroll_f
	 */
	function scroll_f(){
		clearInterval(Timer);
			var ul = $("#scroll ul");
			var li = ul.children("li");
			var h = document.getElementById("scroll").offsetHeight / 2;
			var index = 0;
			ul.css("height",h*li.length*2);
			ul.html(ul.html()+ul.html());  //复制一份当前ul内容 
				function run(){
					if(scrollIndex>=li.length){
					ul.css({top:0});
					scrollIndex = 1;
					ul.animate({top:-scrollIndex*h},200);
				} 
				else{
					scrollIndex++; 
					ul.animate({top:-scrollIndex*h},200);
				}
			}
		Timer= setInterval(run,3000); 
	}
	/*
	 * 
	 */
	/*
	 * 渲染拼团属性函数：renderGroupProp
	 * data:商品属性数据
	 */
	function renderGroupProp(data){
		//属性渲染
//		console.log('拼团属性');
//		console.log(JSON.stringify(data));
		let model = `
			<div class="model-img"><img src="${data.product_info[0].default_imgurl}" alt=""></div>
			<div class="model-data">
				<div class="price">￥${data.product_info[0].group_price}<span>起</span><span class="prime">￥${data.product_info[0].original_price}</span></div>
				<div class="stock">库存${data.product_info[0].stock}件</div>
			</div>
		`
		$('.model-top').append(model);
//			console.log('属性'); 
//			console.log(datas.product_spec.length);
		mui.each(data.product_props,function(index,item){
//				console.log(JSON.stringify(item));
			let html = `
				<div class="model-row">
					<p>${item.name}</p>
					<ul>`;
				mui.each(item.children,function(inde,it){
//					console.log(JSON.stringify(it));
					if(it.disable == 0){
						html+=`<li class="model-select" data-index="${index}" data-id="${it.id}">${it.name}</li><!--model-active-->`;
					}
					
					else if(it.disable == 1){
						html+=`<li class="model-no">${it.name}</li><!--model-active-->`;
					}
				})
				html+=`</ul>
					</div>`;
			$('.model-list').append(html);
		})
	}

	
/***********************拼团部分结束****************************/
/***********************限时抢购部分****************************/
	/*
	 * 获取限时商品数据函数：get_deseno_detail
	 * id：商品id
	 */
	function getDesenoDetail(id){
		mui.ajax(baseUrl + '/api/mall/product_detail',{
			data:{
				pid:id
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',
			timeout:10000,//超时时间设置为10秒；
			headers:{
				'Api-Token':'xx'
			},
			success:function(data){
				//获取数据成功
				console.log(JSON.stringify(data));
				if(data.code == 1000){
					//执行渲染函数
					renderDesenoDetail(data.data);
					//保存详情数据
					product_detail = data.data;
					//判断商品有几个属性，让数组PropertyArr长度等于属性个数 
					PropertyArr = getPropertyArrLength(data.data[0].product_spec,PropertyArr);
					console.log('属性数组：'+JSON.stringify(PropertyArr));
				}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			}
		});
	}
	/*
	 * 渲染限时商品函数：renderDesenoDetail
	 * data:限时抢购数据
	 */
	function renderDesenoDetail(data){
		console.log(JSON.stringify(data));
		if(data){
			let datas = data[0];
			//轮播图渲染
			mui.each(datas.product_slide,function(index,item){
				let html = `
					<div class="swiper-slide"><img src="${item.imgurl}" alt=""></div>
				`
				$('.swiper-wrapper').append(html);
			})
			//初始化轮播组件
			starSwiper();
			
			$('.desenoPrice').html('¥'+datas.now_price);//现价
			$('.desenoPrime').html('¥'+datas.orgin_price);//原价
			$('.desenoSold').html(datas.sell_count);//销量
			//商品数据渲染
			$('.shopDetail-data p').html(datas.name);//标题
			$('.subname').html(datas.profiles);//副标题
//			$('.shopPrice').html('¥'+datas.now_price);//现价
//			let shopPrime = `<span class="prime shopPrime">¥${datas.orgin_price}</span>`
//			$('.shopPrice').append(shopPrime);
//			$('.shopSold').html('已售'+datas.show_sell_count+'件');//销量
			//商品详情渲染
			$('.detail').html(datas.description);
			//执行渲染属性函数
			renderProp(datas);
		}
	}
/***********************限时抢购部分结束****************************/
/***********************普通商品部分****************************/
	/*
	 * 获取普通商品数据函数：getShopDetail
	 * id：商品id
	 */
	function getShopDetail(id){
		mui.ajax(baseUrl + '/api/mall/product_detail',{
			data:{
				pid:id
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',
			timeout:10000,//超时时间设置为10秒；
			headers:{
				'Api-Token':'xx'
			},
			success:function(data){
				//获取数据成功
				console.log(JSON.stringify(data));
				if(data.code == 1000){
					//执行渲染函数
					renderShopDetail(data.data);
					//保存详情数据
					product_detail = data.data;
					//判断商品有几个属性，让数组PropertyArr长度等于属性个数 
					PropertyArr = getPropertyArrLength(data.data[0].product_spec,PropertyArr);
					console.log('属性数组：'+JSON.stringify(PropertyArr));
				}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			}
		});
	}
	/*
	 * 渲染普通商品函数：renderShopDetail
	 */
	function renderShopDetail(data){
		if(data){
			let datas = data[0];
			//轮播图渲染
			mui.each(datas.product_slide,function(index,item){
				let html = `
					<div class="swiper-slide"><img src="${item.imgurl}" alt=""></div>
				`
				$('.swiper-wrapper').append(html);
			})
			//初始化轮播组件
			starSwiper();
			//商品数据渲染
			$('.shopDetail-data p').html(datas.name);//标题
			$('.subname').html(datas.profiles);//副标题
			$('.shopPrice').html('¥'+datas.now_price);//现价
			let shopPrime = `<span class="prime shopPrime">¥${datas.orgin_price}</span>`
			$('.shopPrice').append(shopPrime);
			$('.shopSold').html('已售'+datas.show_sell_count+'件');//销量
			//商品详情渲染
			$('.detail').html(datas.description);
			//执行渲染属性函数
			renderProp(datas);
		}
	}
/***********************普通商品结束****************************/

	/*
	 * 初始化轮播组件函数：starmySwiper
	 */
	function starSwiper(){
		//初始化轮播组件
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: true,//可选选项，自动滑动
		})
	}
	
	//评价
	mui('.shopDetail').on('tap','.gocomment',function(){
		mui.openWindow({
			url:'comment.html?pid='+shopId
		})
	});
	//头部返回键
	mui('.top-img').on('tap','.goBack',function(){
		mui.back();
	})
	//头部分享
	mui('.top-img').on('tap','.share',function(){
		console.log('你点击了分享');
	})
	//选属性
	mui(document.body).on('tap','.model-select',function(){
		let check = false;//判断是否可以提交数据（属性是否选择）
		//添加选中样式
		$(this).addClass('model-active').siblings().removeClass('model-active');
		//获取点击属性id
		let id = this.getAttribute('data-id');
//		console.log('获取商品属性ID：'+id);
		//获取商品index
		let index = this.getAttribute('data-index');
//		console.log('获取商品属性位置：'+index);
		//获取属性id丢入数组
		PropertyArr[index].id = id;
		console.log('属性数组'+JSON.stringify(PropertyArr));
		check = checkPropertyArr(PropertyArr);//判断属性是否全选
		if(check){//属性全选
			if(type != 1){//非拼团
				//获取详情属性数组
				let data = product_detail[0].productPrices;
				//查找对应的价格进行渲染,并获取对应属性id（提交数据使用）。
				product_prices_id = getProductPricesId(data,PropertyArr);
			}else{//拼团
				//获取详情属性数组
				let data = product_detail.product_prices;
				console.log('data');
				console.log(JSON.stringify(data));
				//查找对应的价格进行渲染,并获取对应属性id（提交数据使用）。
//				product_prices_id = getProductPricesId(data,PropertyArr);
			}
			
		}
	});
	
	//底部结算按钮
	var shopStatus;//判断普通，限时抢购商品变量。0购物车，1立即购买
	mui('.foot').on('tap','.mui-btn',function(){
		//防止事件冒泡
		event.stopPropagation();
		let token = isToken();
		if(token){
			mui("#picture").popover('toggle');//这是可以用来关闭底部弹窗的事件
			shopStatus = this.getAttribute('data-type');
			//普通商品购买
			if(type == 0){
				console.log('普通商品');
				//购物车
				if(shopStatus == 0){
					console.log('购物车');
				}
				//立即购买
				else if(shopStatus == 1){
					console.log('立即购买');
				}
			}
			//限时抢购商品购买
			else if(type == 2){
				console.log('限时抢购');
			}
		}else{
			console.log(token);
		}
	})
	//加载中按钮
	mui('.model').on('tap', '.mui-btn-primary', function(e) {
		if(type){//不是拼团
			let check = false;//判断是否可以提交数据（属性是否选择）
			const proList = {};
			let rcount = $('.mui-numbox-input').val();//商品数量
			for(let i=0;i<PropertyArr.length;i++){
				if(PropertyArr[i].id == -1){
					check = false;
					mui.alert('请选择'+PropertyArr[i].name);
					return;
				}
				else{
					check = true;
					if(type != 1){
						proList.pid = product_detail[0].id;//商品id
						proList.product_prices_id = product_prices_id;//属性商品id
						proList.rcount = rcount;//商品数量
						proList.supply_id = product_detail[0].is_supply_id;//店铺id
						console.log('提交数据：'+JSON.stringify(proList));
					}else{
						proList.pid = product_detail[0].id;//商品id
						proList.product_prices_id = product_prices_id;//属性商品id
						proList.rcount = rcount;//商品数量
						proList.supply_id = product_detail[0].is_supply_id;//店铺id
						console.log('提交数据：'+JSON.stringify(proList));
					}
					
					
				}
			}
			if(check){
				if(type != 1){
					//普通商品购买
					console.log('普通商品购买');
					if(shopStatus == 0){//购物车
						console.log('购物车');
					}
					else if(shopStatus == 1){//立即购买
						console.log('立即购买');
						encryptData('QLproList',proList);
						mui.openWindow({
							url:'confirmOrder.html'
						})
	//					prevInfo(proList);//提交订单预览数据
					}
				}
				if(type == 1){
					//拼团购买
					console.log(GroupStatus);
					if(GroupStatus == 1){
						//单人购买
						encryptData('QLproList',proList);
						mui.openWindow({
							url:'confirmOrder.html'
						})
					}
					else if(GroupStatus == 2){
						//多人购买
						encryptData('QLproList',proList);
						mui.openWindow({
							url:'confirmOrder.html'
						})
					}
				}
				mui(this).button('loading');
				setTimeout(function() {
					mui(this).button('reset');
					mui("#picture").popover('toggle');//这是可以用来关闭底部弹窗的事件
				}.bind(this), 1000);
			}
		}else{//拼团
			
		}
	});
	/*
	 * 渲染(普通，限时商品)属性函数：renderProp
	 * data:商品属性数据
	 */
	function renderProp(data){
		//属性渲染
		let model = `
			<div class="model-img"><img src="${data.default_imgurl}" alt=""></div>
			<div class="model-data">
				<div class="price">￥${data.now_price}<span>起</span><span class="prime">￥${data.orgin_price}</span></div>
				<div class="stock">库存${data.storenum}件</div>
			</div>
		`
		$('.model-top').append(model);
//			console.log('属性'); 
//			console.log(data.product_spec.length);
		mui.each(data.product_spec,function(index,item){
//				console.log(JSON.stringify(item));
			let html = `
				<div class="model-row">
					<p>${item.name}</p>
					<ul>`;
				mui.each(item.children,function(inde,it){
					if(it.disable == 0){
						html+=`<li class="model-select" data-index="${index}" data-id="${it.id}">${it.name}</li><!--model-active-->`;
					}
					else if(it.disable == 1){
						html+=`<li class="model-no">${it.name}</li><!--model-active-->`;
					}
				})
				html+=`</ul>
					</div>`;
			$('.model-list').append(html);
		})
	}
	/*
	 * 判断属性是否全选函数：check
	 * PropertyArr:自定义属性数组
	 */
	function checkPropertyArr(PropertyArr){
		let check;
		for(let i=0;i<PropertyArr.length;i++){
			if(PropertyArr[i].id == -1){
				check = false;
			}else{
				check = true;
			}
		}
		return check;
	}
	/*
	 * 属性(普通，限时商品)数组长度渲染函数：getPropertyArrLength
	 * data: 属性数据
	 * arr: 属性数组
	 */
	function getPropertyArrLength(data,arr){
		if(data.length > 0){
			for(let i = 0;i<data.length;i++){
				let obj = {};
				obj.id = -1;
				obj.name = data[i].name;
				arr.push(obj);
			}
		}
		return arr;
	}
	/*
	 * 获取结算商品属性id函数:getProductPricesId
	 * data:商品详情属性数组
	 * PropertyArr：自定义属性数组
	 */
	function getProductPricesId(data,PropertyArr){
		let product_prices_id;
		//拼接全选后属性id，获取属性数组的价格
		for(let i=0;i<PropertyArr.length;i++){
			if(i == 0){
				product_prices_id = PropertyArr[i].id;
			}else{
				product_prices_id = product_prices_id+'_'+PropertyArr[i].id;
			}
		}
		//判断如果自定义的商品属性拼接的id和详情属性id匹配，渲染新的价格
		for(let i=0;i<data.length;i++){
			if(product_prices_id == data[i].proids){
				product_prices_id = data[i].pid;
				let html = `
					<div class="price">￥${data[i].now_price}<span>起</span><span class="prime">￥${data[i].orgin_price}</span></div>
					<div class="stock">库存${data[i].storenum}件</div>
				`
				$('.model-data').html(html);
			}
		}
		console.log('获取商品属性id:'+product_prices_id );
		return product_prices_id;
	}
	function isToken(){
		//获取token
		let token = localStorage.getItem('Token');
		if(token){
			return token;
		}else{
			token = false;
			let btnArray = ['否', '是'];
			mui.confirm('您未登录，是否前往登录？','提示',btnArray,function(e){
				if (e.index == 1) {
					mui.openWindow({
						url:'../login.html'
					})
				} else {
					console.log('用户点击了取消');
				}
			})
			return token;
		}
	}