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
                <!-- <template v-if="item.status === 'finished'">
                    <img :src="row.image">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
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
                <div style="width: 58px;height:58px;line-height: 58px;" @click="upObj = row">
                    <span>+</span>
                    <p>上传图片</p>
                </div>
            </Upload>
            <img style="width:50px;height:50px" v-else :src="row.image">
        </template>
      </Table>
      <FormItem label='有效期' prop='date'>
           <DatePicker @on-change='changeDate' :value="formValidate.date" format="yyyy年MM月dd日" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 350px"></DatePicker>
      </FormItem>
      <FormItem label='商品描述' prop='goodDescribe'>
        <Input v-model="formValidate.goodDescribe" type="textarea" :rows="4"/>
      </FormItem>
      <div class="demo1">
        <div class="demo2">居中</div>
      </div>
      <div style="margin-top:20px;">
        <Button type="success" @click="upGoods">确认</Button>
        <Button>取消</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { createGoods, findBackEndGoods, updateGoods } from '@/api/data'
import store from '../../store/module/user'
export default {
  data () {
    return {
      formValidate: {
        name: 'hh',
        money: '50',
        specsName: '',
        sonName: '',
        integral: '20',
        specificationDetailsDtos: [],
        date: '',
        startDate: '2020-06-11',
        expirationDate: '2020-07-11',
        goodImagesList: ['https://i0.hdslb.com/bfs/archive/7da891bf650caf6c7ba320d0dfd52917d4b74b28.png'],
        goodDescribe: '商品:小米手环'
      },
      deleteSonNameEmp: '',
      ruleValidate: {},
      specification: [],
      specsData: [],
      specsList: [],
      specsListEmp: [
        {
          title: '价格',
          key: 'money'
        },
        {
          title: '图片',
          slot: 'image'
        },
        {
          title: '库存',
          key: 'stock'
        },
        {
          title: '积分',
          key: 'integral'
        }
      ],
      sonMap: new Map(),
      setList: new Set(),
      headers: {},
      upObj: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      this.findBackEndGoods(this.$route.query.id);
    }
  },
  mounted () {
    this.headers = {
      Authorization: store.state.tokenType + ' ' + store.state.token
    }
  },
  methods: {
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
            data.money = '20'
            data.image = 'https://i0.hdslb.com/bfs/archive/7da891bf650caf6c7ba320d0dfd52917d4b74b28.png'
            data.integral = '60'
            data.stock = '100'
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
      this.formValidate.specificationDetailsDtos = JSON.parse(JSON.stringify(this.specsData))
      if (this.$route.query.id) {
        updateGoods(this.formValidate).then(res => {
          if (res.data.code === '200') {
            this.$Message.success('修改成功')
          } else {
            this.$Message.error(res.data.message)
          }
        })
      } else {
        createGoods(this.formValidate).then(res => {
          if (res.data.code === '200') {
            this.$Message.success('添加成功')
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
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      this.upObj.image = res.data.viewUrl
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' +
          file.name +
          ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
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
.demo1 {
  width: 100px;
  height: 200px;
  border: 1px solid #000;
  .demo2 {
    margin-top: calc(100% - 50% - 10px)
  }
}
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
</style>
