

function LoginOut() {
    Snackbar.show({ pos: 'top-center', text: "注销登录成功!", showAction: false });
    Cookies.remove("Authorization");
    setTimeout(function () {
        window.location.href = "/login"
    }, 1000)
}