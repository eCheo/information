<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="商品名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入商品名称" style="width:150px"></Input>
      </FormItem>
      <FormItem label="商品成本" prop="money">
        <Input v-model="formValidate.money" placeholder="请输入商品成本 人民币" style="width:150px"></Input>
      </FormItem>
      <FormItem label="兑换积分" prop="integral">
        <Input v-model="formValidate.integral" placeholder="请输入兑换积分" style="width:150px"></Input>
      </FormItem>
      <FormItem label="规格" prop="specsName">
        <Input v-model="formValidate.specsName" placeholder="请输入规格名称" style="width:150px"></Input>
        <Button type="success" @click="specsAdd" :disabled="formValidate.specsName === ''">添加</Button>
        <div class="s-list" v-for="(item, index) in specification" :key="index">
          <span>{{item.key}}</span>
          <Input placeholder="请输入子规格名称" v-model="item.sonName" style="width:150px"></Input>
          <Button @click="specsDelete(index)">删除规格</Button>
          <Button type="success" @click="specsSonAdd(item)" :disabled="item.sonName === ''">新增子规格</Button>
          <div style="margin-top:20px">
            <div class="s-button" v-for="(son, index2) in item.specification || item.info" :key="index2">
              <div class="s-close" @click="specsSonDetele(item, index2)"></div>
              {{son}}
            </div>
          </div>
        </div>
      </FormItem>
      <Table border :columns="specsList" :data="specsData">
        <template slot-scope="{ row, index }" slot="image" style="text-align:center;">
                <!-- <template v-if="row.status === 'finished'">
                    <img :src="row.image">
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template> -->
            <Upload
                ref="upload"
                v-if="row.image === ''"
                :show-upload-list="true"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="5042"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                :headers="headers"
                type="drag"
                action="http://47.56.186.16:8089/api/obs/upload.json"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;" @click="upObj = row, upIndex = index">
                    <span>+</span>
                    <p>上传图片</p>
                </div>
            </Upload>
            <div v-else class="ad-img">
              <Icon type="md-close" size='14' color='#ed4014' class="ad-icon" @click="row.image = ''" />
              <img style="width:50px;height:50px"  :src="row.image">
            </div>
        </template>
      </Table>
      <FormItem label='有效期' prop='date'>
           <DatePicker @on-change='changeDate' :value="formValidate.date" format="yyyy年MM月dd日" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 350px"></DatePicker>
      </FormItem>
      <FormItem label='商品图片'>
        <div class="demo-upload-list" v-for="(item, index) in goodImagesList" :key="index">
          <template v-if="item.status === 'finished'">
            <img :src="item.url" />
            <div class="demo-upload-list-cover">
              <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          ref="goodImg"
          :show-upload-list="false"
          :on-success="handleSuccessGood"
          :format="['jpg','png']"
          :max-size="5042"
          :on-format-error="handleFormatErrorGood"
          :on-exceeded-size="handleMaxSizeGood"
          multiple
          :headers="headers"
          type="drag"
          action="http://47.56.186.16:8089/api/obs/upload.json"
          style="display: inline-block;width:58px;"
        >
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </FormItem>
      <FormItem label='商品描述' prop='goodDescribe'>
        <tinymce-editor ref="editor" :init='init' v-model="formValidate.goodDescribe" @on-change="handleChange"/>
      </FormItem>
      <div style="margin-top:20px;">
        <Button type="success" @click="upGoods">确认</Button>
        <Button>取消</Button>
      </div>
    </Form>
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
import { createGoods, findBackEndGoods, updateGoods, upload } from '@/api/data'
import store from '../../store/module/user'
export default {
  data () {
    return {
      formValidate: {
        name: '',
        money: '',
        specsName: '',
        sonName: '',
        integral: '',
        specificationDetailsDtos: [],
        date: '',
        startDate: '',
        expirationDate: '',
        goodImagesList: [],
        goodDescribe: ''
      },
      deleteSonNameEmp: '',
      ruleValidate: {},
      specification: [],
      specsData: [],
      specsList: [],
      specsListEmp: [
        {
          title: '价格',
          key: 'money',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.money,
                formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              },
              on: {
                'on-change': (value) => {
                  this.specsData[params.row._index].money = value;
                }
              }
            })
          }
        },
        {
          title: '图片',
          slot: 'image'
        },
        {
          title: '库存',
          key: 'stock',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.stock
              },
              on: {
                'on-change': (value) => {
                  this.specsData[params.row._index].stock = value;
                }
              }
            })
          }
        },
        {
          title: '积分',
          key: 'integral',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.integral
              },
              on: {
                'on-change': (value) => {
                  this.specsData[params.row._index].integral = value;
                }
              }
            })
          }
        }
      ],
      sonMap: new Map(),
      setList: new Set(),
      headers: {},
      upObj: {},
      upIndex: 0,
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
          if (file.size > 5242880) {
            this.$Message.error("图片请不要大于 5MB");
          } else {
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
        }
      },
      goodImagesList: []
    }
  },
   components: {
     "tinymce-editor": Editor
  },
  created() {
    if (this.$route.query.id) {
      this.findBackEndGoods(this.$route.query.id);
    }
  },
  mounted () {
    this.headers = {
      Authorization: sessionStorage.getItem('tokenType') + ' ' + store.state.token
    }
    this.goodImagesList = this.$refs.goodImg.fileList;
  },
  methods: {
    handleChange (html, text) {
      this.formValidate.goodDescribe = html
    },
    findBackEndGoods(id) {
      this.specsList = this.specsListEmp;
      findBackEndGoods({id: id}).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.specification = JSON.parse(res.data.data.attributeList);
          this.formValidate = res.data.data;
          res.data.data.specificationDetailsDtos.forEach(item => {
            item.specification.forEach(it => {
              item[it.key] = it.name
            })
          })
          this.specsData = res.data.data.specificationDetailsDtos;
          this.specification.forEach(item => {
            this.specsList.unshift({key: item.key, title: item.key});
          })
          if (this.formValidate.goodImagesList.length > 0) {
            let obj = {};
            for (let i = 0; i< this.formValidate.goodImagesList.length; i++) {
              obj.url = this.formValidate.goodImagesList[i];
              obj.status = 'finished'
              this.goodImagesList.push(obj)
            }
          }
          this.formValidate.date = [res.data.data.startDate, res.data.data.expirationDate]
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    specsAdd () {
      let datas = {
        key: this.formValidate.specsName,
        sonName: '',
        image: '',
        integral: '',
        money: '',
        stock: '',
        specification: []
      }
      if (this.specification.length !== 0) {
        let repeat = this.specification.some(item => {
          return item.key === this.formValidate.specsName
        })
        if (repeat) {
          this.$Message.error('规格名不能重复')
        } else {
          this.specification.splice(0, 0, datas)
          this.tableAdd(this.formValidate.specsName)
        }
      } else {
        this.specification.splice(0, 0, datas)
        this.tableAdd(this.formValidate.specsName)
      }
    },
    specsDelete (index) {
      //   this.specification[index].sonList = [];
      this.tableDel(this.specification[index])
      this.specification.splice(index, 1)
    },
    specsSonAdd (list) {
      if (list.specification.length !== 0) {
        let repeat = list.specification.some(item => {
          return item === list.sonName
        })
        if (repeat) {
          this.$Message.error('子规格名不能重复')
          return
        } else {
          list.specification.push(list.sonName)
          this.setList.add(list.sonName)
        }
      } else {
        list.specification.push(list.sonName)
        this.setList.add(list.sonName)
      }
      this.sonMap.set(list.key, list.specification)
      this.tableAdd()
    },
    specsSonDetele (item, index) {
      this.deleteSonNameEmp = item.specification ? item.specification.splice(index, 1)[0] : item.info.splice(index, 1)[0]
      if (item.specification ? item.specification.length === 0 : item.info.length === 0) {
        for (var i = this.specsList.length - 1; i >= 0; i--) {
          if (this.specsList[i].key === item.key) {
            this.specsList.splice(i, 1)
          }
        }
        this.specsData.forEach(it => {
          it.specification.forEach((ot, num) => {
            if (ot.name === this.deleteSonNameEmp) {
              it.specification.splice(num, 1)
            }
          })
        })
      } else {
        for (var i = this.specsData.length - 1; i >= 0; i--) {
          if (this.specsData[i][item.key] === this.deleteSonNameEmp) {
            this.specsData.splice(i, 1)
            if (item.specification) {
              item.specification.splice(index, 1)
            } else {
              item.info.splice(index, 1)
            }
          }
        }
      }
    },
    tableAdd () {
      let list = this.listSpict()
      let list2 = this.printList(list)
      if (list2 !== undefined) {
        this.specsData = []
        this.specsList = this.specsListEmp
        let obj = {}
        list2.forEach(item => {
          var table = item.split(',')
          let data = {}
          let specification = {}
          for (var i = 0; i < table.length; i++) {
            var tableAttr = table[i].split(':')
            var tableTitle = tableAttr[0]
            var tableValue = tableAttr[1]
            data[tableTitle] = tableValue
            specification[tableTitle] = tableValue
            data.money = ''
            data.image = ''
            data.integral = ''
            data.stock = ''
            if (this.isTableTitleExit(tableTitle)) continue
            this.specsList.unshift({ key: tableTitle, title: tableTitle })
          }
          obj = Object.keys(specification).map(key => ({
            key,
            name: specification[key]
          }))
          data.specification = obj
          this.specsData.push(data)
        })
      }
    },
    isTableTitleExit (tableTitle) {
      for (let k = 0; k < this.specsList.length; k++) {
        if (this.specsList[k].key === tableTitle) {
          return true
        }
      }
      return false
    },
    listSpict () {
      let listSc = []
      for (let [key, value] of this.sonMap) {
        var name = []
        for (let v of value) {
          name.push(key + ':' + v)
        }
        if (name.length <= 0) {
          continue
        }
        listSc.push([...name])
      }
      return listSc
    },
    printList (list) {
      if (list.length <= 1) {
        return list[0]
      }
      var tmp = []
      for (let s1 of list[0]) {
        for (let s2 of list[1]) {
          tmp.push(s1 + ',' + s2)
        }
      }
      list.splice(1, 1)
      list.splice(0, 1)
      list.unshift(tmp)
      return this.printList(list)
    },
    tableDel (obj) {
      let data = obj.specification ? obj.specification : obj.info
      for (var j = data.length - 1; j >= 0; j--) {
        this.deleteSonNameEmp = data.splice(j, 1)[0]
        if (data.length === 0) {
          for (var i = this.specsList.length - 1; i >= 0; i--) {
            if (this.specsList[i].key === obj.key) {
              this.specsList.splice(i, 1)
            }
          }
        } else {
          for (var i = this.specsData.length - 1; i >= 0; i--) {
            if (this.specsData[i][obj.key] === this.deleteSonNameEmp) {
              this.specsData.splice(i, 1)
            }
          }
        }
      }
    },
    upGoods () {
      this.formValidate.specificationDetailsDtos = JSON.parse(JSON.stringify(this.specsData));
      if (this.$route.query.id) {
        updateGoods(this.formValidate).then(res => {
          if (res.data.code === '200') {
            this.$Message.success('修改成功');
            this.$router.push('/update/shop/shoppingManger');
          } else {
            this.$Message.error(res.data.message);
          }
        })
      } else {
        createGoods(this.formValidate).then(res => {
          if (res.data.code === '200') {
            this.$Message.success('添加成功');
            this.$router.push('/update/shop/shoppingManger');
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.formValidate.startDate = starTime.substring(0, starTime.length - 1)
      this.formValidate.expirationDate = endTime.substring(0, endTime.length - 1)
    },
    handleRemove (file) {
      const fileList = this.$refs.goodImg.fileList;
      this.$refs.goodImg.fileList.splice(fileList.indexOf(file), 1);
      this.formValidate.goodImagesList.splice(this.formValidate.goodImagesList.indexOf(file.url), 1);
    },
    handleSuccess (res, file) {
      this.upObj.image = res.data.viewUrl;
      for(let i = 0; i < this.specsData.length; i++) {
          if (i === this.upIndex) {
            this.specsData[i].image = res.data.viewUrl;
          }
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '图片格式错误',
        desc:'图片格式错误'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '失败',
        desc: '图片不能超过5mb'
      })
    },
    handleSuccessGood (res, file) {
      this.formValidate.goodImagesList.push(res.data.viewUrl)
    },
    handleFormatErrorGood (file) {
      this.$Notice.warning({
        title: '图片格式错误',
        desc:'图片格式错误'
      })
    },
    handleMaxSizeGood (file) {
      this.$Notice.warning({
        title: '失败',
        desc: '图片不能超过5mb'
      })
    },
    handleBeforeUpload () {
    //   const check = this.uploadList.length < 5;
    //   if (!check) {
    //     this.$Notice.warning({
    //       title: "Up to five pictures can be uploaded."
    //     });
    //   }
    //   return check;
    }
  }
}
</script>

<style lang="less" scoped>
.s-list {
  margin: 20px 0;
  .s-button {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
    margin-right: 10px;
    border: 1px solid #000;
    border-radius: 4px;
    text-align: center;
    user-select: none;
    .s-close {
      position: absolute;
      right: -5px;
      top: -5px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background-color: #000;
      cursor: pointer;
    }
    .s-close::before {
      position: absolute;
      top: 3px;
      left: 6px;
      content: "";
      color: #fff;
      font-size: 12px;
      width: 1px;
      height: 7px;
      background-color: #fff;
      transform: rotate(-45deg);
    }
    .s-close::after {
      position: absolute;
      top: 3px;
      left: 6px;
      content: "";
      color: #fff;
      font-size: 12px;
      width: 1px;
      height: 7px;
      background-color: #fff;
      transform: rotate(45deg);
    }
  }
  .s-button:last-child {
    margin-right: 0;
  }
}
.ad-img {
  width: 50px;
  height: 50px;
  position: relative;
}
.ad-icon {
    position: absolute;
    right: 0;
    cursor: pointer;
    font-size: 14px;
}
.demo-upload-list{
        display: inline-block;
        width: 150px;
        height: 150px;
        text-align: center;
        line-height: 150px;
        // border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
