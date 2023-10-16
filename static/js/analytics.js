const analytics = document.getElementById("analytics");
if (analytics != null) {
    const { createApp, onMounted, ref, onUpdated } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const msg = ref(null);
            const isref = ref(false);
            const q = ref(null);
            const data = ref(null);
            const user = ref(null);
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
                const addElement = document.querySelector('#add-analytic-modal');
                const editElement = document.querySelector('#edit-analytic-modal');
                const deleteElement = document.querySelector('#delete-analytic-modal');
                const deleteAllElement = document.querySelector('#delete-all-analytic-modal');
                addModal.value = new Modal(addElement, modalOptions);
                editModal.value = new Modal(editElement, modalOptions);
                deleteModal.value = new Modal(deleteElement, modalOptions);
                deleteAllModal.value = new Modal(deleteAllElement, modalOptions);
            })


            const form = ref({
                "ID": null,
                "CreatedAt": null,
                "UpdatedAt": null,
                "DeletedAt": null,
                "time_key": null,
                "user_id": null,
                "day_add_file": null,
                "file_num": null,
                "file_is_up": null,
                "file_up_number": null,
                "view_num": null,
                "day_view_file": null,
                "view_is_up": null,
                "view_up_number": null,
                "user_num": null,
                "day_user_number": null,
                "day_reg_num": null,
                "reg_is_up": null,
                "reg_up_number": null,
                "drive_num": null
            })

            function OpacityHide() {
                const opacity = document.querySelector(".bg-opacity-50");
                if (opacity != null) {
                    opacity.remove();
                }
            }

            function fetchData() {
                fetch(`/v1/api/analytic/list?page=${page.value}&size=${size.value}`, {
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

            function SearchAnalytic() {
                if (q.value == null) {
                    Snackbar.show({ pos: 'top-center', text: "搜索关键词不能为空", showAction: false });
                    return
                }
                fetch(`/v1/api/analytic/search?q=${q.value}&page=${page.value}&size=${size.value}`, {
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

            function CreateAnalytic() {
                let api = "/v1/api/analytic/create";
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


            function UpdateAnalytic() {
                let api = "/v1/api/analytic/update?id=" + form.value.ID;
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

            function DeleteAnalytic() {
                let api = "/v1/api/analytic/delete?id=" + form.value.ID;
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

            function GetUser() {
                let api = "/v1/api/user/userid?user_id=" + form.value.user_id;
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
                        if (json.code == 200) {
                            user.value = json.data;
                            editModal.value.show();
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


            onMounted(() => {
                fetchData();
            });

            const reF = async () => {
                isref.value = true;
                fetchData();
            };
            const create = async () => {
                CreateAnalytic();
            };
            const update = async () => {
                UpdateAnalytic();
            };

            const deleter = async () => {
                DeleteAnalytic();
            };

            const gu = async () => {
                GetUser();
            };

            const search = async () => {
                SearchAnalytic();
            };

            const opacityHide = async () => {
                OpacityHide();
            }

            return {
                msg,
                q,
                data,
                user,
                form,
                page,
                size,
                num,
                limt,
                reF,
                create,
                update,
                deleter,
                gu,
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
            editAnalytic(analytic) {
                this.form = analytic;
                this.gu();
            },
            deleteAnalytic(analytic) {
                this.form = analytic;
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
    app.mount('#analytics')
}
