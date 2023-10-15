const settings = document.getElementById("settings");
if (settings != null) {
    const { createApp, onMounted, onUpdated, ref } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const form = ref({
                "web_title": null,
                "app_version": null,
                "app_url": null,
                "test_url": null,
                "is_open": null,
                "is_reg": null,
                "email": null,
                "qun": null,
                "tg_qun": null,
                "pay_number": null,
                "wx_pay_image": null,
                "zfb_pay_image": null,
                "port": null,
                "address": null,
                "smtp_email": null,
                "smtp_password": null,
                "content": null,
                "pay_msg": null
            })

            const error = ref(null);
            const key_number = ref(null);
            const data = ref(null);
            const user = ref(null);
            const regModal = ref(null);
            const modalOptions = {
                closable: false,
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40'
            }
            onUpdated(() => {
                const regElement = document.querySelector('#reg-user-modal');
                regModal.value = new Modal(regElement, modalOptions);
            })

            function fetchData() {
                fetch(`/v1/api/setting/data`, {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': Cookies.get("Authorization")
                    }
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
                            data.value = json.data;
                            form.value = json.data;
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

            function SaveConfig() {
                form.value.pay_number = parseInt(form.value.pay_number);
                fetch("/v1/api/setting/save", {
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
                            Snackbar.show({ pos: 'top-center', text: "保存成功!", showAction: false });
                            fetchData();
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

            function SendEmail() {
                fetch("/v1/api/setting/email?email=" + form.value.email, {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': Cookies.get("Authorization")
                    },
                }).then(res => {
                    if (!res.ok) {
                        const error = new Error(res.statusText);
                        error.json = res.json();
                        throw error;
                    }
                    return res.json();
                })
                    .then(json => {
                        Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
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

            function OpacityHide() {
                const opacity = document.querySelector(".bg-opacity-50");
                if (opacity != null) {
                    opacity.remove();
                }
            }
            const save = async () => {
                SaveConfig();
            };
            const send = async () => {
                SendEmail();
            };
            const opacityHide = async () => {
                OpacityHide();
            }

            onMounted(() => {
                fetchData();
            });
            return {
                data,
                opacityHide,
                key_number,
                user,
                form,
                save,
                send,
                regModal
            }
        },
        methods: {

        }
    });
    app.mount('#settings')
}
