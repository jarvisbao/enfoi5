<template>
  <div v-if="show">
    <el-form label-position="top">
      <el-form-item v-if="!(['grid','tabs', 'report'].includes(data.type))" label="选择标题和数据绑定Key">
        <el-select id="nameModel" v-model="data.name_model" :popper-append-to-body="false" value-key="prop" filterable placeholder="请选择" popper-class="name-dropdown">
          <el-option
            v-for="item in designFields"
            :key="item.prop"
            :label="item.label"
            :value="item"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.prop }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段标识" v-if="!(['grid','tabs', 'report'].includes(data.type))">
        <el-input id="model" v-model="data.model" />
      </el-form-item>

      <el-form-item label="字段取值格式" v-if="(['innerobject','outerobject'].includes(data.type))">
        <el-input id="format" v-model="data.name_model.format" />
      </el-form-item>

      <div v-if="Object.keys(data.options).indexOf('dataType')>=0" class="validate-block">
        <el-form-item label="格式">
          <el-select v-if="Object.keys(data.options).indexOf('dataType')>=0" v-model="data.options.dataType" :popper-append-to-body="false">
            <el-option value="string" label="字符串" />
            <el-option value="number" label="数字" />
            <el-option value="boolean" label="布尔值" />
            <el-option value="integer" label="整数" />
            <el-option value="float" label="浮点数" />
            <el-option value="money" label="人民币" />
            <el-option value="url" label="URL地址" />
            <el-option value="email" label="邮箱地址" />
            <el-option value="hex" label="十六进制" />
          </el-select>
          <el-checkbox v-model="data.options.dataTypeCheck" style="margin-right: 10px;">
            格式校验
          </el-checkbox>
          <el-input v-if="data.options.dataTypeCheck" v-model="data.options.dataTypeMessage" clearable class="message-input" placeholder="自定义错误提示" />
          <div v-if="data.options.dataType === 'money'">
            金额大写转换
            <el-switch v-model="data.options.uppercase" />
          </div>
        </el-form-item>
      </div>

      <el-form-item label="标题">
        <el-input id="name" v-model="data.name" />
      </el-form-item>

      <el-form-item label="文字对齐方式">
        <el-radio-group v-model="data.options.textPosition" size="mini">
          <el-radio-button label="left">
            左对齐
          </el-radio-button>
          <el-radio-button label="right">
            右对齐
          </el-radio-button>
          <el-radio-button label="center">
            居中对齐
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('width')>=0" label="宽度">
        <el-input id="width" v-model="data.options.width" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('height')>=0" label="高度">
        <el-input id="height" v-model="data.options.height" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('size')>=0" label="大小">
        宽度：<el-input id="sizeW" v-model.number="data.options.size.width" style="width: 70px;" type="number" size="mini" />
        高度：<el-input id="sizeH" v-model.number="data.options.size.height" style="width: 70px;" type="number" size="mini" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('labelWidth')>=0 && !data.options.tableColumn" label="标签宽度">
        <el-checkbox v-model="data.options.isLabelWidth" style="margin-right: 5px;">
          自定义
        </el-checkbox>
        <el-input-number v-model="data.options.labelWidth" :disabled="!data.options.isLabelWidth" :min="0" :max="200" :step="10" size="small" />
      </el-form-item>

      <el-form-item v-if="!(['grid','tabs', 'report', 'divider'].includes(data.type))" label="隐藏标签">
        <el-switch v-model="data.options.hideLabel" />
      </el-form-item>

      <el-form-item v-if="!(['grid','tabs', 'report', 'divider', 'innerobject', 'outerobject'].includes(data.type))" label="字段说明">
        <div style="display: flex;">
          <el-input v-model="data.options.fieldTips" />
          <el-color-picker v-model="data.options.textColor" style="margin-left: 10px;" />
        </div>
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' || data.type!='date')" label="占位内容">
        <el-input v-model="data.options.placeholder" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('inline')>=0" label="布局方式">
        <el-radio-group v-model="data.options.inline" size="small">
          <el-radio-button id="block" :label="false">
            块级
          </el-radio-button>
          <el-radio-button id="inline" :label="true">
            行内
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('contentPosition') >= 0" label="文案位置">
        <el-radio-group v-model="data.options.contentPosition">
          <el-radio-button label="left">
            左侧
          </el-radio-button>
          <el-radio-button label="center">
            居中
          </el-radio-button>
          <el-radio-button label="right">
            右侧
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showInput')>=0" label="显示输入框">
        <el-switch v-model="data.options.showInput" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('min')>=0" label="最小值">
        <el-input-number v-model="data.options.min" :min="0" :max="100" :step="1" size="small" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('max')>=0" label="最大值">
        <el-input-number v-model="data.options.max" :min="0" :max="100" :step="1" size="small" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('step')>=0" label="步长">
        <el-input-number v-model="data.options.step" :min="0" :max="100" :step="1" size="small" />
      </el-form-item>
      <el-form-item v-if="data.type=='select'" label="是否多选">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple" />
      </el-form-item>
      <el-form-item v-if="data.type=='select'" label="是否可搜索">
        <el-switch v-model="data.options.filterable" />
        <div v-show="data.options.filterable">
          <div>远程搜索</div>
          <el-switch v-model="data.options.remoteSearch" />
        </div>
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('allowHalf')>=0" label="允许半选">
        <el-switch
          v-model="data.options.allowHalf"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showAlpha')>=0" label="支持透明度选择">
        <el-switch
          v-model="data.options.showAlpha"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showLabel')>=0" label="是否显示标签">
        <el-switch
          v-model="data.options.showLabel"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('options')>=0" label="选项">
        <el-radio-group v-model="data.options.remote" size="small" style="margin-bottom:10px;" @change="changeRemote">
          <el-radio-button id="static" :label="false">
            静态数据
          </el-radio-button>
          <el-radio-button id="remote" :label="true">
            远端数据
          </el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <div class="remote-databox" style="margin-bottom: 12px;">
              <div class="title">
                远端方法
              </div>
              <el-select id="remoteFunc" v-model="data.options.remoteFunc" :popper-append-to-body="false" filterable placeholder="请选择" size="mini">
                <el-option
                  v-for="item in remote"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <!-- <el-input v-model="data.options.remoteFunc" size="mini" style="">
              <template slot="prepend">远端方法</template>
            </el-input> -->
            <el-input id="remoteUri" v-model="data.options.remoteUri" size="mini" style="">
              <template slot="prepend">
                远端接口
              </template>
            </el-input>
            <div class="remote-databox">
              <div class="title">
                接口参数
              </div>
              <el-input v-model="data.options.remoteParams" type="textarea" autosize placeholder="请填写json格式的数据" @blur="validateParams" />
            </div>
            <div v-if="showErrorMsg" style="font-size: 13px; color: red; margin-top: -20px;">
              请输入正确的json格式!
            </div>
            <el-input id="remoteData" v-model="data.options.remoteData" size="mini" style="" placeholder="response.payload">
              <template slot="prepend">
                远端数据
              </template>
            </el-input>
            <el-input id="propValue" v-model="data.options.props.value" size="mini" style="">
              <template slot="prepend">
                值
              </template>
            </el-input>
            <el-input id="propLabel" v-model="data.options.props.label" size="mini" style="">
              <template slot="prepend">
                标签
              </template>
            </el-input>
            <div v-if="data.type=='select'">
              <span class="el-form-item__label">开启分页</span> <el-switch v-model="data.options.pagination" />
            </div>
            <el-input v-if="data.options.pagination" id="pagination" v-model="data.options.pageSize" size="mini">
              <template slot="prepend">
                显示条数
              </template>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group v-model="data.options.defaultValue">
              <draggable
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                tag="ul"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-radio
                    :label="item.value"
                    style="margin-right: 5px;margin-bottom: 5px;"
                  >
                    <el-input v-model="item.value" :style="{'width': data.options.showLabel? '80px': '150px' }" size="mini" placeholder="value" class="staticValue" />
                    <el-input v-if="data.options.showLabel" v-model="item.label" style="width:80px;" size="mini" placeholder="label" class="staticLabel" />
                    <!-- <input v-model="item.value"/> -->
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont-fm icon-icon_bars" /></i>
                  <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />
                  <i class="el-icon-edit" style="font-size: 16px;margin-left: 5px;cursor: pointer;" @click="changeDefaultValue(index)" />
                </li>
              </draggable>
            </el-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group v-model="data.options.defaultValue">
              <draggable
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                tag="ul"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-checkbox
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <el-input v-model="item.value" :style="{'width': data.options.showLabel? '80px': '150px' }" size="mini" placeholder="value" class="staticValue" />
                    <el-input v-if="data.options.showLabel" v-model="item.label" style="width:80px;" size="mini" placeholder="label" class="staticLabel" />
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont-fm icon-icon_bars" /></i>
                  <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />
                  <i class="el-icon-edit" style="font-size: 16px;margin-left: 5px;cursor: pointer;" @click="changeDefaultValue(index)" />
                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">
              添加选项
            </el-button>
            <template v-if="data.type=='checkbox' || data.options.multiple">
              <el-button type="text" @click="setDefaultValue">
                设置默认值
              </el-button>
            </template>
            <template v-else>
              <el-button v-if="data.options.defaultValue===''" type="text" @click="setDefaultValue">
                设置默认值
              </el-button>
            </template>
            <el-button type="text" @click="handleClearSelect">重置选择</el-button>
          </div>
        </template>
      </el-form-item>

      <template v-if="data.type=='cascader'">
        <el-form-item label="是否动态加载">
          <el-switch v-model="data.options.lazy" />
        </el-form-item>
        <el-form-item label="是否可搜索">
          <el-switch v-model="data.options.filterable" />
        </el-form-item>
        <el-form-item label="返回值是否为数组">
          <el-switch v-model="data.options.emitPath" @change="changeEmitPath" />
        </el-form-item>
        <el-form-item label="默认值" style="position:relative;">
          <i class="el-icon-edit" style="position: absolute; top: -27px; left: 50px; cursor: pointer;" @click="setDefaultValue" />
          <ul>
            <li v-for="(item, index) in data.options.remoteOptions" :key="index">
              <el-input v-model="item.value" style="width:80px;" size="mini" placeholder="value" class="staticValue" />
              <el-input v-model="item.label" style="width:80px;margin-left: 5px;" size="mini" placeholder="label" class="staticLabel" />
              <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="cascaderOptionsRemove(index)" />
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="远端数据">
          <div>
            <div class="remote-databox">
              <div class="title">
                远端方法
              </div>
              <el-select v-model="data.options.remoteFunc" :popper-append-to-body="false" filterable placeholder="请选择" size="mini">
                <el-option
                  v-for="item in remote"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <!-- <el-input v-model="data.options.remoteFunc" size="mini" style="">
              <template slot="prepend">远端方法</template>
            </el-input> -->
            <el-input v-model="data.options.remoteUri" size="mini" style="">
              <template slot="prepend">
                远端接口
              </template>
            </el-input>
            <div class="remote-databox">
              <div class="title">
                接口参数
              </div>
              <el-input v-model="data.options.remoteParams" type="textarea" autosize placeholder="请填写json格式的数据" @blur="validateParams" />
            </div>
            <el-input v-model="data.options.remoteData" size="mini" style="" placeholder="response.payload">
              <template slot="prepend">
                远端数据
              </template>
            </el-input>
            <el-input v-if="data.options.lazy" v-model="data.options.primary" size="mini" style="">
              <template slot="prepend">
                动态数据主键
              </template>
            </el-input>
            <el-input v-model="data.options.props.value" size="mini" style="">
              <template slot="prepend">
                值
              </template>
            </el-input>
            <el-input v-model="data.options.props.label" size="mini" style="">
              <template slot="prepend">
                标签
              </template>
            </el-input>
            <el-input v-model="data.options.props.children" size="mini" style="">
              <template slot="prepend">
                子选项
              </template>
            </el-input>
          </div>
        </el-form-item>
      </template>

      <el-form-item v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'text' || data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch' || data.type == 'html')" label="默认值">
        <el-input v-if="data.type=='textarea'" v-model="data.options.defaultValue" :rows="5" type="textarea" />

        <template v-if="data.type=='input' || data.type == 'text'">
          <template v-if="data.options.dataType == 'number' || data.options.dataType == 'integer' || data.options.dataType == 'float'">
            <el-input v-model.number="data.options.defaultValue" :type="data.options.dataType" />
          </template>
          <template v-else>
            <el-input v-model="data.options.defaultValue" />
          </template>
        </template>

        <el-rate v-if="data.type == 'rate'" v-model="data.options.defaultValue" :max="data.options.max" :allow-half="data.options.allowHalf" style="display:inline-block;vertical-align: middle;" />
        <el-button v-if="data.type == 'rate'" type="text" style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">
          清空
        </el-button>
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        />
        <el-switch v-if="data.type=='switch'" v-model="data.options.defaultValue" />
        <template v-if="data.type == 'html'">
          <!-- <div id="codeeditor" style="height: 100px; width: 100%;">{{data.options.defaultValue}}</div> -->
          <code-editor :key="data.key" v-model="data.options.defaultValue" height="200px" />
        </template>
        <div v-if="data.type!=='switch' && data.type!=='rate' && data.type!=='color'" style="font-size: 13px; line-height: 24px; color: #999;">
          若设置动态默认值请用 ##js代码## 格式填写
        </div>
      </el-form-item>

      <template v-if="Object.keys(data.options).indexOf('unit')>=0">
        <el-form-item label="单位">
          <el-input id="unit" v-model="data.options.unit" />
        </el-form-item>
        <el-form-item v-if="data.options.dataType=='number' || data.options.dataType=='integer' || data.options.dataType=='float' || data.options.dataType=='money'" label="数值转换">
          <el-input id="conversion" v-model="data.options.conversion" />
          <div class="tips">
            *0.01(前端以输入值*0.01存储)，配合单位使用
          </div>
        </el-form-item>
      </template>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item v-if="data.type == 'date'" id="dateType" label="显示类型">
          <el-select v-model="data.options.type" :popper-append-to-body="false">
            <el-option value="year" />
            <el-option value="month" />
            <el-option value="date" />
            <!-- <el-option value="dates" /> -->
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime" />
            <!-- <el-option value="datetimerange" />
            <el-option value="daterange" /> -->
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="data.type == 'time'" label="是否为范围选择">
          <el-switch
            v-model="data.options.isRange"
          />
        </el-form-item> -->
        <el-form-item v-if="data.type == 'date'" label="是否获取时间戳">
          <el-switch
            v-model="data.options.timestamp"
          />
        </el-form-item>
        <!-- <el-form-item v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')" label="占位内容">
          <el-input v-model="data.options.placeholder" />
        </el-form-item>
        <el-form-item v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'" label="开始时间占位内容">
          <el-input v-model="data.options.startPlaceholder" />
        </el-form-item>
        <el-form-item v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'" label="结束时间占位内容">
          <el-input v-model="data.options.endPlaceholder" />
        </el-form-item> -->
        <el-form-item label="格式">
          <el-input id="dateFormat" v-model="data.options.format" />
        </el-form-item>
        <el-form-item v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0" label="默认值">
          <el-time-picker
            v-if="!data.options.isRange"
            key="1"
            v-model="data.options.defaultValue"
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
            style="width: 100%;"
          />
          <el-time-picker
            v-if="data.options.isRange"
            key="2"
            v-model="data.options.defaultValue"
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
            style="width: 100%;"
            is-range
          />
        </el-form-item>
        <el-form-item v-if="data.type=='date'" label="默认值">
          <el-date-picker
            key="1"
            v-model="data.options.defaultValue"
            :type="data.options.type"
            :clearable="true"
            :value-format="data.options.timestamp ? 'timestamp' : data.options.format"
            :format="data.options.format"
            style="width: 100%"
            v-if="data.options.type == 'datetimerange' || data.options.type == 'daterange'"
          >
          </el-date-picker>
          <el-date-picker
            key="2"
            v-model="data.options.defaultValue"
            :type="data.options.type"
            :clearable="true"
            :value-format="data.options.timestamp ? 'timestamp' : data.options.format"
            :format="data.options.format"
            style="width: 100%"
            v-else
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="data.type == 'date'" label="最小值-最大值">
          <div style="position: absolute; left: 92px; top: -40px">
            <el-tooltip :content="DateMsg" placement="bottom" effect="light">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <el-date-picker
              v-model="data.options.minDate"
              :type="data.options.type"
              :clearable="true"
              value-format="yyyy-MM-dd"
              placeholder="最小值"
              style="width: 45%"
            />
            <el-date-picker
              v-model="data.options.maxDate"
              :type="data.options.type"
              :clearable="true"
              value-format="yyyy-MM-dd"
              placeholder="最大值"
              style="width: 45%"
            />
          </div>
        </el-form-item>
      </template>

      <template v-if="data.type=='imgupload'">
        <el-form-item label="是否多选">
          <el-switch v-model="data.options.multiple" />
        </el-form-item>
        <el-form-item label="允许上传多个">
          <el-switch v-model="data.options.limit" />
        </el-form-item>
        <!-- <el-form-item label="最大上传数">
          <el-input v-model.number="data.options.length" type="number"/>
        </el-form-item> -->
        <!-- <el-form-item label="使用七牛上传">
          <el-switch v-model="data.options.isQiniu"/>
        </el-form-item>
        <template v-if="data.options.isQiniu">
          <el-form-item :required="true" label="Domain">
            <el-input v-model="data.options.domain"/>
          </el-form-item>
          <el-form-item :required="true" label="获取七牛Token方法">
            <el-input v-model="data.options.tokenFunc"/>
          </el-form-item>
        </template> -->
        <template>
          <el-form-item :required="true" label="图片上传地址">
            <el-input id="uploadAction" v-model="data.options.action" />
          </el-form-item>
        </template>
      </template>

      <template v-if="data.type=='fileupload'">
        <el-form-item label="允许上传多个">
          <el-switch v-model="data.options.multiple" />
        </el-form-item>
        <el-form-item label="提示说明文字">
          <el-input v-model="data.options.tip" />
        </el-form-item>
        <el-form-item :required="true" label="上传地址">
          <el-input id="uploadAction" v-model="data.options.action" />
        </el-form-item>
      </template>

      <template v-if="data.type=='blank'">
        <el-form-item label="绑定数据类型">
          <el-select v-model="data.options.defaultType" :popper-append-to-body="false">
            <el-option value="String" label="字符" />
            <el-option value="Object" label="对象" />
            <el-option value="Array" label="数组" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'component'">
        <el-form-item label="是否引用模板">
          <el-switch v-model="data.options.isQuote" />
          <el-select v-show="data.options.isQuote" v-model="data.options.name">
            <el-option v-for="item in component_options" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义模板">
          <!-- <code-editor :key="data.key" mode="html" v-model="data.options.template" height="200px"></code-editor> -->
          <el-button :disabled="data.options.isQuote" style="width: 100%;" @click="handleSetTemplate">
            设置
          </el-button>
        </el-form-item>

        <code-dialog ref="codeDialog" mode="html" @on-confirm="handleTemplateConfirm" />
      </template>

      <template v-if="data.type == 'grid'">
        <el-form-item label="栅格间隔">
          <el-input v-model.number="data.options.gutter" type="number" />
        </el-form-item>
        <el-form-item label="Flex布局">
          <el-switch v-model="data.options.flex" />
        </el-form-item>
        <el-form-item label="响应式布局">
          <el-switch v-model="data.options.responsive" />
        </el-form-item>
        <!-- <el-form-item label="列配置项">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.columns" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont-fm icon-icon_bars" /></i>

              <el-input v-if="!data.options.responsive" placeholder="栅格值" size="mini" style="width: 100px;" type="number" v-model.number="item.span" />

              <template v-if="data.options.responsive">
                <div style="display: inline-block;">
                  <div style="display: flex; flex-direction: column; margin:0 10px 10px 10px;">
                    <span>
                      <span style="width: 25px; display: inline-block;">xs: </span><el-input placeholder="xs" size="mini" style="width: 100px;" type="number" v-model.number="item.xs" />
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'<768px'" />
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">sm: </span><el-input placeholder="sm" size="mini" style="width: 100px;" type="number" v-model.number="item.sm" />
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥768px'" />
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">md: </span><el-input placeholder="md" size="mini" style="width: 100px;" type="number" v-model.number="item.md" />
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥992px'" />
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">lg: </span><el-input placeholder="lg" size="mini" style="width: 100px;" type="number" v-model.number="item.lg" />
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥1200px'" />
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">xl: </span><el-input placeholder="xl" size="mini" style="width: 100px;" type="number" v-model.number="item.xl" />
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥1920px'" />
                    </span>
                  </div>
                </div>
              </template>
              <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" />
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddColumn">
              添加列
            </el-button>
          </div>
        </el-form-item> -->
        <el-form-item v-if="data.options.flex" label="水平排列方式">
          <el-select v-model="data.options.justify" :popper-append-to-body="false">
            <el-option value="start" label="左对齐" />
            <el-option value="end" label="右对齐" />
            <el-option value="center" label="居中" />
            <el-option value="space-around" label="两侧间隔相等" />
            <el-option value="space-between" label="两端对齐" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.options.flex" label="垂直排列方式">
          <el-select v-model="data.options.align" :popper-append-to-body="false">
            <el-option value="top" label="顶部对齐" />
            <el-option value="middle" label="居中" />
            <el-option value="bottom" label="底部对齐" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'col'">
        <el-form-item label="栅格占据的列数">
          <el-input-number v-model="data.options.span"  :step="1" :min="1" :max="24"></el-input-number>
        </el-form-item>
        <el-form-item label="响应式栅格数">
          <div>
            <span style="width: 25px; display: inline-block;">xs: </span>
            <el-input-number v-model="data.options.xs"  :step="1" :min="1" :max="24" size="mini"></el-input-number>
            <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'<768px'"></pre>
          </div>
          <div>
            <span style="width: 25px; display: inline-block;">sm: </span>
            <el-input-number v-model="data.options.sm"  :step="1" :min="1" :max="24" size="mini"></el-input-number>
            <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥768px'"></pre>
          </div>
          <div>
            <span style="width: 25px; display: inline-block;">md: </span>
            <el-input-number v-model="data.options.md"  :step="1" :min="1" :max="24" size="mini"></el-input-number>
            <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥992px'"></pre>
          </div>
          <div>
            <span style="width: 25px; display: inline-block;">lg: </span>
            <el-input-number v-model="data.options.lg"  :step="1" :min="1" :max="24" size="mini"></el-input-number>
            <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥1200px'"></pre>
          </div>
          <div>
            <span style="width: 25px; display: inline-block;">xl: </span>
            <el-input-number v-model="data.options.xl"  :step="1" :min="1" :max="24" size="mini"></el-input-number>
            <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥1920px'"></pre>
          </div>
        </el-form-item>
        <el-form-item label="栅格左侧的间隔格数">
          <el-input-number v-model="data.options.offset"  :step="1" :min="0" :max="24"></el-input-number>
        </el-form-item>
        <el-form-item label="栅格向右移动格数">
          <el-input-number v-model="data.options.push"  :step="1" :min="0" :max="24"></el-input-number>
        </el-form-item>
        <el-form-item label="栅格向左移动格数">
          <el-input-number v-model="data.options.pull"  :step="1" :min="0" :max="24"></el-input-number>
        </el-form-item>
      </template>

      <template v-if="data.type == 'tabs'">
        <el-form-item label="风格类型" size="mini">
          <el-radio-group v-model="data.options.type">
            <el-radio-button label="">
              默认
            </el-radio-button>
            <el-radio-button label="card">
              选项卡
            </el-radio-button>
            <el-radio-button label="border-card">
              卡片化
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项卡位置">
          <el-radio-group v-model="data.options.tabPosition" size="mini">
            <el-radio-button label="top">
              顶部
            </el-radio-button>
            <el-radio-button label="left">
              左侧
            </el-radio-button>
            <el-radio-button label="right">
              右侧
            </el-radio-button>
            <el-radio-button label="bottom">
              底部
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签配置项">
          <draggable
            :list="data.tabs"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            tag="ul"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.tabs" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont-fm icon-icon_bars" /></i>
              <el-input v-model="item.label" placeholder="标签名称" size="mini" style="width: 200px;" />

              <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddTab">
              添加标签
            </el-button>
          </div>
        </el-form-item>
      </template>

      <template v-if="data.type == 'report'">
        <el-form-item label="表格边框宽度">
          <el-input-number v-model="data.options.borderWidth" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="表格边框颜色">
          <el-color-picker
            v-model="data.options.borderColor"
          />
        </el-form-item>
      </template>

      <!-- <template v-if="data.type=='money'">
        <el-form-item label="默认值">
          <el-input v-model.number="data.options.defaultValue" />
          <div style="font-size: 13px; line-height: 24px; color: #999;">
            若设置动态默认值请用 ##js代码## 格式填写
          </div>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="data.options.unit" />
          <div class="tips">
            *10000(前端以万元为单位录入)
          </div>
        </el-form-item>
      </template> -->

      <template v-if="data.type=='carousel'">
        <el-form-item label="自动切换">
          <el-switch v-model="data.options.autoplay" />
          <div v-show="data.options.autoplay">
            <el-input v-model="data.options.interval" size="small">
              <template slot="prepend">
                时间间隔
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="触发方式">
          <el-radio v-model="data.options.trigger" label="hover" />
          <el-radio v-model="data.options.trigger" label="click" />
        </el-form-item>
        <el-form-item label="箭头显示时机">
          <el-radio v-model="data.options.arrow" label="always" />
          <el-radio v-model="data.options.arrow" label="hover" />
          <el-radio v-model="data.options.arrow" label="never" />
        </el-form-item>
        <el-form-item label="方向">
          <el-radio v-model="data.options.direction" label="horizontal" />
          <el-radio v-model="data.options.direction" label="vertical" />
        </el-form-item>
      </template>

      <template v-if="data.type=='select2' || data.type=='innerobject' || data.type=='outerobject'">
        <el-form-item v-if="data.type=='select2'" label="是否多选">
          <el-switch v-model="data.options.multiple" />
        </el-form-item>
        <template v-if="data.type=='innerobject' || data.type=='outerobject'">
          <el-form-item label="是否可搜索">
            <el-switch v-model="data.options.search" />
          </el-form-item>
          <el-form-item label="是否可查询">
            <el-switch v-model="data.options.query" />
          </el-form-item>
        </template>
        <el-form-item label="业务对象">
          <el-row>
            <el-col :span="5">
              项目
            </el-col>
            <el-col :span="19">
              <el-select id="proj_code" v-model="data.options.proj_code" clearable placeholder="请选择" @change="changeProj">
                <el-option
                  v-for="item in proj_options"
                  :key="item.proj_code"
                  :label="item.proj_name"
                  :value="item.proj_code"
                >
                  <span style="float: left">{{ item.proj_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.proj_code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              对象
            </el-col>
            <el-col :span="19">
              <el-select id="object_code" v-model="data.options.object_code" filterable clearable placeholder="请选择" style="margin-top: 5px;" @change="changeObj">
                <el-option
                  v-for="item in object_options"
                  :key="item.object_code"
                  :label="item.object_name"
                  :value="item.object_code"
                >
                  <span style="float: left">{{ item.object_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.object_code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              界面
            </el-col>
            <el-col :span="19">
              <el-select id="page_code" v-model="data.options.page_code" filterable clearable placeholder="请选择" style="margin-top: 5px;" @change="changePage">
                <el-option
                  v-for="item in page_options"
                  :key="item.page_code"
                  :label="item.page_name"
                  :value="item.page_code"
                >
                  <span style="float: left">{{ item.page_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.page_code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="data.type=='select2'" label="保存值 - 显示值">
          <el-row>
            <el-col :span="5">
              保存值
            </el-col>
            <el-col :span="19">
              <el-select id="select-value" v-model="data.options.option.value" filterable clearable placeholder="保存值" @focus="handlerFocus">
                <el-option v-for="(item, index) in select2_option" :key="index" :label="item.label" :value="item.prop">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.prop }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              显示值
            </el-col>
            <el-col :span="19">
              <el-select id="select-label" v-model="data.options.option.label" filterable clearable placeholder="显示值" style="margin-top: 5px;" @focus="handlerFocus">
                <el-option v-for="(item, index) in select2_option" :key="index" :label="item.label" :value="item.prop">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.prop }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </template>

      <el-form-item v-if="Object.keys(data.options).includes('customClass')" label="自定义Class">
        <el-input v-model="data.options.customClass" clearable />
      </el-form-item>

      <el-form-item label="操作属性">
        <el-checkbox v-if="Object.keys(data.options).indexOf('dataBind')>=0 && !data.options.tableColumn" v-model="data.options.dataBind" :disabled="data.type != 'blank'">
          数据绑定
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('hidden')>=0 && !data.options.tableColumn" v-model="data.options.hidden">
          隐藏
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('readonly')>=0" v-model="data.options.readonly" :disabled="data.is_property">
          完全只读
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('disabled')>=0" v-model="data.options.disabled" :disabled="data.is_property">
          禁用
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('editable')>=0" v-model="data.options.editable">
          文本框可输入
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('clearable')>=0" v-model="data.options.clearable">
          显示清除按钮
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('arrowControl')>=0" v-model="data.options.arrowControl">
          使用箭头进行时间选择
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('isDelete')>=0" v-model="data.options.isDelete">
          删除
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('isEdit')>=0" v-model="data.options.isEdit">
          编辑
        </el-checkbox>
        <el-checkbox v-if="Object.keys(data.options).indexOf('showPassword')>=0" v-model="data.options.showPassword">
          显示密码
        </el-checkbox>
      </el-form-item>

      <template v-if="!(['grid','tabs', 'report', 'divider', 'td', 'col'].includes(data.type))">
        <el-form-item label="校验">
          <div v-if="Object.keys(data.options).indexOf('required')>=0" class="validate-block">
            <el-checkbox id="required" v-model="data.options.required">
              必填
            </el-checkbox>
            <el-input v-if="data.options.required" v-model="data.options.requiredMessage" clearable size="small" class="message-input" placeholder="自定义错误提示" />
          </div>

          <div v-if="Object.keys(data.options).indexOf('pattern')>=0" class="validate-block">
            <el-checkbox v-model="data.options.patternCheck" style="margin-right: 10px;" />
            <el-input v-model.lazy="data.options.pattern" :disabled="!data.options.patternCheck" size="small" placeholder="填写正则表达式" />
            <el-input v-if="data.options.patternCheck" v-model="data.options.patternMessage" clearable size="small" class="message-input" placeholder="自定义错误提示" />
          </div>
        </el-form-item>
      </template>
      <widget-event :data="data" />
    </el-form>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" title="设置默认值" :close-on-click-modal="false" append-to-body>
      <div style="margin-bottom: 15px; font-size: 13px; line-height: 24px; color: #999;">
        请从前端存储中取值，若设置动态默认值请用 ##js代码## 格式填写
      </div>
      <el-form label-position="right" label-width="80px">
        <el-form-item :model="defaultValue" label="value">
          <pythonCodemirror :prop_code="defaultValue.value" param-code="value" placeholder="" code-mode="javascript" @get_code="get_code($event)" />
        </el-form-item>
        <el-form-item label="label">
          <pythonCodemirror :prop_code="defaultValue.label" param-code="label" placeholder="" code-mode="javascript" @get_code="get_code($event)" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getValue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <div v-else class="empty">
    请添加字段
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import CodeEditor from './CodeEditor'
import WidgetEvent from './WidgetEvent'
import CodeDialog from './CodeDialog'
import pythonCodemirror from '../pythonCodemirror'
import { isJSON } from '@/library/js/validate'
import templates from '@/library/ui'

export default {
  components: {
    Draggable,
    CodeEditor,
    WidgetEvent,
    CodeDialog,
    pythonCodemirror
  },
  props: ['data', 'designFields', 'remote'],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      },
      dialogVisible: false,
      isChangeValue: false,
      changeIndex: 1,
      showErrorMsg: false,
      defaultValue: {
        value: '',
        label: ''
      },
      proj_options: [],
      object_options: [],
      select2_option: [],
      page_options: [],
      component_options: templates,
      DateMsg: '用于移动端，若不设置则移动端默认的最小时间为十年前，最大时间为十年后'
    }
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    'data.name_model': function(val) {
      if (val) {
        this.data.name = val.label
        this.data.model = val.prop
        if (val.is_property) {
          if (Object.keys(this.data.options).indexOf('disabled') >= 0) {
            this.data.options.disabled = true
          }
          if (Object.keys(this.data.options).indexOf('readonly') >= 0) {
            this.data.options.readonly = true
          }
          this.data.is_property = true
        } else {
          if (Object.keys(this.data.options).indexOf('disabled') >= 0) {
            this.data.options.disabled = false
          }
          if (Object.keys(this.data.options).indexOf('readonly') >= 0) {
            this.data.options.readonly = false
          }
          this.data.is_property = false
        }
        this.data.uselist = val['uselist'] || false
        delete val['data_format']
        delete val['is_object']
        delete val['is_property']
        delete val['is_primary']
        delete val['value']
        delete val['object_form']
        delete val['type']
        delete val['uselist']
        delete val['can_query']
      // this.data.design = val.design
      }
    },
    'data.model': function(val) {
      if (val) {
        this.data.name_model.prop = val
      }
    },
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) { this.data.options.defaultValue = '' }
        }
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.requiredMessage': function(val) {
      this.validateRequired(this.data && this.data.options ? this.data.options.required : false)
    },
    // 'data.options.dataType': function(val) {
    //   this.validateDataType(val)
    // },
    'data.options.dataTypeCheck': function(val) {
      this.validateDataType(this.data && this.data.options ? this.data.options.dataType : '')
    },
    'data.options.dataTypeMessage': function(val) {
      this.validateDataType(this.data && this.data.options ? this.data.options.dataType : '')
    },
    'data.options.pattern': function(val) {
      this.valiatePattern(val)
    },
    'data.options.patternCheck': function(val) {
      this.valiatePattern(this.data && this.data.options ? this.data.options.pattern : '')
    },
    'data.options.patternMessage': function(val) {
      this.valiatePattern(this.data && this.data.options ? this.data.options.pattern : '')
    },
    'data.name': function(val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
      if (val) {
        this.data.name_model.label = val
      }
    },
    'data.options.type': function(val) {
      // if (val === 'dates') {
      //   this.data.options.defaultValue = null
      // } else {
      //   this.data.options.defaultValue = new Date()
      // }
      switch(val) {
        case 'year':
          this.data.options.defaultValue = new Date(new Date().getFullYear(), 0, 1)
          break
        case 'month':
          this.data.options.defaultValue = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          break
        default:
          this.data.options.defaultValue = new Date()
      }
    }
  },
  created() {
    if (this.show) {
      if (this.data.type === 'select2' || this.data.type === 'innerobject' || this.data.type === 'outerobject') {
        this.$Apis.project.project_list().then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.proj_options = response.payload.items
          }
        })
        if (this.data.options.proj_code) {
          this.$Apis.object.object_list(this.data.options.proj_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.object_options = response.payload.items
            }
          })
        }
        if (this.data.options.object_code) {
          this.$Apis.object.page_list_by_code(this.data.options.proj_code, this.data.options.object_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.page_options = response.payload.items
            }
          })
          this.$Apis.object.get_headers_by_code(this.data.options.proj_code, this.data.options.object_code, this.data.options.page_code, true).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.select2_option = response.payload
            }
          })
        }
      }
    }
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else if (this.data.type === 'tabs') {
        this.data.tabs.splice(index, 1)
      } else {
        if (!this.data.options.remote && this.data.options.options[index].value) {
          this.data.options.defaultValue = typeof this.data.options.defaultValue === 'string' ? '' : []
        }

        this.data.options.options.splice(index, 1)
      }
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: '新选项',
          label: '新选项'
        })
      } else {
        this.data.options.options.push({
          value: '新选项'
        })
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    handleAddTab() {
      const length = this.data.tabs.length

      this.data.tabs.push({
        label: '标签' + (length + 1),
        name: 'tab_' + new Date().getTime(),
        list: []
      })
    },
    generateRule() {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
      }
    },

    handleSetTemplate() {
      this.$refs.codeDialog.open(this.data.options.template)
    },

    handleTemplateConfirm(value) {
      this.data.options.template = value

      this.$refs.codeDialog.close()
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = { required: true, message: this.data.options.requiredMessage ? this.data.options.requiredMessage : '必须填写' }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType(val) {
      if (!this.show) {
        return false
      }

      if (val && (this.data.options.dataTypeCheck || !Object.keys(this.data.options).includes('dataTypeCheck'))) {
        if (this.data.options.dataType === 'money') {
          this.validator.type = { type: 'number', message: this.data.options.dataTypeMessage ? this.data.options.dataTypeMessage : '格式不正确' }
        } else {
          this.validator.type = { type: val, message: this.data.options.dataTypeMessage ? this.data.options.dataTypeMessage : '格式不正确' }
        }
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern(val) {
      if (!this.show) {
        return false
      }

      if (val && (this.data.options.patternCheck || !Object.keys(this.data.options).includes('patternCheck'))) {
        this.validator.pattern = { pattern: val, message: this.data.options.patternMessage ? this.data.options.patternMessage : '格式不匹配' }
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    },
    setDefaultValue() {
      this.dialogVisible = !this.dialogVisible
      this.isChangeValue = false
    },
    get_code($event) {
      for (var key in $event) {
        this.defaultValue[key] = $event[key]
      }
    },
    getValue() {
      this.dialogVisible = false
      if (!this.isChangeValue) {
        if (this.data.type !== 'cascader') {
          this.data.options.options.push({
            value: this.defaultValue.value,
            label: this.defaultValue.label
          })
        } else {
          this.data.options.remoteOptions.push({
            value: this.defaultValue.value,
            label: this.defaultValue.label
          })
          if (this.data.options.emitPath) {
            this.data.options.defaultValue = [this.defaultValue.value]
          } else {
            this.data.options.defaultValue = this.defaultValue.value
          }
        }
      } else {
        if (this.data.type === 'cascader') {
          this.data.options.remoteOptions[this.changeIndex] = this.defaultValue
        } else {
          this.data.options.options[this.changeIndex] = this.defaultValue
        }
      }
    },
    changeDefaultValue(index) {
      this.dialogVisible = !this.dialogVisible
      this.isChangeValue = true
      this.changeIndex = index
      this.defaultValue = this.data.options.options[index]
    },
    validateParams() {
      if (this.data.options.remoteParams && !isJSON(this.data.options.remoteParams)) {
        this.showErrorMsg = true
      } else {
        this.showErrorMsg = false
      }
    },
    cascaderOptionsRemove(index) {
      this.data.options.remoteOptions.splice(index, 1)
      if (this.data.options.emitPath) {
        this.data.options.defaultValue = []
      } else {
        this.data.options.defaultValue = ''
      }
    },
    changeEmitPath(val) {
      if (val) {
        this.data.options.defaultValue = [this.defaultValue.value]
      } else {
        this.data.options.defaultValue = this.defaultValue.value
      }
    },
    changeRemote(val) {
      if (val && this.data.options.remoteOptions.length < 1) {
        this.data.options.remoteOptions.push({
          value: this.defaultValue.value,
          label: this.defaultValue.label
        })
      }
    },
    changeProj(val) {
      this.data.options.object_code = null
      this.data.options.page_code = null
      this.data.options.option = {}
      if (val) {
        this.$Apis.object.object_list(val).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.object_options = response.payload.items
          }
        })
      } else {
        this.object_options = []
        this.page_options = []
        this.select2_option = []
      }
    },
    changeObj(val) {
      this.data.options.page_code = null
      this.data.options.option = {}
      const object_code = val
      if (val) {
        this.$Apis.object.page_list_by_code(this.data.options.proj_code, object_code).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.page_options = response.payload.items
          }
        })
      } else {
        this.page_options = []
        this.select2_option = []
      }
    },
    changePage(val) {
      this.data.options.option = {}
      if (!val) {
        this.select2_option = []
      }
    },
    handlerFocus() {
      if (this.select2_option.length < 1) {
        this.$Apis.object.get_headers_by_code(this.data.options.proj_code, this.data.options.object_code, this.data.options.page_code, true).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.select2_option = response.payload
          }
        })
      }
    },
    handleClearSelect() {
      if (this.data.type=='checkbox' || (this.data.type=='select' && this.data.options.multiple)) {
        this.data.options.defaultValue = []
      } else {
        this.data.options.defaultValue = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.remote-databox {
  display: flex;
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  .title {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-right: 0;
    border-radius: 4px 0 0 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
    font-size: 12px;
  }
  .el-select {
    flex: 1;
    & ::v-deep.el-input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  & ::v-deep.el-textarea__inner {
    border-radius: 0;
  }
}
.el-form .el-button.is-plain:hover,
.el-form .el-button.is-plain:focus {
  color: #ffffff;
}
</style>
