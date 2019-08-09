(function($){
	function preLoad(imgs,options){
		this.imgs = (typeof imgs === "string") ? [imgs] : imgs;  //穿入imgs参数是图片 还是数组
		this.opts = $.extend({}, preLoad.DEFAULTS, options);		//将默认的和传入的参数合并
		if(this.opts.order == 'ordered'){
			this._ordered();
		}else{
			this._unordered();
		}
	}
	
	preLoad.DEFAULTS = {
		order: 'unordered', //默认无序加载
		each: null,	//每一张图片加载完成后执行
		all: null  	//所有图片加载完成后执行
	}
	// 有序加载
	preLoad.prototype._ordered = function(){
		var imgs = this.imgs;
		var opts = this.opts;
		var count = 0;
		var len = imgs.length;
		load();
		function load(){
			var imgObj = new Image();
			$(imgObj).on('load error',function(){
				opts.each && opts.each(count);
				if(count >= len){
					//所有图片执行完成
					opts.all && opts.all();
				}else{
					load();
				}
				count++;
			});
			imgObj.src = imgs[count];
		}
	}
	// 无序加载
	preLoad.prototype._unordered = function(){
		var imgs = this.imgs;
		var opts = this.opts;
		var count = 0;
		var len = imgs.length;
		
		$.each(imgs,function(i,src){
			if(typeof src != "string"){	//判断是否是src，若不是直接退出，不往下执行，否则会出错
				return;
			}
			
			var imgObj = new Image();
			$(imgObj).on('load error',function(){	//监听load和error事件
				opts.each && opts.each(count);		//先判断each是否存在，若存在则执行此方法；
				if(count >= len-1){
					opts.all && opts.all();
				}
				count ++;					
			});
			imgObj.src = src;
		});
	};
	
	$.extend({
		preload: function(imgs, opts){
			new preLoad(imgs, opts);
		}
	});
	
})(jQuery)
