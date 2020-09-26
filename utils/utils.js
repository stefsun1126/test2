import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
import React from 'react';
// import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import { async } from 'q';
// import mergeObject from './mergeObject';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function isEmpty(val) {
  return val === '' || val === undefined;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function toSnakeCase(str) {
  if (!str) return '';

  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}_${b.toLowerCase()}`)
    .replace(/[^A-Za-z0-9]+|_+/g, '_')
    .toLowerCase();
}

export function formatThousand(val) {
  return val ? val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '';
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function generateId() {
  return (Math.random() * 1e20).toString(36);
}

export function removingUndefinedFields(obj) {
  if (obj) {
    const temp = obj;
    Object.keys(temp).forEach(
      key => (temp[key] === '' || temp[key] === undefined) && delete temp[key]
    );
    return temp;
  }
  return obj;
}

export function pick(obj, keys) {
  return keys
    .map(k => (k in obj ? { [k]: obj[k] } : {}))
    .reduce((res, o) => Object.assign(res, o), {});
}

export function isEqual(a, b) {
  /* eslint-disable */
  let p, t;
  for (p in a) {
    if (typeof b[p] === 'undefined') {
      return false;
    }
    if (b[p] && !a[p]) {
      return false;
    }
    t = typeof a[p];
    if (t === 'object' && !isEqual(a[p], b[p])) {
      return false;
    }
    if (t === 'function' && (typeof b[p] === 'undefined' || a[p].toString() !== b[p].toString())) {
      return false;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (typeof a[p] === 'undefined') {
      return false;
    }
  }
  return true;
  /* eslint-enable */
}

/**
 * 数组扁平化
 * @param  {Array} input   要处理的数组
 * @param  {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释
 * @param  {Array} output  这是为了方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
export function flatten(input, shallow, strict, oriOutput) {
  // 递归使用的时候会用到output
  const output = oriOutput || [];
  let idx = output.length;

  for (let i = 0, len = input.length; i < len; i += 1) {
    const value = input[i];
    // 如果是数组，就进行处理
    if (Array.isArray(value)) {
      // 如果是只扁平一层，遍历该数组，依此填入 output
      if (shallow) {
        let j = 0;
        const { length } = value;
        while (j < length) {
          // eslint-disable-next-line no-plusplus
          output[idx++] = value[j++];
        }
      }
      // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
      else {
        flatten(value, shallow, strict, output);
        idx = output.length;
      }
    }
    // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
    else if (!strict) {
      // eslint-disable-next-line no-plusplus
      output[idx++] = value;
    }
  }

  return output;
}

// 處理每個 form 的 get Value

export function getSubFormValue(form, key, scroll = true) {
  if (form) {
    return new Promise(resolve => {
      form[scroll ? 'validateFieldsAndScroll' : 'validateFields'](
        { scroll: { offsetTop: 80, offsetBottom: 100 } }, // 表單頁最下方多了一條 FooterToolbar 會被擋住，補上 offsetBottom
        (errs, fields) => {
          if (key) {
            resolve({ errs, fields: { [key]: fields } });
          } else {
            resolve({ errs, fields });
          }
        }
      );
    });
  }
  return new Promise(resolve => {
    resolve({ errs: null, fields: {} });
  });
}

// 攤平 每個 form
export function formFlatten(arr) {
  return arr.reduce((acc, value) => {
    const newFields = mergeObject(acc.fields, value.fields);
    const newErrs = Object.assign({}, acc.errs, value.errs);
    return Object.assign(acc, { fields: newFields }, { errs: newErrs });
  });
}

// 攤平每個子項
// [{form: form or [form], key: ''}]
function itemForm(item) {
  if (item) {
    if (item.constructor === Array) {
      return item.map(i => itemForm(i, item.key));
    }
    if (item.form) {
      if (item.form.constructor === Array)
        return item.form.map(form => getSubFormValue.bind(null, form, item.key));
      return [getSubFormValue.bind(null, item.form, item.key)];
    }
    return [getSubFormValue.bind(null, item, null)];
  }
  return [];
}

export function formatMoment(data, format) {
  if (data && format) {
    const newVal = cloneDeep(data);
    const valAry = Object.entries(newVal);
    const Moment = moment();
    valAry.forEach(item => {
      if (item[1] && item[1].constructor === Object) {
        newVal[item[0]] = formatMoment(item[1], format);
      }
      if (item[1] && item[1].constructor === Moment.constructor) {
        newVal[item[0]] = item[1].format(format);
      }
    });
    return newVal;
  }
  return data;
}

export async function getAllFormValue(arr = [], dateFormat) {
  let allForm = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    allForm = allForm.concat(itemForm(item));
  }
  // allForm = allForm.filter(item => typeof item !== 'function');
  // const result = await Promise.all(allForm);
  const result = [];
  let errFlag = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < allForm.length; i++) {
    const item = allForm[i];
    if (typeof item === 'function') {
      // eslint-disable-next-line no-await-in-loop
      const r = await item(!errFlag);
      if (r.errs) {
        errFlag = true;
      }
      result.push(r);
    }
  }
  const { fields: values, errs: err } = formFlatten(result);

  if (!err || Object.keys(err).length === 0) {
    return formatMoment(values, dateFormat);
  }
  return null;
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

export const zhTWEdited = (_, context) => {
  if (context === 'braft-editor') {
    return {
      base: {
        remove: '刪除',
        cancel: '取消',
        confirm: '確定',
        inert: '插入',
        width: '寬度',
        height: '高度',
      },
      controls: {
        clear: '清除内容',
        undo: '復原',
        redo: '取消復原',
        fontSize: '字型大小',
        color: '顏色',
        textColor: '文字顏色',
        backgroundColor: '背景顏色',
        tempColors: '臨時顏色',
        bold: '加粗',
        lineHeight: '行高',
        letterSpacing: '字間距',
        textIndent: '段落縮排',
        increaseIndent: '增加縮排',
        decreaseIndent: '减少縮排',
        border: '邊框',
        italic: '斜體',
        underline: '底線',
        strikeThrough: '刪除線',
        fontFamily: '字體',
        textAlign: '文字對齊',
        alignLeft: '置左',
        alignCenter: '置中',
        alignRight: '置右',
        alignJustify: '兩端對齊',
        floatLeft: '左浮動',
        floatRight: '右浮動',
        superScript: '上標',
        subScript: '下標',
        removeStyles: '清除樣式',
        headings: '標題',
        header: '標題',
        normal: '標題大小',
        orderedList: '編號清單',
        unorderedList: '項目符號清單',
        blockQuote: '引用',
        code: '代碼',
        link: '鏈接',
        unlink: '清除鏈接',
        hr: '水平線',
        media: '媒體',
        mediaLibirary: '媒體庫',
        emoji: '表情',
        fullscreen: '全螢幕',
        exitFullscreen: '退出全螢幕',
      },
      linkEditor: {
        inputPlaceHolder: '輸入鏈接地址',
        inputWithEnterPlaceHolder: '輸入鏈接地址並回車',
        openInNewWindow: '在新窗口打開',
        removeLink: '移除鏈接',
      },
      audioPlayer: {
        title: '播放音頻文件',
      },
      videoPlayer: {
        title: '播放視頻文件',
        embedTitle: '嵌入式媒體',
      },
      media: {
        image: '圖像',
        video: '影片',
        audio: '音訊',
        embed: '嵌入式媒體',
      },
    };
  }

  return null;
};
