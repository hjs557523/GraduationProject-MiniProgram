const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    // const second = date.getSeconds()

    // return {
    //     Year: year,
    //     Day: [year, month, day].map(formatNumber).join('-'),
    //     Time: [hour, minute].map(formatNumber).join(':')
    // }
    return [year, month, day].join('-')
};


const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
};

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
};


const strIsEmpty = str => {
  if(str != null && str != '' && str != undefined) {
    return false;
  }
  return true;
};

module.exports = {
  formatTime: formatTime,
  formatDateTime: formatDateTime,
  strIsEmpty: strIsEmpty,
};