$(function() {
    getUserInfo()
    var layer = layui.layer
        // 实现退出功能
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token')
            location.href = '../login.html'
            layer.close(index);
        });
    })

})

function getUserInfo() {
    $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 请求头配置对象
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('获取用户消息失败！')
                    }
                    // 渲染用户头像
                    renderAventar(res.data)
                }
                // 不管ajax请求是否成功，都会调用complete回调函数
                /* complete: function(res) {
                    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                        // 强制清空token
                        localStorage.removeItem('token')
                            // 强制跳转到登录页面
                        location.href = '../login.html'
                    }
                } */
        })
        // 渲染用户头像
    function renderAventar(user) {
        // 获取用户名称
        var name = user.nickname || user.username
            // 设置欢迎文本
        $('.welcom').html('欢迎&nbsp;&nbsp;' + name)
            // 按需渲染头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        }
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}