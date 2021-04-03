// 1.1 获取裁剪区域的 DOM 元素
$(function() {
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比,也可设置为4/3或16/9等等
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 给上传图片按钮绑定点击事件
    var layer = layui.layer
    $('#btnChooseImage').on('click', function() {
            $('#file').click()
        })
        // 点击上传按钮替换图片
    $('#file').on('change', function(e) {
        if (e.target.files.length === 0) {
            return layer.msg('请选择图片')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
            // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    $('#btnUpload').on('click', function() {
        // 将裁剪后的图片生成单独的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
            // 调用接口，上传新图片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('上传图片失败！')
                }
                layer.msg('更改图像成功')
                window.parent.getUserInfo()
            }
        })
    })
})