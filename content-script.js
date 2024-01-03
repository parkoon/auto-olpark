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

  // 특정 시간에 도달하면 alert 보여주기
  if (currentTime === "09:00:00") {
    window.location.reload();
  }

  // 1초(1000밀리세컨드)마다 함수를 호출하여 계속해서 시간을 업데이트
  setTimeout(showCurrentTime, 10);
}

const forceClick = (fnString) => {
  return new Promise((resolve) => {
    const dateButton = document.createElement("button");
    dateButton.setAttribute("onclick", fnString);
    document.body.appendChild(dateButton);
    dateButton.click();
    dateButton.addEventListener("click", () => {
      console.log("clicked");
      resolve();
    });
  });
};

let calendarRenderIntervalId = 0;
let timeClickIntervalId = 0;
let courtClickIntervalId = 0;

window.onload = () => {
  const href = window.location.href;
  console.log("😀", href);

  if (!href.includes("resrvtn_aplictn.do")) return;

  // showCurrentTime();

  chrome.storage.sync.get(null, async (values) => {
    const date = `${values.year}${values.month}${values.day}`;

    calendarRenderIntervalId = window.setInterval(() => {
      const days = document.querySelectorAll("#cal tbody a");

      if (days.length > 0) {
        clearInterval(calendarRenderIntervalId);
        days.forEach(async (aTag) => {
          if (aTag.href.includes(date)) {
            const match = aTag.href.match(
              /javascript:(\w+)\('(\d{8})','([^']+)'\)/
            );

            const date = match[2];
            const xDate = match[3];

            const fnString = `fn_tennis_time_list("${date}", "${xDate}")`;
            await forceClick(fnString);
          }
        });
      }
    }, 100);

    timeClickIntervalId = setInterval(() => {
      const time = document.querySelector(
        `input[name="dateTimeType"][value="${values.time}"]`
      );

      if (!time) {
        return;
      }

      if (!time.checked) {
        time.click();
        clearInterval(timeClickIntervalId);
      }
    }, 100);

    courtClickIntervalId = setInterval(async () => {
      if (!document.querySelector("#court_img_div")) return;

      if (document.querySelector("#court_img_div").childNodes.length === 0)
        return;

      clearInterval(courtClickIntervalId);
      forceClick(`fn_tennis_court_img1_setting(${values.court})`);

      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  });
};
