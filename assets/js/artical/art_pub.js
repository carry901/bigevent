$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 初始化富文本编辑器
    initEditor()
        // 定义初始化文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //一定要记得调用form.render(),否则layui识别不出数据
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 给选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })
    $('#coverFile').on('change', function(e) {
            // 获取到文件的列表数组
            var files = e.target.files
            if (files.length === 0) {
                return layer.msg('请选择图片')
            }
            // 根据文件，创建对应的URL地址
            var newImgURL = URL.createObjectURL(files[0])
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义发布状态，默认是已发布
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            // 基于form表单快速创建formData对象， 原生js
        var fd = new FormData($(this)[0])
            // 将文章的发布状态存到fd中
        fd.append('state', art_state)
            /* fd.forEach(function(v, k) {
                console.log(k, v)
            }) */
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob) // 得到文件对象后，进行后续的操作
                publishArtical(fd)
            })
    })

    function publishArtical(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是Formdata格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '../../artical/art_list.html'
            }
        })
    }
})