const sigin = document.getElementById("sigin");
if (sigin != null) {
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
                "share_id": null,
            })
            const error = ref(null);
            const code = ref(null);

            onMounted(() => {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const share_id = urlParams.get('share_id')
                if (share_id.length > 0) {
                    form.value.share_id = share_id;
                }
            })

            function CreateUser() {
                fetch("/v1/api/user/sigin?code="+code.value, {
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
                            Snackbar.show({ pos: 'top-center', text: "注册成功,正在前往登录页面!", showAction: false });
                            window.location.href = "/login"
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

            function SendCode() {
                fetch("/v1/api/user/code", {
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
                            Snackbar.show({ pos: 'top-center', text: "发送成功，请到邮箱接收查询!", showAction: false });
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

            const create = async () => {
                CreateUser();
            };
            const send = async () => {
                SendCode();
            };

            return {
                form,
                code,
                create,
                send
            }
        },
        methods: {

        }
    });
    app.mount('#sigin')
}
