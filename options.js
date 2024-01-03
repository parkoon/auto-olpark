/**
 * ---------------------------------------------------------------------------------
 * | 옵션 |
 * ---------------------------------------------------------------------------------
 **/
const submit = document.getElementById("submit");
const form = document.getElementById("form");
const url = document.getElementById("url");

submit.addEventListener("click", () => {
  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);
  console.log(
    "🚀 ~ file: options.js:13 ~ submit.addEventListener ~ formProps:",
    formProps
  );

  const { F_Month, F_Year, PART_CD, PLACE_CD, SITE_CD } = formProps;

  const url = `https://online.igangdong.or.kr/rent/list.do?SITE_CD=${SITE_CD}&PART_CD=${PART_CD}&PLACE_CD=${PLACE_CD}&F_Year=${F_Year}&F_Month=${F_Month}&d=m&flag=Next&agree1=Y`;
  chrome.storage.sync.set({ url, ...formProps }, () => {
    printUrl();
  });
});

function printUrl(data) {
  chrome.storage.sync.get("url", (data) => {
    url.href = data.url;
    url.innerHTML = data.url;
  });
}

printUrl();
