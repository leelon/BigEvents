$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击“去登录”的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 自定义校验规则
  let form = layui.form
  let layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义 pwd 密码校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 确认密码的 校验规则
    repwd: function (value) {
      // 选择类名为reg-box元素 包裹的 name属性为password
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 发起注册请求
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()

    $.post('/api/reguser', {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }, function (res) {
      if (res.status !== 0) return layer.msg(res.message);

      layer.msg(res.message);
      $('#link_login').click()
    })
  })

  // 发起登录请求
  $('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) return layer.msg('登录失败！')

        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})