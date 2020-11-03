<template>
    <div>
        <div class="rp-top">
            <Input v-model="helpSeach.LIKE_problemTitle" style="width:300px;margin-right:10px;" placeholder="请输入帮助标题"></Input>
            <Button type="success" @click="findHelpBackEndResultPage(1)">查询</Button>
        </div>
        <div class="rp-bottom">
            <div style="height:50px;margin-bottom:2px;">
                <span>帮助列表</span>
                <Button style="float:right;" type="success" @click="addModal = true">添加帮助</Button>
            </div>
            <Table border :columns="helpList" :data="helpData.content"></Table>
            <div style="text-align:right;">
                <Page
                style="margin-top:10px;"
                :page-size="10"
                :current='helpSeach.page'
                :total="helpData.totalElements"
                @on-change="findHelpBackEndResultPage"
                />
            </div>
        </div>
        <Modal v-model="addModal" :mask-closable='false' :title="helpInfo.id === '' ? '添加帮助' : '修改帮助'">
            <div>
                <p>帮助标题</p>
                <Input v-model="helpInfo.problemTitle" style="width:200px"></Input>
            </div>
            <div style="margin:15px 0;">
                <p>问题分类</p>
                <Select v-model="helpInfo.problemClassificationId" style="width:200px">
                    <Option v-for="item in problemList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </div>
            <div style="margin-bottom:15px;">
                <p>是否常见</p>
                <RadioGroup v-model="helpInfo.whetherCommon">
                    <Radio label="long">
                        <span>常见</span>
                    </Radio>
                    <Radio label="samll">
                        <span>不常见</span>
                    </Radio>
                </RadioGroup>
            </div>
            <div>
                <p>通知内容</p>
                <tinymce-editor v-if="addModal" ref="editor" :init='init' v-model="helpInfo.content" @on-change="handleChange"/>
            </div>
            <div slot="footer">
                <Button type="text" @click="addModal = false">取消</Button>
                <Button type="success" @click="createOrUpdateHelp" :disabled='btnDis'>确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import Editor from "@tinymce/tinymce-vue";
import {findHelpById, upload, findHelpBackEndResultPage, createOrUpdateHelp, findProblemTypeListByCondition} from '@/api/data'
export default {
    data() {
        return {
            helpList: [
                {
                    title: 'id',
                    key: 'id'
                },
                {
                    title: '帮助标题',
                    key: 'problemTitle'
                },
                {
                    title: '是否常见',
                    key: 'whetherCommon',
                    render: (h, params) => {
                        return h('p', {}, params.row.whetherCommon ? '常见' : '不常见')
                    }
                },
                {
                    title: '问题分类名称',
                    key: 'problemName'
                },
                {
                    title: '操作',
                    render: (h, params) => {
                        return h('p', {
                            style: {
                                cursor: 'pointer',
                                color: '#2D8cF0',
                                textDecoration: 'underline'
                            },
                            on: {
                                click: () => {
                                    this.addModal = true;
                                    this.helpInfo.content = params.row.content;
                                    this.helpInfo.problemClassificationId = params.row.problemClassificationId;
                                    this.helpInfo.problemTitle = params.row.problemTitle,
                                    this.helpInfo.whetherCommon = params.row.whetherCommon ? 'long':'samll';
                                    this.helpInfo.id = params.row.id;
                                }
                            }
                        }, '修改')
                    }
                }
            ],
            helpData: {},
            helpSeach: {
                page: 1,
                size: '10',
                LIKE_problemTitle: '',
                sort: 'id,asc'
            },
            helpInfo: {
                content: '',
                problemClassificationId: '',
                problemTitle: '',
                whetherCommon: 'long',
                id: null
            },
            init: {
                language_url: "/tinymce/langs/zh_CN.js",
                language: "zh_CN",
                skin_url: '/tinymce/skins/ui/oxide',
                height: 430,
                plugins:"link lists image code table colorpicker textcolor wordcount contextmenu",
                toolbar:"bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | link unlink image code | removeformat",
                branding: false,
                menubar: false,
                images_upload_handler: (blobInfo, success, failure) => {
                const file = blobInfo.blob();
                    try {
                    let params = new FormData();
                    params.append('filename', file.name);
                    params.append('file', file)
                    upload(params).then(res => {
                        if (res.status === 200 && res.data.code === '200') {
                        success(res.data.data.viewUrl);
                        } else {
                        failure(res.data.message)
                        }
                    })
                    } catch {
                    failure('上传图片失败')
                    }
                }
            },
            problemList: [],
            addModal: false,
            btnDis: false
        }
    },
    components: {
     "tinymce-editor": Editor
    },
    created() {
        this.findHelpBackEndResultPage(1);
        this.findProblemTypeListByCondition();
    },
    mounted(){
        tinymce.init({});
    },
    methods: {
        handleChange (html, text) {
            this.helpInfo.content = html
        },
        findHelpBackEndResultPage(page) {
            this.helpSeach.page = page;
            findHelpBackEndResultPage(this.helpSeach).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.helpData = res.data.data;
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        findProblemTypeListByCondition() {
            findProblemTypeListByCondition().then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.problemList = res.data.data;
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        createOrUpdateHelp() {
            this.helpInfo.whetherCommon = this.helpInfo.whetherCommon === 'long' ? true : false;
            createOrUpdateHelp(this.helpInfo).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    if (this.helpInfo.id === '') {
                        this.$Message.success('添加成功');
                    } else {
                        this.$Message.success('修改成功');
                        this.helpInfo.id = '';
                    }
                    this.findHelpBackEndResultPage(1);
                    this.addModal = false;
                } else {
                    this.$Message.error(res.data.message);
                    this.addModal = false;
                }
            })
        }
    },
    watch: {
        'helpInfo': {
            handler () {
                if (this.helpInfo.content ==='' && this.helpInfo.content === '' && this.helpInfo.problemClassificationId === '' && this.helpInfo.problemTitle === '') {
                    this.btnDis = true
                } else {
                    this.btnDis = false
                }
            },immediate: true, deep: true
        }
    }
}
</script>

<style lang="less" scoped>
.rp-top {
    background: #fff;
    padding: 20px;
}
.rp-bottom {
    background: #fff;
    padding: 20px;
    margin-top: 20px;
}
</style>