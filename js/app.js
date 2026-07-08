/* =====================================================
   벌교고 학생회 앱 - 메인 스크립트
   역할: data/notices.json을 읽어 학생회 공지를 자동으로 생성한다.
   ===================================================== */

// DOM이 모두 로드된 후 실행
document.addEventListener("DOMContentLoaded", function () {
  loadStudentCouncilNotices();
});

/**
 * 학생회 공지 데이터를 불러와 화면에 렌더링하는 함수
 * - data/notices.json을 fetch로 읽는다.
 * - 최근 공지 5개만 화면에 표시한다.
 * - 실패 시 안내 메시지를 표시한다.
 */
function loadStudentCouncilNotices() {
  const noticeListEl = document.getElementById("notice-list");

  fetch("./data/notices.json")
    .then(function (response) {
      // 응답 상태가 정상이 아니면 에러를 발생시켜 catch로 넘긴다.
      if (!response.ok) {
        throw new Error("공지 데이터를 불러오는 데 실패했습니다.");
      }
      return response.json();
    })
    .then(function (notices) {
      renderNoticeList(noticeListEl, notices);
    })
    .catch(function () {
      showNoticeErrorMessage(noticeListEl);
    });
}

/**
 * 공지 목록 데이터를 받아 <ul> 안에 리스트 아이템으로 렌더링하는 함수
 * @param {HTMLElement} listEl - 공지 목록을 담을 ul 요소
 * @param {Array} notices - { date, title } 형태의 공지 배열
 */
function renderNoticeList(listEl, notices) {
  // 공지가 비어있는 경우 처리
  if (!notices || notices.length === 0) {
    listEl.innerHTML =
      '<li class="notice-message">등록된 공지가 없습니다.</li>';
    return;
  }

  // 최근 공지 5개만 추출 (JSON 순서를 그대로 사용)
  const recentNotices = notices.slice(0, 5);

  // 기존 목록을 비우고 새로 생성
  listEl.innerHTML = "";

  recentNotices.forEach(function (notice) {
    const li = createNoticeListItem(notice);
    listEl.appendChild(li);
  });
}

/**
 * 공지 하나(date, title)를 받아 <li> 요소를 생성하는 함수
 * @param {Object} notice - { date: string, title: string }
 * @returns {HTMLLIElement}
 */
function createNoticeListItem(notice) {
  const li = document.createElement("li");
  li.className = "notice-item";

  const dateSpan = document.createElement("span");
  dateSpan.className = "notice-date";
  dateSpan.textContent = notice.date;

  const titleSpan = document.createElement("span");
  titleSpan.className = "notice-title";
  titleSpan.textContent = notice.title;

  li.appendChild(dateSpan);
  li.appendChild(titleSpan);

  return li;
}

/**
 * 공지 데이터를 불러오지 못했을 때 에러 메시지를 표시하는 함수
 * @param {HTMLElement} listEl - 공지 목록을 담을 ul 요소
 */
function showNoticeErrorMessage(listEl) {
  listEl.innerHTML =
    '<li class="notice-message">공지사항을 불러오지 못했습니다.</li>';
}
