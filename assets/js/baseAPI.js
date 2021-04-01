// 每次发起$.get/$.post/$.ajax请求时，
//都会自动调用ajaxPrefilter这个函数，在这个函数中我们可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url)
})