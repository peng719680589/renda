// token
var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE1MjkzNjc5ODE3NDYsImV4cCI6MTUyOTk3Mjc4MX0.btNsPJhg97yT9NIQ7Khaix0jhHylZQKxF8pFQhvZN22taa0CUvBCclgJ_eXuVjukj1AnytzXo0HJSFZVyl2U8Q";
//导出excel模板
var locationUrl = "http://192.168.0.117:9000";
function exportDataTelement(){
    window.location.href = locationUrl + "/users/template";
    return false;
}
// 导出用户excel
function exportData(){
    var searchValue =  $("#seacrhInput").val();

    if (searchValue != ''){
        window.location.href = locationUrl + '/users/export?username='+searchValue;
    }else {
        window.location.href = locationUrl + '/users/export';
    }
}
//导入用户excel
function importData() {
    var formdata = new FormData();
    var pic = document.getElementById("daoru").files;
    for(var j=0;j<pic.length;j++){
        formdata.append(""+j+"",pic[j]);
    }
    $.ajax({
        url:"http://192.168.0.117:9000/users/leadingin",
        type:"post",
        cache: false,
        headers: { "Authorization": "Bearer " + token},
        contentType: false,
        processData: false,
        data:formdata,
        success:function (data) {
            console.log(data);
            $('#my-alert').modal({target: '#my-alert'});
            $(".users").html("导入excel");
            $(".alert").html("导入成功");
        },
        error:function (data) {
            $('#my-alert').modal({target: '#my-alert'});
            $(".users").html("导入excel");
            $(".alert").html("导入失败");
        }
    })

}
//获取选中cheacked的id和个数
var userId = "";
var checkedLength = "";
var moreUserid = [];
//获取value值判断是添加还是修改来调用哪个接口
var isAdd = "";
function check(e){

    $.each($('#show input:checkbox:checked'),function(){
        userId = $(this).val();
        moreUserid.push(e);

    });
    checkedLength = $('#show input:checkbox:checked').length;
}
console.log(userId);
//右侧删除
function del(e) {
    var deleteList = [e];
    $.ajax({
        type:"post",
        url:"http://192.168.0.117:9000/users/deletes",
        contentType:"application/json",
        headers: { "Authorization": "Bearer " + token},
        data:JSON.stringify({
            "ids":deleteList
        }),
        success: function (data) {
            if (data.success === true) {
                $(".users").html("删除用户");
                $(".alert").html("删除成功！");
                $('#my-alert').modal({target: '#my-alert'});
                $('#modal1').modal('close');
            }else {

                $(".users").html("删除用户");
                $(".alert").html("删除失败！");
                $('#my-alert').modal({target: '#my-alert'});
                $('#modal1').modal('close');
            }
        },
        error:function (data) {
            alert(data)
        }
    });
}
// 右侧修改
function editor(e){
    $(".newBuild").html("修改用户<input type='hidden' value='1'><a href=\"javascript: void(0)\" class=\"am-close am-close-spin\" data-am-modal-close>&times;</a>");
    $.ajax({
        url:"http://192.168.0.117:9000/users/detail",
        type:"post",
        headers: { "Authorization": "Bearer " + token},
        contentType:"application/json",
        data:JSON.stringify({
            "id":e
        }),
        success:function (data) {
            $("#id").val(data.obj.id);
            $("#username").val(data.obj.username);
            $("#realname").val(data.obj.realname);
            $("#sex").val(data.obj.sex);
            //头像
            var imgSrc =  locationUrl+"/"+data.obj.head_pic;
            $("#touxiang").attr("src",imgSrc);
            $("#organ_name").val(data.obj.organ_id);

                $('#join_date').datepicker('setValue', data.obj.join_dates);
            $("#education").val(data.obj.education);
            $("#nation").val(data.obj.nation);

            $("#birth").datepicker('setValue', data.obj.birth);
            $("#marriage").val(data.obj.marriage);
            $("#origin_addr").val(data.obj.origin_addr);
            $("#card_no").val(data.obj.card_no);
            $("#address").val(data.obj.address);
            $("#family_addr").val(data.obj.family_addr);
            $("#tel").val(data.obj.tel);
            $("#phone").val(data.obj.phone);
            $("#email").val(data.obj.email);
            console.log(data)
        }
    });
}

