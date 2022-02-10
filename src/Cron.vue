<template>
  <div class="cron">
    <el-select
      :value="objValue.freq"
      @change="onFreqChanged"
      :size="size"
      :disabled="disabled"
      class="minWidth80"
    >
      <el-option
        v-for="it in freqList"
        :key="it.value"
        :value="it.value"
        :label="it.label"
      />
    </el-select>

    <el-select
      v-if="isYear"
      :value="objValue.MM"
      @change="onMonthOfYearChanged"
      :multiple="multiple"
      :size="size"
      :disabled="disabled"
      class="minWidth80"
      placeholder="月份"
    >
      <el-option
        v-for="it in monthOfYearList"
        :key="it.value"
        :value="it.value"
        :label="it.label"
      />
    </el-select>

    <el-select
      v-if="isYear || isMonth"
      :value="objValue.dd"
      @change="onDayOfMonthChanged"
      :multiple="multiple"
      :allowClear="isYear"
      :size="size"
      :disabled="disabled"
      class="minWidth80"
      placeholder="日期"
    >
      <el-option
        v-for="it in dayOfMonthList"
        :key="it.value"
        :value="it.value"
        :label="it.label"
        :disabled="
          multiple &&
            objValue.dd &&
            objValue.dd.length > 0 &&
            isIncludeExclusive === !it.exclusive
        "
      />
    </el-select>

    <el-select
      v-if="isWeek"
      :value="objValue.week"
      @change="onDayOfWeekChanged"
      :multiple="multiple"
      :size="size"
      :disabled="disabled"
      class="minWidth80"
      placeholder="日期"
    >
      <el-option
        v-for="it in dayOfWeekList"
        :key="it.value"
        :value="it.value"
        :label="it.label"
      />
    </el-select>

    <el-select
      v-if="isHours"
      :value="objValue.mm"
      @change="onMinuteOfHoursListChanged"
      :multiple="multiple"
      :size="size"
      :disabled="disabled"
      class="minWidth80"
      placeholder="分钟"
    >
      <el-option
        v-for="it in minuteOfHoursList"
        :key="it.value"
        :value="it.value"
        :label="it.label"
      />
    </el-select>

    <el-time-picker
      v-if="!isHours && !isCustom"
      :value="new Date(1990, 9, 9, objValue.HH, objValue.mm, objValue.ss)"
      @input="onFreqTimeChanged"
      :size="size"
      :disabled="disabled"
    />

    <el-input
      v-if="isCustom"
      :value="objValue.stringValue"
      @change="onStringValueChanged"
      :size="size"
      :disabled="disabled"
      class="width150"
    />
  </div>
</template>

<script>
import {
  cornFormat,
  cornStringify,
  checkIncludeExclusive,
  formatValue,
  freqList,
  dayOfWeekList,
  minuteOfHoursList,
  dayOfMonthList,
  monthOfYearList
} from "./utils";

export default {
  name: "cron",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: String,
    size: { type: String, default: "medium" },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false }
  },
  data() {
    const initValue = this.value || "0 0 0 * * ? *";
    return {
      objValue: cornFormat(initValue, this.multiple),
      strValue: initValue,
      freqList,
      dayOfWeekList,
      minuteOfHoursList,
      dayOfMonthList,
      monthOfYearList
    };
  },
  computed: {
    isYear() {
      return this.objValue.freq === "year";
    },
    isMonth() {
      return this.objValue.freq === "month";
    },
    isWeek() {
      return this.objValue.freq === "week";
    },
    isHours() {
      return this.objValue.freq === "everyHours";
    },
    isCustom() {
      return this.objValue.freq === "custom";
    },
    isIncludeExclusive() {
      return this.multiple && checkIncludeExclusive(this.objValue.dd);
    }
  },
  methods: {
    changeValue(newObj) {
      const cronString = cornStringify(newObj);
      this.strValue = cronString;
      this.objValue = newObj;
      this.$emit("change", cronString);
    },
    onFreqChanged(freq) {
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        freq,
        week: formatValue(freq === "week" ? [1] : [], this.multiple),
        dd: formatValue(freq === "month" ? [1] : [], this.multiple),
        mm: Array.isArray(oldObj.mm) ? 0 : oldObj.mm,
        ...(freq === "everyHours" && this.multiple
          ? {
              mm: [0]
            }
          : {}),
        MM: freq === "year" ? formatValue([1], this.multiple) : "*",
        ...(freq === "custom"
          ? {
              stringValue: cornStringify(oldObj)
            }
          : {})
      };
      this.changeValue(newObj);
    },
    onMonthOfYearChanged(MM) {
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        MM
      };
      this.changeValue(newObj);
    },
    onDayOfWeekChanged(week) {
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        week
      };
      this.changeValue(newObj);
    },
    onDayOfMonthChanged(dd) {
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        dd
      };
      this.changeValue(newObj);
    },
    onFreqTimeChanged(time) {
      const newTime = time
        ? { ss: time.getSeconds(), mm: time.getMinutes(), HH: time.getHours() }
        : { ss: 0, mm: 0, HH: 0 };
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        ...newTime
      };
      this.changeValue(newObj);
    },
    onMinuteOfHoursListChanged(mm) {
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        mm
      };
      this.changeValue(newObj);
    },
    onStringValueChanged(e) {
      const oldObj = this.objValue;
      const newObj = {
        ...oldObj,
        stringValue: e.target.value
      };
      this.changeValue(newObj);
    }
  },
  watch: {
    value(val) {
      if (val !== this.strValue) {
        this.strValue = val;
        debugger;
        console.log(val);
        this.objValue = cornFormat(val, this.multiple);
      }
    }
  }
};
</script>

<style scoped>
.cron .minWidth80 {
  min-width: 80px;
  margin-right: 10px;
}
.cron .width150 {
  width: 150px;
}
</style>
