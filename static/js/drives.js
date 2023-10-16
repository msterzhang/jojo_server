// drives 加载盘
const drives = document.getElementById("drives");
if (drives != null) {
    const { createApp, onMounted, ref, onUpdated } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const msg = ref(null);
            const q = ref(null);
            const isref = ref(false);
            const data = ref(null);
            const error = ref(null);
            const checkedItmes = ref([]);
            const page = ref(1);
            const size = ref(12);
            const num = ref(null);
            const limt = ref(null);
            const addModal = ref(null);
            const editModal = ref(null);
            const deleteModal = ref(null);
            const deleteAllModal = ref(null);
            const modalOptions = {
                closable: false,
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40'
            }
            onUpdated(() => {
                const addElement = document.querySelector('#add-drive-modal');
                const editElement = document.querySelector('#edit-drive-modal');
                const deleteElement = document.querySelector('#delete-drive-modal');
                const deleteAllElement = document.querySelector('#delete-all-drive-modal');
                addModal.value = new Modal(addElement, modalOptions);
                editModal.value = new Modal(editElement, modalOptions);
                deleteModal.value = new Modal(deleteElement, modalOptions);
                deleteAllModal.value = new Modal(deleteAllElement, modalOptions);
            })


            const form = ref({
                "ID": null,
                "name": null,
                "root": null,
                "uuid": null,
                "user_name": null,
                "drive_id": null,
                "uid": "",
                "phone": null,
                "avatar": null,
                "pass_word": null,
                "nick_name": null,
                "access_token": null,
                "refresh_token": null,
                "cookie": null,
                "total_size": null,
                "used_size": null,
                "proportion": null,
                "status": null,
                "vip_identity": null,
                "is_ok": null,
                "is_active": null,
                "msg": null,
                "ali_watch_path": null,
                "ali_success_path": null,
                "ali_m3u8_path": null,
                "ali_tv_m3u8_path": null,
                "ali_ts_path": null,
                "ali_tv_ts_path": null
            })
            function OpacityHide() {
                const opacity = document.querySelector(".bg-opacity-50");
                if (opacity != null) {
                    opacity.remove();
                }
            }

            function fetchData() {
                fetch(`/v1/api/drive/admin/list?page=${page.value}&size=${size.value}`, {
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
                            num.value = json.num;
                            let rigth = page.value * size.value;
                            if (rigth >= num.value) {
                                rigth = num.value
                            }
                            limt.value = (page.value - 1) * size.value + "-" + rigth;
                            if (isref.value) {
                                Snackbar.show({ pos: 'top-center', text: "刷新成功!", showAction: false });
                            }
                        } else {
                            Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        }
                        isref.value = false;
                    })
                    .catch(err => {
                        error.value = err;
                        if (err.json) {
                            return err.json.then(json => {
                                error.value.message = json.message;
                            });
                        }
                    }).then(
                        () => {
                            checkedItmes.value = [];
                        }
                    )
            }

            function SearchDrive() {
                if (q.value == null) {
                    Snackbar.show({ pos: 'top-center', text: "搜索关键词不能为空", showAction: false });
                    return
                }
                fetch(`/v1/api/drive/search?q=${q.value}&page=${page.value}&size=${size.value}`, {
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
                            num.value = json.num;
                            let rigth = page.value * size.value;
                            if (rigth >= num.value) {
                                rigth = num.value
                            }
                            limt.value = (page.value - 1) * size.value + "-" + rigth;
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
                    }).then(
                        () => {
                            checkedItmes.value = [];
                        }
                    )
            }

            function CreateDrive() {
                let api = "/v1/api/drive/create";
                fetch(api, {
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
                        fetchData();
                        Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        addModal.value.hide();
                        opacityHide();
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


            function UpdateDrive() {
                let api = "/v1/api/drive/driveid/update?driveid=" + form.value.ID;
                fetch(api, {
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
                        fetchData();
                        Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        editModal.value.hide();
                        opacityHide();
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

            function DeleteDrive() {
                let api = "/v1/api/drive/driveid/delete?driveid=" + form.value.drive_id;
                fetch(api, {
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
                        fetchData();
                        Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        deleteModal.value.hide();
                        deleteAllModal.value.hide();
                        opacityHide();
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

            onMounted(() => {
                fetchData();
            });

            const reF = async () => {
                isref.value = true;
                fetchData();
            };
            const create = async () => {
                CreateDrive();
            };
            const update = async () => {
                UpdateDrive();
            };

            const deleter = async () => {
                DeleteDrive();
            };

            const search = async () => {
                SearchDrive();
            };

            const opacityHide = async () => {
                OpacityHide();
            }

            return {
                msg,
                q,
                data,
                form,
                page,
                size,
                num,
                limt,
                reF,
                create,
                update,
                deleter,
                search,
                opacityHide,
                addModal,
                editModal,
                deleteModal,
                deleteAllModal,
                checkedItmes
            }
        },
        methods: {
            FormatFileSize(fileSize) {
                if (fileSize < 1024) {
                    return fileSize + 'B';
                } else if (fileSize < (1024 * 1024)) {
                    var temp = fileSize / 1024;
                    temp = temp.toFixed(2);
                    return temp + 'KB';
                } else if (fileSize < (1024 * 1024 * 1024)) {
                    var temp = fileSize / (1024 * 1024);
                    temp = temp.toFixed(2);
                    return temp + 'MB';
                } else if (fileSize < (1024 * 1024 * 1024 * 1024)) {
                    var temp = fileSize / (1024 * 1024 * 1024);
                    temp = temp.toFixed(2);
                    return temp + 'GB';
                } else {
                    var temp = fileSize / (1024 * 1024 * 1024 * 1024);
                    temp = temp.toFixed(2);
                    return temp + 'TB';
                }
            },
            formatAsDate(time) {
                let date = new Date(time)
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            },
            handleSelectAll() {
                if (this.checkedItmes.length == 0) {
                    this.checkedItmes = this.data;
                } else {
                    this.checkedItmes = [];
                }
            },
            editDrive(drive) {
                this.form = drive;
                this.editModal.show();
            },
            deleteDrive(drive) {
                this.form = drive;
                this.deleteModal.show();
            },
            deleteCheck() {
                this.checkedItmes.forEach(item => {
                    this.form = item;
                    this.deleter();
                });
                this.checkedItmes = [];
            },
            nextPage() {
                this.page++;
                this.reF();
            },
            previousPage() {
                this.page--;
                if (this.page == 0) {
                    this.page = 1;
                }
                this.reF();
            }
        }
    });
    app.mount('#drives')
}
