$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，请求数据时，需要将参数对象上传到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示的条数
        cate_id: '', //文章Id
        state: '' //文章状态
    }
    initTable()
    initCate()
        // 获取文章分类列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取图书分类列表失败！')

                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过layui的render方法 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 为表单绑提交事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选项的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // 为查询参数q中对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新数据重新渲染表格的数据
            initTable()
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意， 是 容器ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置默认被选中的页码
            //对页码页面优化
            limits: [2, 3, 5, 7],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 1.分页发生切换时，触发jump回调
            // 2.只要调用laypage.render(),就会触发jump回调
            /* 通过first可判断是由哪种方式触发的jump回调，first为true，则是第二种触发方式，
            first为false，则是第一种触发方式 */
            jump: function(obj, first) {
                q.pagenum = obj.curr //把最新的页码值赋值到q的查询参数对象中
                    // initTable()，若在此处直接调用该函数，则会陷入死循环
                q.pagesize = obj.limit //切换条目数也会触发jump回调
                if (!first) {
                    initTable()
                }

            }
        })
    }
    // 点击删除按钮删除文章
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除图书失败')
                    }
                    layer.msg('删除图书成功！')
                        /* 当前数据删除过后，要判断是否还有数据，
                        如果没有剩余的数据了，要让页码值 - 1
                        再重新调用initTable方法 */
                    if (len === 1) { //len若等于1，证明删除过后页面就没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 //页码值最小为1
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
    })
})