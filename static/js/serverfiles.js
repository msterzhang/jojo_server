// serverfiles 加载盘
const serverfiles = document.getElementById("serverfiles");
if (serverfiles != null) {
    const { createApp, onMounted, ref, onUpdated } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const msg = ref(null);
            const q = ref(null);
            const copyContent = ref(null);
            const isSearch = ref(false);
            const addName = ref(false);
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
                const addElement = document.querySelector('#add-serverfile-modal');
                const editElement = document.querySelector('#edit-serverfile-modal');
                const deleteElement = document.querySelector('#delete-serverfile-modal');
                const deleteAllElement = document.querySelector('#delete-all-serverfile-modal');
                addModal.value = new Modal(addElement, modalOptions);
                editModal.value = new Modal(editElement, modalOptions);
                deleteModal.value = new Modal(deleteElement, modalOptions);
                deleteAllModal.value = new Modal(deleteAllElement, modalOptions);
            })


            const form = ref({
                "ID": null,
                "file_name": null,
                "file_hash": null,
                "url": null,
                "drive_id": null,
                "parent_id": null,
                "num": null,
                "speed": null,
                "is_ok": null
            })

            function OpacityHide() {
                const opacity = document.querySelector(".bg-opacity-50");
                if (opacity != null) {
                    opacity.remove();
                }
            }

            function fetchData() {
                fetch(`/v1/api/serverfile/list?page=${page.value}&size=${size.value}`, {
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
                            if (data.value != null) {
                                Snackbar.show({ pos: 'top-center', text: "刷新成功!", showAction: false });
                            }
                            data.value = json.data;
                            addName.value = json.add_name;
                            num.value = json.num;
                            let rigth = page.value * size.value;
                            if (rigth >= num.value) {
                                rigth = num.value
                            }
                            isSearch.value = false;
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

            function StorName(data) {
                data.sort((a, b) => {
                    if (a.file_name < b.file_name) {
                        return -1;
                    }
                    if (a.file_name > b.file_name) {
                        return 1;
                    }
                    return 0;
                })
                return data
            }


            function SearchDrive() {
                if (q.value == null) {
                    Snackbar.show({ pos: 'top-center', text: "搜索关键词不能为空", showAction: false });
                    return
                }
                isSearch.value = true;
                fetch(`/v1/api/serverfile/search?q=${q.value}&page=${page.value}&size=4000`, {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': Cookies.get("Authorization")
                    }
                }).then(res => {
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
                            data.value = StorName(data.value)
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
                let api = "/v1/api/serverfile/create";
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
                let api = "/v1/api/serverfile/update?id=" + form.value.ID;
                form.value.speed = parseInt(form.value.speed);
                form.value.num = parseInt(form.value.num);
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
                let api = "/v1/api/serverfile/delete?id=" + form.value.ID;
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
                addName,
                copyContent,
                isSearch,
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
            editDrive(serverfile) {
                this.form = serverfile;
                this.editModal.show();
            },
            deleteDrive(serverfile) {
                this.form = serverfile;
                this.deleteModal.show();
            },
            deleteCheck() {
                this.checkedItmes.forEach(item => {
                    this.form = item;
                    this.deleter();
                });
                this.checkedItmes = [];
            },
            copyFile(item) {
                this.copyContent = window.location.origin + "/v1/file/path" + item.url;
                if (this.addName) {
                    this.copyContent = item.file_name + "$" + window.location.origin + "/v1/file/path" + item.url;
                }
                navigator.clipboard.writeText(this.copyContent).then(
                    () => {
                        Snackbar.show({ pos: 'top-center', text: "采集成功,共采集到1个文件!", showAction: false });
                    },
                    () => {
                        Snackbar.show({ pos: 'top-center', text: "采集失败!", showAction: false });
                    },
                );
            },
            copyAllSelect() {
                let itemUrls = [];
                this.checkedItmes.forEach(item => {
                    let dataUrl = window.location.origin + "/v1/file/path" + item.url;
                    if (this.addName) {
                        dataUrl = item.file_name + "$" + window.location.origin + "/v1/file/path" + item.url;
                    }
                    itemUrls.push(dataUrl);
                })
                this.copyContent = "";
                this.copyContent = itemUrls.join("\n");
                navigator.clipboard.writeText(this.copyContent).then(
                    () => {
                        Snackbar.show({ pos: 'top-center', text: `采集成功,共采集到${this.checkedItmes.length}个文件!`, showAction: false });
                    },
                    () => {
                        Snackbar.show({ pos: 'top-center', text: "采集失败!", showAction: false });
                    },
                );
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
    app.mount('#serverfiles')
}
