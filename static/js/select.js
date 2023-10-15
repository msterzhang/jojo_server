const selectAllCheckbox = document.getElementById('select-all');
const checkboxes = document.querySelectorAll('.checkbox');
let isBtnList = false;

// 全选功能的事件处理函数
function selectAllHandler() {
    checkboxes.forEach((checkbox) => {
        if (selectAllCheckbox.checked) {
            isBtnList = true;
        } else {
            isBtnList = false;
        }
        checkbox.checked = selectAllCheckbox.checked;
    });
    showBtnList();
}

function addAllListener() {
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', selectItem);
    });
}

function selectItem() {
    isBtnList = false;
    for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        if (checkbox.checked) {
            isBtnList = checkbox.checked;
            break;
        }
    }
    showBtnList();
}

function showBtnList() {
    if (isBtnList) {
        let selectNumbers = [];
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                selectNumbers.push(index);
            };
        });
        console.log(selectNumbers);
    }
}

// 添加全选功能的事件监听器
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', selectAllHandler);
    addAllListener()
}

