const areaSelect = document.querySelector('.areaSelect')
const hotAreaList = document.querySelector('.hotAreaList')
const areaName = document.querySelector('.areaName')
const mainList = document.querySelector('.mainList')
const pageId = document.getElementById('pageId')
const goTop = document.querySelector('.goTop')
let showData = []
let data

areaSelect.addEventListener('change', showArea, false)
hotAreaList.addEventListener('click', showArea, false)
pageId.addEventListener('click', switchPage, false)
goTop.addEventListener('click', top, false)

//  撈取API資料
const xhr = new XMLHttpRequest()

xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true)
xhr.send(null)

xhr.onload = function () {
  data = JSON.parse(xhr.responseText)
  showData = data.result.records
  addSelect()
  contentList(showData)
  pagination(showData, 1)
}

//  行政區加入選單
function addSelect () {
  const len = showData.length
  let str = ''
  let selectList = []

  //  將地區資料push到selectList
  for (let i = 0; i < len; i++) {
    selectList.push(showData[i].Zone)
    selectList = ([...new Set(selectList)])
  }
  for (let i = 0; i < selectList.length; i++) {
    str += '<option>' + selectList[i] + '</option>'
  }
  areaSelect.innerHTML += str
}

function showArea (e) {
  if (e.target.nodeName === 'SELECT' || e.target.nodeName === 'INPUT') {
    // eslint-disable-next-line no-var
    var Zone = areaName.textContent = e.target.value
  }
  setContent(Zone)
}

//  點擊地區顯示行政區內容
function setContent (areaName) {
  const Ary = []
  let str = ''

  for (let i = 0; i < showData.length; i++) {
    if (showData[i].Zone === areaName) {
      Ary.push(showData[i])
    }
  }
  for (let i = 0; i < Ary.length; i++) {
    str += '<li class="contentList"><div class="list_img" style="background-image: url(' + Ary[i].Picture1 + ');"><h4>' + Ary[i].Name + '</h4><h5>' + Ary[i].Zone + '</h5></div><ul class="list_info"><li><img src="/img/icons_clock.png" alt="">' + Ary[i].Opentime + '</li><li><img src="/img/icons_pin.png" alt="">' + Ary[i].Add + '</li><li><img src="/img/icons_phone.png" alt="">' + Ary[i].Tel + '</li></ul><span class="ticket"><img src="/img/icons_tag.png" alt="">' + Ary[i].Ticketinfo + '</span></li>'
  }
  mainList.innerHTML = str
  pagination(Ary, 1)
}

// 顯示全部行政區
function contentList (data) {
  // areaName.textContent = '行政區';
  let str = ''

  data.forEach((item) => {
    str += '<li class="contentList"><div class="list_img" style="background-image: url(' + item.Picture1 + ');"><h4>' + item.Name + '</h4><h5>' + item.Zone + '</h5></div><ul class="list_info"><li><img src="/img/icons_clock.png" alt="">' + item.Opentime + '</li><li><img src="/img/icons_pin.png" alt="">' + item.Add + '</li><li><img src="/img/icons_phone.png" alt="">' + item.Tel + '</li></ul><span class="ticket"><img src="/img/icons_tag.png" alt="">' + item.Ticketinfo + '</span></li>'
  })
  mainList.innerHTML = str
}

// 製作分頁
function pagination (showData, nowPage) {
  // 取得資料長度
  const dataTotal = showData.length

  // 要顯示在畫面上的資料數量，預設每一頁只顯示五筆資料。
  const perpage = 10

  // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
  // 這邊要注意，因為有可能會出現餘數，所以要無條件進位。
  const pageTotal = Math.ceil(dataTotal / perpage)
  console.log(`全部資料:${pageTotal} 每一頁顯示:${perpage}筆`)

  // 當前頁數
  let currentPage = nowPage

  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
  if (currentPage > pageTotal) {
    currentPage = pageTotal
  }

  // 最小值 最大值
  const minData = (currentPage * perpage) - perpage + 1
  const maxData = (currentPage * perpage)

  const data = []

  // 使用索引來判斷資料位子，所以要使用 index
  showData.forEach((item, index) => {
    // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
    const num = index + 1

    if (num >= minData && num <= maxData) {
      data.push(item)
    }
  })

  // 用物件方式傳遞資料
  const page = {
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal
  }
  contentList(data)
  pageBtn(page)
}

function pageBtn (page) {
  let str = ''
  const total = page.pageTotal

  if (page.hasPage) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">Previous</a></li>`
  } else {
    str += '<li class="page-item disabled"><span class="page-link">Previous</span></li>'
  }

  for (let i = 1; i <= total; i++) {
    if (Number(page.currentPage) === i) {
      str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
    } else {
      str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
    }
  };

  if (page.hasNext) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`
  } else {
    str += '<li class="page-item disabled"><span class="page-link">Next</span></li>'
  }

  pageId.innerHTML = str
}

function switchPage (e) {
  e.preventDefault()
  if (e.target.nodeName !== 'A') return
  const page = e.target.dataset.page
  pagination(showData, page)
}