$(function () {
    // 查询所有单位
    $.ajax({
        type:"post",
        url:"http://192.168.0.117:9000/organ/list",
        contentType:"application/json",
        headers: { "Authorization": "Bearer " + token},
        data:JSON.stringify({
            "pageNum":"1"
        }),
        success: function (data) {
            var organ = data.obj;
            var str2 = "";
            $.each(organ,function (index,value) {
                str2 += "  <option value=\""+value.id+"\">"+value.organ_name+"</option>";
            })
            $("#organ_name").html(str2);
        }
    });
    // 查询学历参数
    $.ajax({
        type:"post",
        url:"http://192.168.0.117:9000/dictionary/list_by_type",
        contentType:"application/json",
        headers: { "Authorization": "Bearer " + token},
        data:JSON.stringify({
            "pageNum":"1",
            "type":"edu"
        }),
        success: function (data) {
            var edu = data.obj;
            var str3 = "";
            $.each(edu,function (index,value) {
                str3 += "  <option value=\""+value.id+"\">"+value.text_+"</option>";
            })
            $("#education").html(str3);
        }
    });
    // 新增中用户照片上传预览
    var pic1 = document.getElementById("head_pic");
    pic1.addEventListener('change',readFile,false);
    function readFile() {
        var reader = new FileReader();
        var file  = this.files[0];
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            base64Code=this.result;
            //把得到的base64赋值到img标签显示
            $("#touxiang").attr("src",base64Code);
        }
    }
    //修改模态框头部文字
    //新建
    $(".buildBtn").click(function () {
        $(".newBuild").html("新建用户<input value='0' type='hidden'><a  href=\"javascript: void(0)\" class=\"am-close am-close-spin\" data-am-modal-close>&times;</a>");
        $("#username").val("");
        $("#realname").val("");
        $("#sex").val("");
        $("#touxiang").attr("src","");
        $("#organ_name").val("");
        // $("#join_date").val("");
        $("#education").val("");
        $("#nation").val("");
        // $("#birth").val("");
        $("#marriage").val("");
        $("#origin_addr").val("");
        $("#card_no").val("");
        $("#address").val("");
        $("#family_addr").val("");
        $("#tel").val("");
        $("#phone").val("");
        $("#email").val("");


        isAdd = $(".newBuild input").attr("value");
        console.log(isAdd);
    });
    //修改
    $(".changeBtn").click(function () {
        check();
        if (checkedLength <= 0){
            $('#my-alert').modal({target: '#my-alert'});
            $(".users").html("修改用户");
            $(".alert").html("请选择要修改的用户！");
            return false;
        }else if (checkedLength === 1) {
            $(".newBuild").html("修改用户<input type='hidden' value='1'><a href=\"javascript: void(0)\" class=\"am-close am-close-spin\" data-am-modal-close>&times;</a>");

            $.ajax({
                url:"http://192.168.0.117:9000/users/detail",
                type:"post",
                headers: { "Authorization": "Bearer " + token},
                contentType:"application/json",
                data:JSON.stringify({
                    "id":userId
                }),
                success:function (data) {
                    $("#id").val(data.obj.id);
                    $("#username").val(data.obj.username);
                    $("#realname").val(data.obj.realname);
                    $("#sex").val(data.obj.sex);
                    //头像
                    var imgSrc =  locationUrl+"/"+data.obj.head_pic;
                    $("#touxiang").attr("src",imgSrc);
                    $("#organ_name").val(data.obj.organ_id);
                    $("#join_date").val(data.obj.join_date);

                    $("#education").val(data.obj.education);
                    $("#nation").val(data.obj.nation);
                    $("#birth").val(data.obj.birth);
                    $("#marriage").val(data.obj.marriage);
                    $("#origin_addr").val(data.obj.origin_addr);
                    $("#card_no").val(data.obj.card_no);
                    $("#address").val(data.obj.address);
                    $("#family_addr").val(data.obj.family_addr);
                    $("#tel").val(data.obj.tel);
                    $("#phone").val(data.obj.phone);
                    $("#email").val(data.obj.email);
                    console.log(data)
                }
            });
            isAdd = $(".newBuild input").attr("value");
            console.log(isAdd)
        }else if (checkedLength > 1){
            $('#my-alert').modal({target: '#my-alert'});
            $(".users").html("修改用户");
            $(".alert").html("同时只能选择一个用户,请选择一个！");
            return false;
        }

    });
    //删除
    $(".delBtn").click(function () {
       if (checkedLength <= 0){
           $('#my-alert').modal({target: '#my-alert'});
           $(".users").html("删除用户");
           $(".alert").html("请选择要删除的用户！");
           return false;
       }else {

           $.ajax({
               type:"post",
               url:"http://192.168.0.117:9000/users/deletes",
               contentType:"application/json",
               headers: { "Authorization": "Bearer " + token},
               data:JSON.stringify({
                   "ids":moreUserid
               }),
               success: function (data) {
                   if (data.success === true) {
                       $(".users").html("删除用户");
                       $(".alert").html("删除成功！");
                       $('#my-alert').modal({target: '#my-alert'});
                       $('#modal1').modal('close');
                   }else {

                       $(".users").html("删除用户");
                       $(".alert").html("删除失败！");
                       $('#my-alert').modal({target: '#my-alert'});
                       $('#modal1').modal('close');
                   }
               },
               error:function (data) {
                   alert(data)
               }
           });
       }
    });
    //修改密码
    $(".modifyBtn").click(function () {
        if (checkedLength <= 0){
            $('#my-alert').modal({target: '#my-alert'});
            $(".users").html("修改密码");
            $(".alert").html("请选择要修改的用户！");
            return false;
        }else if (checkedLength === 1) {
            $(".newBuild").html("修改密码<a href=\"javascript: void(0)\" class=\"am-close am-close-spin\" data-am-modal-close>&times;</a>");

        }else if (checkedLength > 1){
            $('#my-alert').modal({target: '#my-alert'});
            $(".users").html("修改密码");
            $(".alert").html("同时只能选择一个用户,请选择一个！");
            return false;
        }

    });
    // 提交修改密码
    $("#go2").click(function () {
        var password = $("#password1").val();
        var form3 = $("#form3");
        form3.validator({
            submit: function () {
                var formValidity = this.isFormValid();
                if (formValidity){
                    $.ajax({
                        url:"http://192.168.0.117:9000/users/update_password",
                        type:"post",
                        contentType:"application/json",
                        headers: { "Authorization": "Bearer " + token},
                        data:JSON.stringify({
                            "id":userId,
                            "password":password
                        }),
                        success:function (data) {
                            if (data.success === true) {
                                $(".users").html("修改密码");
                                $(".alert").html("修改成功！");
                                $('#my-alert').modal({target: '#my-alert'});
                                $('#my-popup').modal('close');
                            }else {
                                $(".users").html("修改密码");
                                $(".alert").html("修改失败！");
                                $('#my-alert').modal({target: '#my-alert'});
                                $('#my-popup').modal('close');
                            }
                        }
                    });
                    return false
                } else {
                    return false
                }
            }
        });

    });
    //新增用户
    $("#go").click(function () {
        //验证
        var form2 = $("#form2");
        form2.validator({
            // 正则表达式验证手机号
            patterns: {
                phoneNum:"/^1((3|5|8){1}\\d{1}|70)\\d{8}$/"
            },
            submit:function () {
                var formValidity = this.isFormValid();
                if (formValidity){
                    //上传头像
                    var head_pic = "";
                    var formdata = new FormData();
                    var pic = document.getElementById("head_pic").files;
                    for(var j=0;j<pic.length;j++){
                        formdata.append(""+j+"",pic[j]);
                    }
                    console.log(formdata);
                    $.ajax({
                        async:false,
                        url:"http://192.168.0.117:9000/users/headpic",
                        type:"post",
                        data:formdata,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success:function (data) {
                            head_pic = data.obj;

                        }
                    });
                    var id = $("#id").attr("value");
                    var username = $("#username").val();
                    var realname = $("#realname").val();
                    var sex = $("#sex option:selected").val();
                    var organ_name = $("#organ_name option:selected").val();
                    var join_date = $("#join_date").val();
                        if (join_date === ""){
                          join_date = null;
                        }
                    var education = $("#education").val();
                    var nation = $("#nation").val();

                    var birth = $("#birth").val();
                    if (birth === ""){
                        birth = null;
                    }
                    var marriage = $("#marriage").val();
                    var origin_addr = $("#origin_addr").val();
                    var card_no = $("#card_no").val();
                    var address = $("#address").val();
                    var family_addr = $("#family_addr").val();
                    var tel = $("#tel").val();
                    var phone = $("#phone").val();
                    var email = $("#email").val();

                    var str3 = {"id":id,"username":username,"realname":realname,"sex":sex,"organ_id":organ_name,"join_date":join_date,
                        "education":education,"nation":nation,"birth":birth,"marriage":marriage,"origin_addr":origin_addr,"card_no":card_no,
                        "address":address,"family_addr":family_addr,"tel":tel,"phone":phone,"email":email,"head_pic":head_pic
                    };
                    console.log(str3)
                    if (isAdd === "0"){
                        $.ajax({
                            async:false,
                            headers: { "Authorization": "Bearer " + token},
                            url:"http://192.168.0.117:9000/users/",
                            contentType: "application/json",
                            type:"post",
                            data:JSON.stringify(str3),
                            success:function (data) {
                                if (data.success === true) {
                                    $(".users").html("新建用户");
                                    $(".alert").html(data.message);
                                    $('#my-alert').modal({target: '#my-alert'});
                                    $('#modal1').modal('close');
                                }else {

                                    $(".users").html("新建用户");
                                    $(".alert").html("新建失败："+data.message);
                                    $('#my-alert').modal({target: '#my-alert'});
                                    $('#modal1').modal('close');
                                }
                                console.log(data)
                            },
                            error:function (data) {
                                    console.log(data);
                            }
                        });
                    }else{
                        $.ajax({
                            async:false,
                            headers: { "Authorization": "Bearer " + token},
                            url:"http://192.168.0.117:9000/users/update",
                            contentType:"application/json",
                            type:"post",
                            data:JSON.stringify(str3),
                            success:function (data) {
                                if (data.success === true) {
                                $(".users").html("修改用户");
                                $(".alert").html(data.message);
                                $('#my-alert').modal({target: '#my-alert'});
                                $('#modal1').modal('close');
                                }else {
                                    $(".users").html("修改用户");
                                    $(".alert").html("修改失败:"+data.message);
                                    $('#my-alert').modal({target: '#my-alert'});
                                    $('#modal1').modal('close');
                                }
                                console.log(data)

                            },
                            error:function (data) {
                                alert(data);
                            }
                        })
                    }

                    return false

                }else {
                    return false
                }
            }
        });




    });
    //选中所有的checkbox框
    $('#checkAll[name="selectAll"]').click(function(){
        // alert(this.checked);
        if($(this).is(':checked')){
            $('#show input[name="selectAll"]').each(function(){
                //此处如果用attr，会出现第三次失效的情况
                $(this).prop("checked",true);
            });
        }else{
            $('input[name="selectAll"]').each(function(){
                $(this).removeAttr("checked",false);
            });
            //$(this).removeAttr("checked");
        }

    });
    //查询用户列表
    //页数
    var pages =1;
    // 查找用户
    var realname ="";
        $("#searchValue").click(function () {
            realname = $("#seacrhInput").val();
            loadData();
        });



    function loadData(pageNum){
        $.ajax({
            url:"http://192.168.0.117:9000/users/list",
            type:"post",
            headers: { "Authorization": "Bearer " + token},
            contentType: "application/json",
            data:JSON.stringify({
                "pageNum": pageNum,
                "realname": realname,

            }),
            success: function (data) {
                var userList = data.obj;
                ssd = Math.ceil(data.pageTotal/data.pageSize);
                pages = ssd;
                str = "";
                $.each(userList ,function (index,values) {
                    // console.log(index);
                    str += "   <tr class=\"gradeX\">\n" +
                        "                            <td><input name='selectAll' onchange='check("+values.id+")' class='checked' value="+values.id+" type='checkbox'></td>\n" +
                        "                            <td>"+values.username+"</td>\n" +
                        "                            <td>"+values.realname+"</td>\n" +
                        "                            <td>"+values.phone+"</td>\n" +
                        "                            <td>"+values.sex+"</td>\n" +
                        "                            <td>"+values.email+"</td>\n" +
                        "                            <td>"+values.organ_name+"</td>\n" +
                        "                            <td>\n" +
                        "                                <div class=\"tpl-table-black-operation\">\n" +
                        "                                    <a  data-am-modal=\"{target: '#modal1'}\"  onclick='editor(\""+values.id+"\");' href=\"javascript:;\">\n" +
                        "                                        <i class=\"am-icon-pencil\"></i> 编辑\n" +
                        "                                    </a>\n" +
                        "                                    <a href=\"javascript:;\" onclick='del(\""+values.id+"\")' class=\"tpl-table-black-operation-del\">\n" +
                        "                                        <i class=\"am-icon-trash\"></i> 删除\n" +
                        "                                    </a>\n" +
                        "                                </div>\n" +
                        "                            </td>\n" +
                        "                        </tr>";
                    // console.log(values.id)
                });
                $("#show").html(str);
            }
        });
    }
    loadData(1);
    //分页
    var pageNum = 1;
    $(".first").click(function(){
        pageNum =1;
        loadData(pageNum);
        $(this).parents("li").addClass("am-active");
        $(this).parents("li").siblings().removeClass("am-active");
    });
    $(".last").click(function(){
        pageNum = pages;
        loadData(pageNum);
        $(this).parents("li").addClass("am-active");
        $(this).parents("li").siblings().removeClass("am-active");
    });
    $(".up").click(function(){
        if(pageNum === 1){
            return false;
        } else{
            pageNum--;
            loadData(pageNum);
        }
        $(this).parents("li").addClass("am-active");
        $(this).parents("li").siblings().removeClass("am-active");
    });
    $(".down").click(function(){
        if(pageNum === pages){
            return false;
        } else{
            pageNum++;
            loadData(pageNum);
        }
        $(this).parents("li").addClass("am-active");
        $(this).parents("li").siblings().removeClass("am-active");
    });
});
