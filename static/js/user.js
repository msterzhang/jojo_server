const user = document.getElementById("user");
if (user != null) {
    const { createApp, onMounted, onUpdated, ref } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const form = ref({
                "user_email": null,
                "user_pwd": null,
                "api_key": null,
                "cdn_host": null,
                "allow_from_urls": null,
                "limit": null,
                "hls_time": null,
                "file_types": null,
                "plyr_poster": null,
                "gpu": null,
                "add_name": null,
                "encryption": null,
                "encryption_ts": null,
                "is_ansn": null,
                "is_delete": null
            })

            const error = ref(null);
            const key_number = ref(null);
            const data = ref(null);
            const user = ref(null);
            const pay = ref(null);
            const regModal = ref(null);
            const root_api = ref(null);
            const modalOptions = {
                closable: false,
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40'
            }

            function InitTab() {
                const tabElements = [
                    {
                        id: 'wx',
                        triggerEl: document.querySelector('#wx-tab'),
                        targetEl: document.querySelector('#wx')
                    },
                    {
                        id: 'zfb',
                        triggerEl: document.querySelector('#zfb-tab'),
                        targetEl: document.querySelector('#zfb')
                    }
                ];
                const options = {
                    defaultTabId: 'wx',
                    activeClasses: 'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500',
                    inactiveClasses: 'text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
                    onShow: () => {
                        // console.log('tab is shown');
                    }
                };
                const tabs = new Tabs(tabElements, options);
                tabs.show('wx');
            }

            onUpdated(() => {
                const regElement = document.querySelector('#reg-user-modal');
                regModal.value = new Modal(regElement, modalOptions);
            })

            function fetchData() {
                fetch(`/v1/api/config/data`, {
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
                            user.value = json.user;
                            form.value = json.data;
                            fetchPay();
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

            function fetchPay() {
                fetch(`/v1/api/setting/pay`, {
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
                            pay.value = json.data;
                            root_api.value = json.root_api;
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
                fetch("/v1/api/config/save", {
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
                            Snackbar.show({ pos: 'top-center', text: "保存成功,修改切片时间、是否采用GPU及是否删除本地文件需要重新下载配置文件,手动替换客户端中文件,并重启才能生效!", showAction: false });
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

            function RegUser() {
                if (key_number.value == null) {
                    Snackbar.show({ pos: 'top-center', text: "单号后8位不能为空!", showAction: false });
                    return
                }
                if (key_number.value.length != 8) {
                    Snackbar.show({ pos: 'top-center', text: "单号不正确!", showAction: false });
                    return
                }
                if (!/^\d+$/.test(key_number.value)) {
                    Snackbar.show({ pos: 'top-center', text: "单号不正确!", showAction: false });
                    return
                }
                fetch(`/v1/api/user/client/reg?user_id=${user.value.user_id}&key_number=${key_number.value}`, {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': Cookies.get("Authorization")
                    },
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
                        Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        if (json.code == 200) {
                            regModal.value.hide();
                            OpacityHide();
                            fetchData();
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

            function OpacityHide() {
                const opacity = document.querySelector(".bg-opacity-50");
                if (opacity != null) {
                    opacity.remove();
                }
            }


            const save = async () => {
                SaveConfig();
            };
            const reg = async () => {
                RegUser();
            };
            const opacityHide = async () => {
                OpacityHide();
            }
            const initTab = async () => {
                InitTab();
            }


            onMounted(() => {
                fetchData();
            });
            return {
                data,
                opacityHide,
                key_number,
                user,
                root_api,
                form,
                save,
                reg,
                initTab,
                regModal,
                pay
            }
        },
        methods: {
            showReg() {
                this.regModal.show();
                this.initTab()
            },
            copyShareLink() {
                let shareLink = this.root_api + "/sigin?share_id=" + this.user.share_id;
                navigator.clipboard.writeText(shareLink).then(
                    () => {
                        Snackbar.show({ pos: 'top-center', text: "已复制到剪贴板!", showAction: false });
                    },
                    () => {
                        Snackbar.show({ pos: 'top-center', text: "复制到剪贴板失败!", showAction: false });
                    },
                );
            }
        }
    });
    app.mount('#user')
}
