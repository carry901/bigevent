$(function() {
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var layer = layui.layer
    var form = layui.form
        // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
        })
        // 通过事件委托方式给form表单绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加图书类别失败')
                } else {
                    initArtCateList()
                    layer.msg('添加图书类别成功')
                        // 根据索引关闭对应的弹出层
                    layer.close(indexAdd)
                }
            }
        })
    })
    var indexEdit = null
        // 事件委托方式绑定点击事件
    $('tbody').on('click', '#btnEdit', function(e) {
            indexEdit = layer.open({
                    type: 1,
                    area: ['500px', '250px'],
                    title: '修改文章分类',
                    content: $('#dialog-edit').html()
                })
                // 用自定义属性获取Id，获取当前图书类别
            var id = $(this).attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            })
        })
        // 将修改过后的图书类别渲染到页面
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新图书类别失败')
                    }
                    layer.msg('更新图书类别成功')
                    initArtCateList()
                    layer.close(indexEdit)
                }
            })
        })
        //删除图书类别
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除图书类别失败')
                    }
                    layer.msg('删除图书类别成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})