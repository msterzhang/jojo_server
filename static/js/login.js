const login = document.getElementById("login");
if (login != null) {
    const { createApp, onMounted, ref } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const form = ref({
                "user_email": null,
                "user_pwd": null,
            })
            const error = ref(null);

            function UserLogin() {
                fetch("/v1/api/user/login", {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': Cookies.get("Authorization")
                    },
                    body: JSON.stringify(form.value)
                })
                    .then(res => {
                        if (!res.ok) {
                            const error = new Error(res.statusText);
                            error.json = res.json();
                            throw error;
                        }
                        return res.json();
                    })
                    .then(json => {
                        if (json.code == 200) {
                            Snackbar.show({ pos: 'top-center', text: "登录成功,正在前往主页!", showAction: false });
                            Cookies.set('Authorization', json.data, { expires: 7 })
                            setTimeout(function () {
                                window.location.href = "/webmaster"
                            }, 1000)
                        } else {
                            Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        }
                    })
                    .catch(err => {
                        error.value = err;
                        if (err.json) {
                            return err.json.then(json => {
                                error.value.message = json.message;
                            });
                        }
                    })
            }

            const login = async () => {
                UserLogin();
            };

            return {
                form,
                login,
            }
        },
        methods: {

        }
    });
    app.mount('#login')
}
