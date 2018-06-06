
window.onload = function () {
    var list = document.getElementById('list');
    var boxs = list.children;
    var timer;

    //格式化日期
    function formateDate(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mi = date.getMinutes();
        m = m > 9 ? m : '0' + m;
        return y + '-' + m + '-' + d + ' ' + h + ':' + mi;
    }

    //删除节点
    function removeNode(node) {
        node.parentNode.removeChild(node);
    }

    /**
     * 赞分享
     * @param box 每个分享的div容器
     * @param el 点击的元素
     */
    function praiseBox(box, el) {
        var txt = el.innerHTML;
        var praisesTotal = box.getElementsByClassName('praises-total')[0];
        var oldTotal = parseInt(praisesTotal.getAttribute('total'));
        var newTotal;
        if (txt == 'Like') {
            newTotal = oldTotal + 1;
            praisesTotal.setAttribute('total', newTotal);
            praisesTotal.innerHTML = (newTotal == 1) ? 'I like it' : 'Me and ' + oldTotal + ' people like it';
            el.innerHTML = 'Cancel';
        }
        else {
            newTotal = oldTotal - 1;
            praisesTotal.setAttribute('total', newTotal);
            praisesTotal.innerHTML = (newTotal == 0) ? '' : newTotal + ' people like it';
            el.innerHTML = 'Like';
        }
        praisesTotal.style.display = (newTotal == 0) ? 'none' : 'block';
    }

    /**
     * 发评论
     * @param box 每个分享的div容器
     * @param el 点击的元素
     */
    function reply(box, el) {
        var commentList = box.getElementsByClassName('comment-list')[0];
        var textarea = box.getElementsByClassName('comment')[0];
        var commentBox = document.createElement('div');
        commentBox.className = 'comment-box clearfix';
        commentBox.setAttribute('user', 'self');
        commentBox.innerHTML =
            '<img class="myhead" src="images/my.jpg" alt=""/>' +
                '<div class="comment-content">' +
                '<p class="comment-text"><span class="user">Me：</span>' + textarea.value + '</p>' +
                '<p class="comment-time">' +
                formateDate(new Date()) +
                '<a href="javascript:;" class="comment-praise" total="0" my="0" style="">Like</a>' +
                '<a href="javascript:;" class="comment-operate">Delete</a>' +
                '</p>' +
                '</div>'
        commentList.appendChild(commentBox);
        textarea.value = '';
        textarea.onblur();
    }

    /**
     * 赞回复
     * @param el 点击的元素
     */
    function praiseReply(el) {
        var myPraise = parseInt(el.getAttribute('my'));
        var oldTotal = parseInt(el.getAttribute('total'));
        var newTotal;
        if (myPraise == 0) {
            newTotal = oldTotal + 1;
            el.setAttribute('total', newTotal);
            el.setAttribute('my', 1);
            el.innerHTML = newTotal + 'Cancel';
        }
        else {
            newTotal = oldTotal - 1;
            el.setAttribute('total', newTotal);
            el.setAttribute('my', 0);
            el.innerHTML = (newTotal == 0) ? 'Like' : newTotal + ' Like';
        }
        el.style.display = (newTotal == 0) ? '' : 'inline-block'
    }

    /**
     * 操作留言
     * @param el 点击的元素
     */
    function operate(el) {
        var commentBox = el.parentNode.parentNode.parentNode;
        var box = commentBox.parentNode.parentNode.parentNode;
        var txt = el.innerHTML;
        var user = commentBox.getElementsByClassName('user')[0].innerHTML;
        var textarea = box.getElementsByClassName('comment')[0];
        if (txt == 'Reply') {
            textarea.focus();
            textarea.value = 'Reply' + user;
            textarea.onkeyup();
        }
        else {
            removeNode(commentBox);
        }
    }

    //把事件代理到每条分享div容器
    for (var i = 0; i < boxs.length; i++) {

        //点击
        boxs[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            switch (el.className) {

                //关闭分享
                case 'close':
                    removeNode(el.parentNode);
                    break;

                //赞分享
                case 'praise':
                    praiseBox(el.parentNode.parentNode.parentNode, el);
                    break;

                //回复按钮蓝
                case 'btn':
                    reply(el.parentNode.parentNode.parentNode, el);
                    break

                //回复按钮灰
                case 'btn btn-off':
                    clearTimeout(timer);
                    break;

                //赞留言
                case 'comment-praise':
                    praiseReply(el);
                    break;

                //操作留言
                case 'comment-operate':
                    operate(el);
                    break;
            }
        }

        //评论
        var textArea = boxs[i].getElementsByClassName('comment')[0];

        //评论获取焦点
        textArea.onfocus = function () {
            this.parentNode.className = 'text-box text-box-on';
            this.value = this.value == 'comment…' ? '' : this.value;
            this.onkeyup();
        }

        //评论失去焦点
        textArea.onblur = function () {
            var me = this;
            var val = me.value;
            if (val == '') {
                timer = setTimeout(function () {
                    me.value = 'comment…';
                    me.parentNode.className = 'text-box';
                }, 200);
            }
        }

        //评论按键事件
        textArea.onkeyup = function () {
            var val = this.value;
            var len = val.length;
            var els = this.parentNode.children;
            var btn = els[1];
            var word = els[2];
            if (len <=0 || len > 140) {
                btn.className = 'btn btn-off';
            }
            else {
                btn.className = 'btn';
            }
            word.innerHTML = len + '/140';
        }

    }
}