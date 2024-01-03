/**
 * ---------------------------------------------------------------------------------
 * | 팝업 |
 * ---------------------------------------------------------------------------------
 **/

const start = document.getElementById("start");
const form = document.getElementById("form");

const timeArr = [
  "06:00 ~ 07:00",
  "07:00 ~ 08:00",
  "08:00 ~ 09:00",
  "09:00 ~ 10:00",
  "10:00 ~ 11:00",
  "11:00 ~ 12:00",
  "12:00 ~ 13:00",
  "13:00 ~ 14:00",
  "14:00 ~ 15:00",
  "15:00 ~ 16:00",
  "16:00 ~ 17:00",
  "17:00 ~ 18:00",
  "18:00 ~ 19:00",
  "19:00 ~ 20:00",
  "20:00 ~ 21:00",
  "21:00 ~ 22:00",
];

function showCurrentTime() {
  var currentDate = new Date();

  // 시, 분, 초를 가져오기
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();

  // 시, 분, 초를 두 자리 숫자로 표시
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // 현재 시간을 hh:mm:ss 형태로 표시
  var currentTime = hours + ":" + minutes + ":" + seconds;

  const timeEl = document.getElementById("time");
  timeEl.innerText = currentTime;

  // 1초(1000밀리세컨드)마다 함수를 호출하여 계속해서 시간을 업데이트
  setTimeout(showCurrentTime, 10);
}

window.onload = async () => {
  chrome.storage.sync.get(null, async (values) => {
    const summary = document.getElementById("summary");

    summary.innerHTML = `${values.year}년 ${values.month}월 ${values.day}일 ${
      timeArr[values.time]
    } 시에 ${values.court}번 코트를 예약합니다.`;
  });
};

chrome.storage.sync.get(null, (values) => {
  Object.entries(values).forEach(([name, value]) => {
    if (form[name]) {
      form[name].value = value;
    }
  });
});

form.addEventListener("change", () => {
  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);

  chrome.storage.sync.set({ ...formProps });
});

// start.addEventListener("click", async () => {
//   chrome.storage.sync.get(null, async (values) => {
//     const summary = document.getElementById("summary");

//     summary.innerHTML = `${values.year}년 ${values.month}월 ${values.day}일 ${
//       timeArr[values.time]
//     } / ${values.court}번 코트로 자동 예약을 합니다.`;
//   });

//   let [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true,
//   });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: async () => {
//       try {
//         chrome.storage.sync.get(null, async (storedValues) => {
//           const { court, day, month, time, year } = storedValues;

//           console.log("### 저장된 입력값", storedValues);

//           if (!court || !day || !month || !time || !year) {
//             alert("입력값을 확인해주세요.");
//             return;
//           }

//           window.location.reload();
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     },
//   });
// });
