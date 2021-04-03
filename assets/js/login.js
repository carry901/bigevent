$(function() {
    // 点击去注册链接
    $('#link_reg').on('click', function() {
            $('.login_box').hide()
            $('.reg_box').show()
        })
        // 点击去登录链接
    $('#link_login').on('click', function() {
            $('.reg_box').hide()
            $('.login_box').show()
        })
        // 自定义校验表单规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pwd: [/^[\S]{6,12}$/,
                '密码必须6到12位，且不能出现空格'
            ],
            // 验证密码框与确认密码框的内容一致
            repwd: function(value) {
                var pwd = $('.reg_box [name=password]').val()
                if (pwd !== value) return '两次密码不一致!'
            }
        })
        // 调用接口发起注册用户请求
    $('#form_reg').on('submit', function(e) {
            // 阻止默认提交行为
            e.preventDefault()
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录！')
                $('#link_login').click()
            })
        })
        // 登录请求
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $('#form_login').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                    // 将登陆成功后得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '../index.html'
            }
        })
    })
})