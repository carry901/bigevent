// 每次发起$.get/$.post/$.ajax请求时，
//都会自动调用ajaxPrefilter这个函数，在这个函数中我们可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url)
        // 统一为有权限的接口设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 不管ajax请求是否成功，都会调用complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
                // 强制跳转到登录页面
            location.href = '../大事件项目/login.html'
        }
    }
})